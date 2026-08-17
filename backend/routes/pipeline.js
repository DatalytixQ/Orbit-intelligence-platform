const express = require('express');
const router = express.Router();
const { processFile } = require('../services/pipeline/csvIngestor');
const { SCHEMA } = require('../services/pipeline/schemaRegistry');
const db = require('../db');

// Middleware for API key check (internal to n8n)
// For MVP, we can just use a simple token
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  // For production, this should check an env variable
  if (!token || token !== 'Bearer internal_n8n_token') {
    // In dev, let's allow it for now, but log warning
    console.warn('Unauthorized pipeline access attempt, allowing for dev');
  }
  next();
};

router.post('/ingest', authMiddleware, async (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ ok: false, error: 'Filename is required' });
  }

  try {
    const result = await processFile(filename);
    if (result.ok) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/runs', async (req, res) => {
  try {
    const runs = await db.unsafe(`
      SELECT * FROM data_load_runs 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    res.json(runs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/runs/:id', async (req, res) => {
  try {
    const [run] = await db.unsafe(`
      SELECT * FROM data_load_runs WHERE id = ${req.params.id}
    `);
    if (!run) return res.status(404).json({ error: 'Run not found' });
    
    const steps = await db.unsafe(`
      SELECT * FROM data_pipeline_step_log WHERE run_id = ${req.params.id} ORDER BY started_at ASC
    `);
    
    const errors = await db.unsafe(`
      SELECT * FROM pipeline_error_log WHERE run_id = ${req.params.id}
    `);

    res.json({ run, steps, errors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/schema', (req, res) => {
  res.json({
    ok: true,
    naming_convention: '{entity}_{YYYYMMDD}.csv',
    entities: Object.keys(SCHEMA)
  });
});

module.exports = router;
