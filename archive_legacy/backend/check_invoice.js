require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const res = await sql`
    SELECT sl.document_number, i.item_name, sl.line_net_amount
    FROM stg_sales_lines_clean sl 
    JOIN items_master i ON sl.item_id = i.item_id 
    WHERE sl.document_number LIKE '%47654%'
  `; 
  console.table(res);
  process.exit(0);
}
run();
