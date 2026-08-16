const sql = require('./db');
async function run() { 
  const res = await sql`SELECT definition FROM pg_views WHERE viewname='kpi_finance_dso_by_customer_v4'`; 
  console.log(res[0].definition); 
  process.exit(0); 
} 
run();
