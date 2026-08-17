const sql = require('./db');
async function run() {
  try {
    const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name LIKE 'app_%' OR table_name LIKE 'config_%' OR table_name LIKE '%policy%' OR table_name LIKE '%settings%')`;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
