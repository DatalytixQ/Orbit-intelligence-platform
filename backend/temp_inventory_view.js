require('dotenv').config();
const sql = require('./db.js');
async function run() {
  try {
    const kpi = await sql`SELECT pg_get_viewdef('kpi_inventory_coverage') AS def`;
    console.log('kpi_inventory_coverage:', kpi[0].def);
    const tbls = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%purchase%'`;
    console.log('purchase tables:', tbls);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
