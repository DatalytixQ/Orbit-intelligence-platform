const sql = require('./db');

async function run() {
  try {
    console.log("--- VIEW DEFINITIONS ---");
    const views = await sql`
      SELECT viewname, definition 
      FROM pg_views 
      WHERE viewname IN ('finance_ar_open_items_cxc')
    `;
    console.log(views);

    console.log("--- TABLE SCHEMAS ---");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE '%invoice%' OR table_name LIKE '%payment%' OR table_name LIKE '%ar%')
    `;
    console.log(tables.map(t => t.table_name));

    console.log("--- SAMPLE CUSTOMER PAYMENTS ---");
    const payments = await sql`
      SELECT payment_date, payment_document_number, customer_id, payment_amount, unapplied_amount
      FROM customer_payments
      ORDER BY payment_date DESC
      LIMIT 5
    `;
    console.log(payments);
    
    const firstPayment = await sql`
      SELECT min(payment_date) as first_payment
      FROM customer_payments
    `;
    console.log("First payment date:", firstPayment[0]);

  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
