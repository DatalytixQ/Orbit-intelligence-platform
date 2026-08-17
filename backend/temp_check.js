const sql = require('./db.js');
async function run() {
  const res = await sql`
    SELECT 
      MAX(invoice_date) as max_invoice_date,
      MIN(invoice_date) as min_invoice_date,
      COUNT(*) as total_records,
      MAX(snapshot_ts) as max_snapshot_ts
    FROM raw_sales_lines
  `;
  console.log("Overall Stats:", res);
  
  const res2 = await sql`
    SELECT snapshot_ts, COUNT(*) as count 
    FROM raw_sales_lines 
    GROUP BY snapshot_ts 
    ORDER BY snapshot_ts DESC 
    LIMIT 5
  `;
  console.log("Group by snapshot_ts:", res2);
  process.exit(0);
}
run();
