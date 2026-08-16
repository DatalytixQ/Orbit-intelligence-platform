const sql = require('./db');

async function run() {
  try {
    console.log("--- MONTHLY INVOICES VS PAYMENTS ---");
    const data = await sql`
      WITH monthly_invoices AS (
        SELECT date_trunc('month', fecha)::date as m, sum(amount_total) as sales
        FROM finance_ar_open_items_enriched
        WHERE tipo_transaccion = 'Factura de venta'
        GROUP BY 1
      ),
      monthly_payments AS (
        SELECT date_trunc('month', payment_date)::date as m, sum(payment_amount) as payments
        FROM customer_payments
        GROUP BY 1
      )
      SELECT 
        COALESCE(i.m, p.m) as month, 
        COALESCE(i.sales, 0) as sales, 
        COALESCE(p.payments, 0) as payments
      FROM monthly_invoices i
      FULL OUTER JOIN monthly_payments p ON i.m = p.m
      WHERE COALESCE(i.m, p.m) >= '2025-08-01'
      ORDER BY 1
    `;
    console.log(data);

  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
