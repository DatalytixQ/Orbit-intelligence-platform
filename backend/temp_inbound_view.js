require('dotenv').config();
const sql = require('./db.js');
async function run() {
  try {
    const inbound = await sql`SELECT pg_get_viewdef('inbound_shipments_normalized') AS def`;
    console.log('inbound_shipments_normalized:', inbound[0].def);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
