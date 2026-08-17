require('dotenv').config({path: '../.env'});
const sql = require('./db');
async function run() {
  const r = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'app_users'
  `;
  console.log(r);
  process.exit(0);
}
run();
