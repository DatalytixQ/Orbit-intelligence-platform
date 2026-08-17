require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    const s = await sql`
      SELECT invoice_date, amount_total FROM public.stg_sales_clean
      WHERE customer_id = '13344'
    `;
    console.log('Studio Luce STG Sales:', s);
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
