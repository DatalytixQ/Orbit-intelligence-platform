const sql = require('./db.js');
async function run() {
  const result = await sql`
    SELECT invoice_date 
    FROM raw_sales_lines 
    ORDER BY to_date(invoice_date, 'MM/DD/YYYY') DESC 
    LIMIT 10
  `;
  console.log('Top dates parsing MM/DD/YYYY:', result.map(r => r.invoice_date));
  
  const result2 = await sql`
    SELECT invoice_date 
    FROM raw_sales_lines 
    WHERE invoice_date LIKE '%2026%'
    LIMIT 10
  `;
  console.log('Some 2026 dates:', result2.map(r => r.invoice_date));
  process.exit(0);
}
run();
