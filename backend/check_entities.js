const sql = require('./db');
async function run() {
  try {
    const res = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'stg_customers_clean'
    `;
    console.log("Customers:", res);
    
    const items = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'stg_items_master_clean'
    `;
    console.log("Items:", items);
  } finally {
    sql.end();
  }
}
run();
