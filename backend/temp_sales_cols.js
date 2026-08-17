require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const rs = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'raw_sales'
    `;
    console.log('raw_sales:', rs.map(r => r.column_name).join(', '));
    const rs2 = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'raw_open_sales_orders'
    `;
    console.log('raw_open_sales_orders:', rs2.map(r => r.column_name).join(', '));
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
