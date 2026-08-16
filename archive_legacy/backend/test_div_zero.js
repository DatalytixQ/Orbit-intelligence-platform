const sql = require('./db.js');
async function run() {
  try {
    const res = await sql`SELECT (79.4 / 0.0) as val`;
    console.log('Result:', res);
  } catch(e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}
run();
