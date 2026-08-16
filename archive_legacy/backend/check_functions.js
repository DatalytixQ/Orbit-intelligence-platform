const sql = require('./db.js');
async function run() {
  const fns = await sql`SELECT routine_name FROM information_schema.routines WHERE routine_schema='public'`;
  console.log(fns.map(f => f.routine_name).filter(n => n.includes('refresh') || n.includes('load') || n.includes('process')));
  process.exit(0);
}
run();
