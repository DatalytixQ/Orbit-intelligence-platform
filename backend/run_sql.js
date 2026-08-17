const fs = require('fs');
const path = require('path');
const sql = require('./db');

async function run() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Provee el path del archivo sql');
    process.exit(1);
  }
  try {
    const query = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
    await sql.unsafe(query);
    console.log(`✅ Archivo ${filePath} ejecutado exitosamente.`);
  } catch (e) {
    console.error('ERROR:', e.message);
  }
  process.exit(0);
}
run();
