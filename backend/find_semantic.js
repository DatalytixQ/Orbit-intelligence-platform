const sql = require('./db');
async function run() {
  try {
    const res = await sql`
      SELECT viewname, definition 
      FROM pg_views 
      WHERE viewname = 'inventory_supply_semantic_current'
    `;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
