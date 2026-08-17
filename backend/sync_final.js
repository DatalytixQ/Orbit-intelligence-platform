const sql = require('./db.js');

async function run() {
  console.log('Syncing Final Tables from STG with full denormalization...');

  try {
    console.log('Syncing sales...');
    await sql`TRUNCATE TABLE public.sales CASCADE`;
    await sql`
      INSERT INTO public.sales (
        invoice_internal_id, document_number, customer_internal_id, fecha, periodo,
        source_system, client_id, snapshot_ts, due_date, document_status, amount_net, amount_tax, amount_total,
        amount_ars, customer_name
      )
      SELECT 
        s.invoice_internal_id, s.document_number, s.customer_id, s.invoice_date, s.posting_period,
        s.source_system, s.client_id, s.snapshot_ts, s.due_date, s.document_status, 
        s.amount_net, s.amount_tax, s.amount_total,
        (s.amount_net * COALESCE(s.exchange_rate, 1)), c.customer_name
      FROM public.stg_sales_clean s
      LEFT JOIN public.customers c ON s.customer_id = c.customer_internal_id
    `;
    console.log('sales updated.');

    console.log('Syncing sales_lines...');
    await sql`TRUNCATE TABLE public.sales_lines CASCADE`;
    await sql`
      INSERT INTO public.sales_lines (
        source_system, client_id, snapshot_ts, invoice_id, document_number, line_id,
        invoice_date, posting_period, customer_id, item_id, quantity, unit_price_net,
        line_discount_amount, line_net_amount, line_tax_amount, line_total_amount
      )
      SELECT 
        sl.source_system, sl.client_id, sl.snapshot_ts, sl.invoice_id, sl.document_number, sl.line_id,
        sl.invoice_date, sl.posting_period, sl.customer_id, sl.item_id, sl.quantity, sl.unit_price_net,
        sl.line_discount_amount, sl.line_net_amount, sl.line_tax_amount, sl.line_total_amount
      FROM public.stg_sales_lines_clean sl
    `;
    console.log('sales_lines updated.');

    console.log('Syncing finance_ar_open_items...');
    await sql`TRUNCATE TABLE public.finance_ar_open_items CASCADE`;
    await sql`
      INSERT INTO public.finance_ar_open_items (
        source_system, client_id, snapshot_ts, invoice_internal_id, document_number,
        invoice_date, due_date, customer_id, subsidiary_id,
        currency, exchange_rate, amount_total, amount_paid, open_balance,
        document_type
      )
      SELECT 
        f.source_system, f.client_id, f.snapshot_ts, f.invoice_internal_id, f.document_number,
        f.invoice_date, f.due_date, f.customer_id, f.subsidiary_id,
        f.currency, f.exchange_rate, f.amount_total, 
        COALESCE(p.total_paid, 0) as amount_paid, 
        f.amount_total - COALESCE(p.total_paid, 0) as open_balance,
        f.document_type
      FROM public.stg_ar_open_items_clean f
      LEFT JOIN (
        SELECT applied_invoice_internal_id, SUM(payment_amount) as total_paid
        FROM public.customer_payments
        GROUP BY applied_invoice_internal_id
      ) p ON f.invoice_internal_id = REPLACE(p.applied_invoice_internal_id::text, '.00', '')
      WHERE (f.amount_total - COALESCE(p.total_paid, 0)) > 0
    `;
    console.log('finance_ar_open_items updated.');

    console.log('Done!');
  } catch(e) {
    console.error('Error syncing:', e);
  }
  process.exit(0);
}
run();
