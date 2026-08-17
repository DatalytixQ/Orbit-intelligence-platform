const sql = require('./db');
async function run() {
  try {
    const s1 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'sales'`;
    const s2 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'finance_ar_open_items_cxc'`;
    const s3 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'finance_ar_snapshot_daily'`;
    console.log("sales:", s1.map(x=>x.column_name));
    console.log("finance_ar_open_items_cxc:", s2.map(x=>x.column_name));
    console.log("finance_ar_snapshot_daily:", s3.map(x=>x.column_name));
  } finally {
    sql.end();
  }
}
run();
