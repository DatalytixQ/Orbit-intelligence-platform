const sql = require('./db.js');
async function run() {
  console.log('Stg Sales Clean count:', (await sql`select count(*) from stg_sales_clean`)[0].count);
  console.log('Stg Sales Clean max date:', (await sql`select max(invoice_date) as max from stg_sales_clean`)[0].max);
  console.log('Stg Sales Lines Clean count:', (await sql`select count(*) from stg_sales_lines_clean`)[0].count);
  console.log('Stg Sales Lines Clean max date:', (await sql`select max(invoice_date) as max from stg_sales_lines_clean`)[0].max);
  
  const rawDates = await sql`select invoice_date from raw_sales_lines order by 1 desc limit 5`;
  console.log('Raw dates sample:', rawDates);
  
  process.exit(0);
}
run();
