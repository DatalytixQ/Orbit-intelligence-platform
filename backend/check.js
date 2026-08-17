const sql = require('./db');
async function run() {
  const res = await sql`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vw_priority_engine'`;
  console.log(res);
  process.exit(0);
}
run();
