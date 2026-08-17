const sql = require('./db');
async function run() {
  try {
    const s1 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'inventory_supply_semantic_current'`;
    const s2 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'stg_items_master_clean'`;
    console.log("inventory_supply_semantic_current:", s1.map(x=>x.column_name));
    console.log("stg_items_master_clean:", s2.map(x=>x.column_name));
  } finally {
    sql.end();
  }
}
run();
