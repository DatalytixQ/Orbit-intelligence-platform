require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const s = await sql`SELECT invoice_internal_id, amount_ars, customer_name FROM public.sales LIMIT 2`;
    console.log('sales sample:', s);

    const f = await sql`SELECT document_number, amount_total, amount_paid, open_balance FROM public.finance_ar_open_items WHERE amount_paid > 0 LIMIT 2`;
    console.log('finance sample with payments:', f);

    const v = await sql`SELECT count(*) FROM public.finance_ar_open_items_cxc`;
    console.log('cxc view count:', v);

    const d = await sql`
      SELECT sum(open_balance) 
      FROM public.finance_ar_open_items_cxc 
      WHERE customer_internal_id = '13344'
    `;
    console.log('Studio Luce open_balance in view:', d);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
