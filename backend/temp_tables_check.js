require('dotenv').config({path: '../.env'});
const sql = require('./db');
async function run() {
  const r = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  console.log(r);
  process.exit(0);
}
run();
