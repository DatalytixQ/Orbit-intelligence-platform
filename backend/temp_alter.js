const sql = require('./db.js');
async function run() {
  await sql`ALTER TABLE public.raw_open_sales_orders ADD COLUMN IF NOT EXISTS last_modified_ts text;`;
  console.log("Column last_modified_ts added to raw_open_sales_orders");
  process.exit(0);
}
run();
