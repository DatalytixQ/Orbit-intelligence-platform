const sql = require('./db.js');
async function run() {
  const result = await sql`SELECT max(invoice_date) as max FROM sales_lines`;
  console.log('Max date sales_lines:', result[0].max);
  process.exit(0);
}
run();
