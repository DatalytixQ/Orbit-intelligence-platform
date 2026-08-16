require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const salesStg = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'stg_sales_clean'`;
  console.log('stg_sales_clean columns:', salesStg.map(r => r.column_name));

  const transCount = await sql`SELECT count(*) FROM stg_inventory_transactions_clean WHERE quantity_signed < 0`;
  console.log('stg_inventory_transactions_clean outbound count:', transCount[0].count);

  const dso = await sql`SELECT * FROM kpi_finance_dso_monthly LIMIT 5`.catch(e => e.message);
  console.log('dso:', dso);

  process.exit(0);
}
run();
