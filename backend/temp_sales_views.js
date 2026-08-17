require('dotenv').config();
const sql = require('./db.js');
async function run() {
  try {
    const trend = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'vw_sales_monthly'`;
    console.log('vw_sales_monthly:', trend.map(r => r.column_name).join(', '));
    const cust = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'kpi_sales_concentration_customer'`;
    console.log('kpi_sales_concentration_customer:', cust.map(r => r.column_name).join(', '));
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
