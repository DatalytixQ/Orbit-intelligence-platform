const sql = require('./db');
async function run() {
  try {
    const res = await sql`SELECT * FROM public.app_settings`;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
