require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const rules = await sql`select * from public.business_rules`;
    console.log(JSON.stringify(rules, null, 2));
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
