const sql = require('./db');
async function run() {
  try {
    const s1 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'stg_inbound_shipments_clean'`;
    console.log("stg_inbound_shipments_clean:", s1.map(x=>x.column_name));
  } finally {
    sql.end();
  }
}
run();
