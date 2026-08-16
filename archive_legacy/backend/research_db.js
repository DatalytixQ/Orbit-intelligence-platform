require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const v = await sql`SELECT pg_get_viewdef('kpi_inventory_coverage')`;
    console.log('kpi_inventory_coverage view_def:\n', v[0]?.pg_get_viewdef);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
