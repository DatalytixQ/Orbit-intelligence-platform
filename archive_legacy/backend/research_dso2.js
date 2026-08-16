require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const v = await sql`SELECT pg_get_viewdef('kpi_finance_dso_by_customer_v4')`;
    console.log('kpi_finance_dso_by_customer_v4 def:\n', v[0]?.pg_get_viewdef);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
