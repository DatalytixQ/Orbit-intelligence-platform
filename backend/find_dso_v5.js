const sql = require('./db');
async function run() {
  try {
    const res = await sql`
      SELECT viewname, definition 
      FROM pg_views 
      WHERE viewname = 'mv_kpi_finance_dso_action_list' OR viewname = 'kpi_finance_dso_by_customer_v5'
    `;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
