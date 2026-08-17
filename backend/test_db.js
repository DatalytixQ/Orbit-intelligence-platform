const sql = require('./db.js');
async function run() {
  try {
    const res = await sql`SELECT * FROM raw_ns_transaction_lines LIMIT 1`;
    console.log(res.length > 0 ? Object.keys(res[0]) : "table empty");
    const count = await sql`SELECT count(*) FROM raw_ns_transaction_lines`;
    console.log("Count:", count[0]);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
