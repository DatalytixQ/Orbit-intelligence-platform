require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const res = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE '%inventory%'
  `;
  console.log(res.map(r => r.table_name));
  process.exit(0);
}
run();
