const sql = require('./db');

async function run() {
  try {
    console.log("--- SAMPLE CUSTOMER PAYMENTS ---");
    const payments = await sql`
      SELECT payment_date, payment_document_number, customer_id, payment_amount, applied_amount
      FROM customer_payments
      ORDER BY payment_date ASC
      LIMIT 3
    `;
    console.log(payments);
    
    console.log("--- LAST 3 CUSTOMER PAYMENTS ---");
    const lastPayments = await sql`
      SELECT payment_date, payment_document_number, customer_id, payment_amount, applied_amount
      FROM customer_payments
      ORDER BY payment_date DESC
      LIMIT 3
    `;
    console.log(lastPayments);

    console.log("--- FINANCE AR OPEN ITEMS ENRICHED SAMPLE ---");
    const arOpen = await sql`
      SELECT fecha, document_number, due_date, amount_total, amount_paid, open_balance
      FROM finance_ar_open_items_enriched
      WHERE tipo_transaccion = 'Factura de venta'
      ORDER BY fecha DESC
      LIMIT 3
    `;
    console.log(arOpen);

    console.log("--- AGGREGATE PAYMENTS BY MONTH ---");
    const aggPayments = await sql`
      SELECT date_trunc('month', payment_date)::date as m, sum(payment_amount) as total_payments
      FROM customer_payments
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 10
    `;
    console.log(aggPayments);

  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
