const sql = require('./db');
async function run() {
  const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log(res);
  process.exit(0);
}
run();
