require('dotenv').config();
const sql = require('./db.js');

async function run() {
  const result = await sql`
    SELECT 
      sl.document_number,
      TO_CHAR(sl.invoice_date, 'DD/MM/YYYY') as date,
      i.item_name,
      sl.line_net_amount
    FROM stg_sales_lines_clean sl
    JOIN customers c ON sl.customer_id = c.customer_internal_id
    LEFT JOIN items_master i ON sl.item_id = i.item_id
    WHERE c.customer_name ILIKE '%Sabbagh Ezra Martin%'
      AND sl.posting_period = 'jun 2026'
    ORDER BY sl.document_number, i.item_name
  `;
  
  console.table(result);
  console.log(`Total lines: ${result.length}`);
  
  const sum = await sql`
    SELECT sl.document_number, SUM(CAST(sl.line_net_amount AS NUMERIC)) as total_amount
    FROM stg_sales_lines_clean sl
    JOIN customers c ON sl.customer_id = c.customer_internal_id
    WHERE c.customer_name ILIKE '%Sabbagh Ezra Martin%'
      AND sl.posting_period = 'jun 2026'
    GROUP BY sl.document_number
    ORDER BY sl.document_number
  `;
  console.table(sum);

  process.exit(0);
}
run();
