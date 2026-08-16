require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const result = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'customers'`;
  console.log('Columns in customers table:', result.map(r => r.column_name));
  
  process.exit(0);
}

run();
