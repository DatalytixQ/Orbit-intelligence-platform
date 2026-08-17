require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const raw = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'raw_open_sales_orders' OR table_name = 'open_sales_order_demand'
    `;
    console.log('Open OV columns:', raw);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
