require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const rules = await sql`select table_name from information_schema.tables where table_name ilike '%rule%' or table_name ilike '%kpi%' or table_name ilike '%vw_%'`;
    console.log(rules.map(r => r.table_name).join('\n'));
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
