const sql = require('./db.js');
async function run() {
  const result = await sql`
    SELECT table_type 
    FROM information_schema.tables 
    WHERE table_name = 'sales_lines'
  `;
  console.log('table_type:', result);
  process.exit(0);
}
run();
