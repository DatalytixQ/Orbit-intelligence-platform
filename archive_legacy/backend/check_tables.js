const sql = require('./db.js');

async function run() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    `;
    console.log(tables.map(t => t.table_name).sort());
  } catch(e) {
    console.error(e);
  }
  process.exit();
}
run();
