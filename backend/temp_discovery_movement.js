require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const raw = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'vw_inventory_item_movement_health'
    `;
    console.log('Columns:', raw);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
