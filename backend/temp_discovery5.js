require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const res = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'kpi_inventory_coverage'
    `;
    console.log('kpi_inventory_coverage columns:', res);
    
    // Also check sales_lines or similar for OVs
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name ILIKE '%sales%'
    `;
    console.log('Sales tables:', tables);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
