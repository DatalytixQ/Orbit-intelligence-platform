const sql = require('./db');
async function run() {
  try {
    const res = await sql`
      SELECT pg_get_functiondef(oid)
      FROM pg_proc
      WHERE proname = 'get_policy_value'
    `;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
