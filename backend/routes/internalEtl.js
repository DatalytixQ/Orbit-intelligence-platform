const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

// Middleware de seguridad básico para n8n
const requireInternalAuth = (req, res, next) => {
  const apiKey = req.headers['x-internal-api-key'];
  // En producción, usar variable de entorno. Aquí hardcodeada para demostración/MVP.
  const validKey = process.env.INTERNAL_API_KEY || 'n8n_secret_token_123';
  
  if (apiKey !== validKey) {
    return res.status(401).json({ ok: false, error: 'Unauthorized. Invalid internal API key.' });
  }
  next();
};

router.use(requireInternalAuth);

// Mapa de scripts permitidos para evitar ejecución arbitraria de comandos
const allowedScripts = {
  'etl-full': 'run_etl.py',
  'master-data': 'run_master_data.py',
  'transactions': 'run_tx_full.py',
  'exchange-rates': 'run_exchange_rates.py'
};

router.post("/execute/:jobId", (req, res) => {
  const { jobId } = req.params;
  const scriptName = allowedScripts[jobId];

  if (!scriptName) {
    return res.status(400).json({ ok: false, error: `Invalid Job ID: ${jobId}` });
  }

  const scriptPath = path.join(__dirname, '..', scriptName);

  // Ejecutamos el script de manera asíncrona sin bloquear Node.js
  const pythonProcess = spawn('python', [scriptPath], {
    cwd: path.join(__dirname, '..'), // ejecutar en la carpeta backend
  });

  let outputData = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (data) => {
    outputData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
  });

  pythonProcess.on('close', (code) => {
    console.log(`[n8n Internal ETL] Job ${jobId} finished with code ${code}`);
    // Opcionalmente se podría enviar un webhook de vuelta a n8n aquí si fue un request asíncrono largo.
  });

  // Para evitar timeouts de HTTP en jobs largos, retornamos 202 Accepted inmediatamente.
  // En un esquema más complejo, se devuelve un job_id y n8n hace polling.
  res.status(202).json({
    ok: true,
    message: `Job ${jobId} started successfully`,
    script: scriptName,
    status: 'running'
  });
});

module.exports = router;
