require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const raw = await sql`
      SELECT DISTINCT rule_id, insight_type, insight_description
      FROM public.vw_priority_engine
      ORDER BY rule_id
    `;
    console.log('Rules from Priority Engine:', raw);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
