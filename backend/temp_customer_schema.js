require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const raw = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'dim_customers'
    `;
    console.log('dim_customers Columns:', raw);
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name ILIKE '%contact%' OR table_name ILIKE '%sale%' OR table_name ILIKE '%order%'
    `;
    console.log('Related Tables:', tables.map(t => t.table_name).join(', '));
    
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
