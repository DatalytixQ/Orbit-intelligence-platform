const sql = require('./db.js');
async function run() {
  const raw = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'raw_sales_lines'`;
  console.log('RAW SALES LINES:', raw);
  const final = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sales_lines'`;
  console.log('SALES LINES:', final);
  process.exit(0);
}
run();
