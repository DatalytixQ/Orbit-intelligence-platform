const sql = require('./db');
async function run() {
  try {
    const views = await sql`SELECT viewname, definition FROM pg_views WHERE viewname LIKE 'vw_kpi_%' OR viewname LIKE 'mv_kpi_%'`;
    for(const v of views) {
      console.log('--- ' + v.viewname);
      console.log(v.definition);
    }
  } catch (e) { console.error(e); }
  process.exit(0);
}
run();
