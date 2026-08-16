require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const t = await sql`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_name IN ('kpi_inventory_item_snapshot', 'kpi_item_demand_3m')
    `;
    console.log('tables:', t);
    
    const m = await sql`
      SELECT matviewname FROM pg_matviews 
      WHERE matviewname IN ('kpi_inventory_item_snapshot', 'kpi_item_demand_3m')
    `;
    console.log('matviews:', m);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
