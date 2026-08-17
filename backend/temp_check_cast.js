const sql = require('./db.js');
async function run() {
  try {
    const res = await sql`SELECT MAX(CAST(last_modified_ts AS timestamp)) as max_ts FROM raw_sales_lines`;
    console.log(res);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
