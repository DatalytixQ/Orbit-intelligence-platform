require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const raw = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'vw_priority_engine'
    `;
    console.log('Columns:', raw);

    const rules = await sql`
      SELECT *
      FROM public.vw_priority_engine
      LIMIT 10
    `;
    console.log('Rules:', rules);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
