const sql = require('./db');
async function run() {
  try {
    const cxc = await sql`SELECT * FROM public.finance_ar_open_items_cxc LIMIT 1`;
    const snap = await sql`SELECT * FROM public.finance_ar_snapshot_daily LIMIT 1`;
    console.log("CXC:", Object.keys(cxc[0] || {}));
    console.log("SNAP:", Object.keys(snap[0] || {}));
  } catch(e) { console.error(e); }
  process.exit(0);
}
run();
