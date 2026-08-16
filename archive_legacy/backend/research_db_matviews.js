require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const matviews = await sql`SELECT matviewname FROM pg_matviews`;
    console.log('Materialized Views:', matviews.map(r => r.matviewname));

    const dsoData = await sql`
      SELECT customer_name, dso_days, overdue_balance, overdue_90_balance 
      FROM public.mv_kpi_finance_dso_action_list 
      WHERE customer_name ILIKE '%Studio Luce%'
    `;
    console.log('Studio Luce DSO from MV:', dsoData);

  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
