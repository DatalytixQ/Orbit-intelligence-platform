const sql = require('./db');
async function run() {
  try {
    const res = await sql`
      SELECT definition FROM pg_views WHERE viewname = 'kpi_finance_dso_by_customer_v4'
      UNION ALL
      SELECT definition FROM pg_matviews WHERE matviewname = 'kpi_finance_dso_by_customer_v4'
    `;
    console.log(res[0]);
  } catch(e) { console.error(e); }
  process.exit(0);
}
run();
