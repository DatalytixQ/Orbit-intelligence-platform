require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const tables = await sql`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    console.log('--- TABLES & VIEWS ---');
    console.log(tables.map(t => `${t.table_type}: ${t.table_name}`).join('\n'));

    const matviews = await sql`SELECT matviewname FROM pg_matviews WHERE schemaname = 'public'`;
    console.log('--- MAT VIEWS ---');
    console.log(matviews.map(m => m.matviewname).join('\n'));

    const funcs = await sql`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
    `;
    console.log('--- FUNCTIONS ---');
    console.log(funcs.map(f => f.routine_name).join('\n'));

  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
