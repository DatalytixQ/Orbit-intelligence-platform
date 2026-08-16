const sql = require('./db.js');
async function run() {
  const result = await sql`select item_name, stock_available, avg_monthly_qty_3m, stock_coverage_months, coverage_ratio, coverage_status from kpi_inventory_coverage where item_name like '%PAR-TROU 4-8W-DIMT-B-3000K-220V%' or item_name like '%VK-NECK T 9535-SPRING%'`;
  console.log(result);
  process.exit(0);
}
run();
