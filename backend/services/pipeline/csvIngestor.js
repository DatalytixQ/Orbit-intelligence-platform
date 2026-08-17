const path = require('path');
const fs = require('fs').promises;
const { SCHEMA } = require('./schemaRegistry');
const { detectEntity, parseCSV } = require('./fileParser');
const { runQAChecks } = require('./qaChecks');
const { loadToRaw, startRunLog, endRunLog, logStep, logError, checkIfProcessed } = require('./dbLoader');
const { refreshViews } = require('./viewRefresher');

const INBOUND_DIR = path.join(__dirname, '../../../inbound');
const PROCESSED_DIR = path.join(__dirname, '../../../processed');
const ERRORS_DIR = path.join(__dirname, '../../../errors');

async function processFile(filename) {
  let runId = null;
  let entityStr = 'unknown';
  let startTime = new Date();

  try {
    // 1. Parse filename
    const entityInfo = detectEntity(filename);
    if (!entityInfo) {
      await moveFileToError(filename, 'unrecognized');
      return { ok: false, step: 'parse_filename', error: 'Unrecognized filename format' };
    }
    
    const { entity, dateStr } = entityInfo;
    entityStr = entity;
    const config = SCHEMA[entity];

    // Check if already processed
    const alreadyProcessed = await checkIfProcessed(filename);
    if (alreadyProcessed) {
      // Move to processed just in case it was left behind, but skip pipeline
      await moveFileToProcessed(filename, dateStr);
      return { ok: true, skipped: true, reason: 'Already processed successfully' };
    }

    // Initialize run log
    runId = await startRunLog(entity, filename);

    // 2. Parse CSV
    const filepath = path.join(INBOUND_DIR, filename);
    let data;
    try {
      data = await parseCSV(filepath, config);
      await logStep(runId, 'parse_csv', 'success', `Parsed ${data.length} rows`, startTime);
    } catch (e) {
      await logError(runId, filename, entity, 'parse_csv', e.message);
      await logStep(runId, 'parse_csv', 'error', e.message, startTime);
      await endRunLog(runId, 'failed', e.message);
      await moveFileToError(filename, dateStr, `${filename}_ERROR.log`, e.message);
      return { ok: false, step: 'parse_csv', error: e.message };
    }

    if (data.length === 0) {
      const msg = 'File is empty';
      await logError(runId, filename, entity, 'parse_csv', msg);
      await endRunLog(runId, 'failed', msg);
      return { ok: false, step: 'parse_csv', error: msg };
    }

    // 3. QA Checks
    startTime = new Date();
    const qa = runQAChecks(entity, data);
    if (!qa.ok) {
      const msg = `QA failed with ${qa.errors.length} errors`;
      await logError(runId, filename, entity, 'qa_check', msg, qa.errors);
      await logStep(runId, 'qa_check', 'error', msg, startTime);
      await endRunLog(runId, 'failed', msg);
      await moveFileToError(filename, dateStr, `${filename}_QA_ERROR.log`, JSON.stringify(qa.errors, null, 2));
      return { ok: false, step: 'qa_check', error: msg, details: qa.errors };
    }
    await logStep(runId, 'qa_check', 'success', null, startTime);

    // 4. DB Load (RAW)
    startTime = new Date();
    try {
      const inserted = await loadToRaw(config.raw_table, data);
      await logStep(runId, 'raw_load', 'success', `Inserted ${inserted} rows into ${config.raw_table}`, startTime);
      
      // STG LOAD skipped for MVP because it implies business logic that might be complex
      // but if we had it, we would execute an INSERT INTO stg SELECT FROM raw query here
      
    } catch (e) {
      await logError(runId, filename, entity, 'raw_load', e.message);
      await logStep(runId, 'raw_load', 'error', e.message, startTime);
      await endRunLog(runId, 'failed', e.message);
      return { ok: false, step: 'raw_load', error: e.message };
    }

    // 5. Refresh Views
    startTime = new Date();
    if (config.refreshes && config.refreshes.length > 0) {
      try {
        await refreshViews(config.refreshes);
        await logStep(runId, 'refresh_views', 'success', `Refreshed ${config.refreshes.join(', ')}`, startTime);
      } catch (e) {
        // We log but don't fail the pipeline entirely if view refresh fails
        await logError(runId, filename, entity, 'refresh_views', e.message);
        await logStep(runId, 'refresh_views', 'error', e.message, startTime);
      }
    } else {
      await logStep(runId, 'refresh_views', 'success', 'No views to refresh', startTime);
    }

    // 6. Move File
    startTime = new Date();
    try {
      await moveFileToProcessed(filename, dateStr);
      await logStep(runId, 'move_file', 'success', null, startTime);
    } catch (e) {
      await logError(runId, filename, entity, 'move_file', e.message);
      await logStep(runId, 'move_file', 'error', e.message, startTime);
      await endRunLog(runId, 'failed', 'Load OK but failed to move file');
      return { ok: false, step: 'move_file', error: e.message };
    }

    // 7. End
    await endRunLog(runId, 'success', `Successfully processed ${data.length} rows`);
    return { ok: true, run_id: runId, rows_loaded: data.length, duration: (new Date() - startTime)/1000 };

  } catch (err) {
    if (runId) {
      await logError(runId, filename, entityStr, 'unknown', err.message);
      await endRunLog(runId, 'failed', err.message);
    }
    return { ok: false, step: 'unknown', error: err.message };
  }
}

async function moveFileToProcessed(filename, dateStr) {
  const destDir = path.join(PROCESSED_DIR, dateStr);
  await fs.mkdir(destDir, { recursive: true });
  await fs.rename(path.join(INBOUND_DIR, filename), path.join(destDir, filename));
}

async function moveFileToError(filename, subfolder, logFilename = null, logContent = null) {
  const destDir = path.join(ERRORS_DIR, subfolder);
  await fs.mkdir(destDir, { recursive: true });
  
  try {
    await fs.rename(path.join(INBOUND_DIR, filename), path.join(destDir, filename));
  } catch (e) {
    // maybe file doesn't exist anymore
  }

  if (logFilename && logContent) {
    await fs.writeFile(path.join(destDir, logFilename), logContent);
  }
}

module.exports = { processFile };
