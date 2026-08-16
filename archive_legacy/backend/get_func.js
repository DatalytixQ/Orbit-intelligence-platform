require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const res = await sql`SELECT pg_get_functiondef('refresh_inventory_supply_snapshot'::regproc)`;
  console.log(res[0].pg_get_functiondef);
  process.exit(0);
}
run();
