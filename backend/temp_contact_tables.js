require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const raw = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name ILIKE '%contact%' OR table_name ILIKE '%address%'
    `;
    console.log('Tables:', raw.map(t => t.table_name).join(', '));
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
