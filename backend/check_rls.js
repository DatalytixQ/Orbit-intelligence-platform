const sql = require('./db');
async function run() {
  try {
    const res = await sql`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE relkind = 'r' AND relname IN (
        'sales', 'finance_ar_open_items_cxc', 'finance_ar_snapshot_daily',
        'open_sales_order_demand', 'stg_customers_clean', 'stg_items_master_clean',
        'inventory_supply_semantic_current'
      )
    `;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
