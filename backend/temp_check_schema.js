const sql = require('./db.js');
async function run() {
  const tables = ['raw_sales_lines', 'raw_open_sales_orders', 'raw_customers'];
  for (const table of tables) {
    const res = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = ${table};
    `;
    console.log(`Schema for ${table}:`, res);
  }
  process.exit(0);
}
run();
