require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const f = await sql`
      SELECT f.invoice_internal_id, p.applied_invoice_internal_id, p.total_paid
      FROM public.stg_ar_open_items_clean f
      JOIN (
        SELECT applied_invoice_internal_id, SUM(payment_amount) as total_paid
        FROM public.customer_payments
        GROUP BY applied_invoice_internal_id
      ) p ON f.invoice_internal_id = REPLACE(p.applied_invoice_internal_id, '.00', '')
      LIMIT 2
    `;
    console.log('finance match with replace:', f);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
