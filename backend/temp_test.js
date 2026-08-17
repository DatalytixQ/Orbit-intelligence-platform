const sql = require('./db.js');
async function run() {
  const res = await sql`SELECT document_number, customer_id, line_net_amount, transaction_date FROM raw_open_sales_orders LIMIT 5`;
  console.log(res);
  process.exit(0);
}
run();
