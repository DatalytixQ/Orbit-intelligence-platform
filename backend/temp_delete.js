const sql = require('./db.js');
async function run() {
  await sql`DELETE FROM raw_sales_lines WHERE snapshot_ts > '2026-07-20 14:19:00'`;
  await sql`DELETE FROM raw_open_sales_orders WHERE snapshot_ts > '2026-07-20 14:22:00'`;
  await sql`DELETE FROM raw_customers WHERE snapshot_ts > '2026-05-27 07:07:00'`;
  console.log("Deleted erroneous delta loads");
  process.exit(0);
}
run();
