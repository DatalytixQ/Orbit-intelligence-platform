require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const v3 = await sql`SELECT pg_get_viewdef('kpi_finance_dso_by_customer_v3')`.catch(() => null);
    if(v3) console.log('v3 def:\n', v3[0]?.pg_get_viewdef);
    const v2 = await sql`SELECT pg_get_viewdef('kpi_finance_dso_by_customer_v2')`.catch(() => null);
    if(v2) console.log('v2 def:\n', v2[0]?.pg_get_viewdef);
    const v1 = await sql`SELECT pg_get_viewdef('kpi_finance_dso_by_customer')`.catch(() => null);
    if(v1) console.log('v1 def:\n', v1[0]?.pg_get_viewdef);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
