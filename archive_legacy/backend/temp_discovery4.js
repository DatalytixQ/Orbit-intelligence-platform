const sql = require('./db');

async function run() {
  try {
    console.log("--- TABLE: raw_invoices or finance_ar_invoices ---");
    const testSales = await sql`
      SELECT date_trunc('month', invoice_date)::date as m, sum(amount_total) as sales
      FROM finance_ar_invoices
      WHERE invoice_date >= '2025-08-01'
      GROUP BY 1 ORDER BY 1
    `;
    console.log(testSales);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
