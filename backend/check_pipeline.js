const sql = require('./db.js');
async function run() {
  const res = await sql`SELECT DISTINCT tipo_transaccion, document_status FROM sales`;
  console.log(res);
  process.exit(0);
}
run();
