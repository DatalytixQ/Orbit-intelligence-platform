require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const raw = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'kpi_finance_dso_by_customer_v5'
    `;
    console.log('Columns:', raw);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
