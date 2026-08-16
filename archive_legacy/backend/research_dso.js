require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const v = await sql`SELECT pg_get_viewdef('vw_kpi_finance_dso_action_list_base')`.catch(() => null);
    if(v) console.log('vw base def:\n', v[0]?.pg_get_viewdef);

    const m = await sql`SELECT pg_get_viewdef('mv_kpi_finance_dso_action_list')`.catch(() => null);
    if(m) console.log('mv def:\n', m[0]?.pg_get_viewdef);
    
    // Also check DSO functions
    const dsoRoute = await sql`SELECT routine_name FROM information_schema.routines WHERE routine_name LIKE '%dso%'`;
    console.log('DSO functions:', dsoRoute.map(r => r.routine_name));

  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
