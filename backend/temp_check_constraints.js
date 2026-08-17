const sql = require('./db');
async function run() {
  try {
    const res = await sql`SELECT conname, contype, relname FROM pg_constraint c JOIN pg_class r ON r.oid = c.conrelid WHERE relname LIKE 'raw_ns_%' AND contype IN ('p', 'u')`;
    console.log(res);
  } catch (e) { console.error(e); }
  process.exit(0);
}
run();
