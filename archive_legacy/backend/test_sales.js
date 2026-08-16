const sql = require('./db');
async function run() {
  const res = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'items_master'
  `;
  console.log(res);
  process.exit(0);
}
run();
