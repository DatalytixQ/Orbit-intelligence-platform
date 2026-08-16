require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const crit = await sql`
    SELECT item_id, item_name, stock_available, avg_monthly_qty_3m, stock_coverage_months, coverage_status, inventory_value 
    FROM kpi_inventory_top_critical_items
  `;
  console.log('Top Critical Items:', crit);

  const dsoRoute = await sql`SELECT routine_name FROM information_schema.routines WHERE routine_name LIKE '%dso%'`;
  console.log('DSO functions:', dsoRoute.map(r => r.routine_name));

  const arViews = await sql`SELECT table_name FROM information_schema.views WHERE table_name LIKE '%ar_open%'`;
  console.log('AR views:', arViews.map(r => r.table_name));

  process.exit(0);
}
run();
