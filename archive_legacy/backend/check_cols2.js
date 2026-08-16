require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const inv = await sql`SELECT * FROM stg_inventory_clean LIMIT 1`;
  console.log('stg_inventory_clean:', inv[0]);

  const ar = await sql`SELECT * FROM stg_ar_open_items_clean LIMIT 1`;
  console.log('stg_ar_open_items_clean:', ar[0]);

  process.exit(0);
}
run();
