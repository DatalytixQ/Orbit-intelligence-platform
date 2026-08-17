require('dotenv').config({path: '../.env'});
const sql = require('./db');
async function run() {
  const r = await sql`select pg_get_viewdef('vw_inventory_executive_coverage', true)`;
  console.log(r[0].pg_get_viewdef);
  process.exit(0);
}
run();
