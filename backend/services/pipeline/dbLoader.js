const db = require('../../db');

/**
 * Inserts data into the specified table using a batch insert
 */
async function loadToRaw(tableName, data) {
  if (data.length === 0) return 0;
  
  // Truncate the table first to refresh
  await db.unsafe(`TRUNCATE TABLE public.${tableName}`);
  
  // Create batch insert query
  // We can insert in chunks of 1000 rows to prevent memory and postgres parameter limits
  const chunkSize = 1000;
  let totalInserted = 0;
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await db`INSERT INTO ${db(tableName)} ${db(chunk)}`;
    totalInserted += chunk.length;
  }
  
  return totalInserted;
}

/**
 * Creates a run log in data_load_runs
 */
async function startRunLog(entity, filename) {
  const run = await db`
    INSERT INTO data_load_runs (client_id, source_system, snapshot_ts, scope, status, started_at, notes)
    VALUES ('vonderk', 'netsuite', NOW(), ${entity}, 'running', NOW(), ${`File: ${filename}`})
    RETURNING id
  `;
  return run[0].id;
}

/**
 * Updates a run log
 */
async function endRunLog(runId, status, notes = null) {
  if (notes) {
    await db`
      UPDATE data_load_runs 
      SET status = ${status}, finished_at = NOW(), notes = ${notes}
      WHERE id = ${runId}
    `;
  } else {
    await db`
      UPDATE data_load_runs 
      SET status = ${status}, finished_at = NOW()
      WHERE id = ${runId}
    `;
  }
}

/**
 * Logs a step in the pipeline
 */
async function logStep(runId, stepName, status, msg = null, startTime = null) {
  let duration = null;
  if (startTime) {
    duration = (new Date() - startTime) / 1000;
  }
  
  await db`
    INSERT INTO data_pipeline_step_log 
      (run_id, pipeline_name, step_name, status, message, started_at, finished_at, duration_seconds)
    VALUES 
      (${runId}, 'csv_ingestion', ${stepName}, ${status}, ${msg ? msg.substring(0, 500) : null}, ${startTime || new Date()}, NOW(), ${duration})
  `;
}

/**
 * Logs errors in pipeline_error_log
 */
async function logError(runId, filename, entity, step, msg, errors = []) {
  if (errors.length > 0) {
    const errorLogs = errors.map(e => ({
      run_id: runId,
      filename,
      entity,
      step,
      error_code: 'QA_FAILED',
      error_msg: e.msg,
      row_number: e.row,
      raw_value: e.col
    }));
    await db`INSERT INTO pipeline_error_log ${db(errorLogs)}`;
  } else {
    await db`
      INSERT INTO pipeline_error_log (run_id, filename, entity, step, error_code, error_msg)
      VALUES (${runId}, ${filename}, ${entity}, ${step}, 'PIPELINE_ERROR', ${msg})
    `;
  }
}

/**
 * Checks if a file has already been successfully processed
 */
async function checkIfProcessed(filename) {
  const result = await db`
    SELECT id FROM data_load_runs 
    WHERE notes = ${`File: ${filename}`} 
      AND status = 'success'
    LIMIT 1
  `;
  return result.length > 0;
}

module.exports = {
  loadToRaw,
  startRunLog,
  endRunLog,
  logStep,
  logError,
  checkIfProcessed
};
