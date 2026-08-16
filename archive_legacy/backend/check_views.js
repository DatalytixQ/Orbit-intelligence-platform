require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const queries = [
    "SELECT pg_get_viewdef('kpi_top_10_customer_sales_participation_2026')",
    "SELECT pg_get_viewdef('kpi_sales_top_reps_2026')",
    "SELECT pg_get_viewdef('kpi_inventory_top_critical_items')",
    "SELECT pg_get_viewdef('vw_inventory_coverage_semantic')"
  ];

  for(let q of queries) {
    try {
      const res = await sql.unsafe(q);
      console.log(`\n=== ${q} ===\n`);
      console.log(res[0].pg_get_viewdef);
    } catch(e) {
      console.error(`Error executing ${q}:`, e.message);
    }
  }

  process.exit(0);
}
run();
