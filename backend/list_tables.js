const sql = require('./db');
async function run() {
  try {
    const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
