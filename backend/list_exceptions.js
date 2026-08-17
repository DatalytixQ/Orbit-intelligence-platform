const sql = require('./db');
async function run() {
  try {
    const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%exception%'`;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
