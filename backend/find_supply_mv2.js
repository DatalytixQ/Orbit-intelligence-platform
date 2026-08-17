const sql = require('./db');
async function run() {
  try {
    const res = await sql`
      SELECT table_name FROM information_schema.tables WHERE table_name = 'open_sales_order_demand'
    `;
    console.log(res);
  } finally {
    sql.end();
  }
}
run();
