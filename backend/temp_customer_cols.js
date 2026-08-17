require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const raw = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'customers'
    `;
    console.log('customers Columns:', raw.map(r => r.column_name).join(', '));
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
