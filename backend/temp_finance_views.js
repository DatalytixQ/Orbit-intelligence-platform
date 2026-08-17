require('dotenv').config();
const sql = require('./db.js');
async function run() {
  try {
    const raw = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'vw_ar_open_sales_invoices_base'`;
    console.log('vw_ar_open_sales_invoices_base:', raw.map(r => r.column_name).join(', '));
    const trend = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'vw_kpi_finance_dso_trend'`;
    console.log('vw_kpi_finance_dso_trend:', trend.map(r => r.column_name).join(', '));
    const forecast = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'vw_cash_collection_forecast'`;
    console.log('vw_cash_collection_forecast:', forecast.map(r => r.column_name).join(', '));
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
