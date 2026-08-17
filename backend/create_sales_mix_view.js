const sql = require('./db.js');

async function createView() {
  console.log("Creating vw_rule_C006_sales_mix_detail...");
  try {
    await sql`
      CREATE OR REPLACE VIEW public.vw_rule_C006_sales_mix_detail AS
      SELECT 
        sl.client_id,
        TO_CHAR(sl.invoice_date, 'YYYY-MM') as period_month,
        'Directo' as channel_name, -- Mocked channel
        'Equipo B2B' as sales_rep_name, -- Mocked rep
        COALESCE(sl.item_category, 'Sin Categoría') as category_name,
        COALESCE(sl.item_id, 'N/A') as item_id,
        SUM(sl.line_net_amount) as net_sales_amount,
        SUM(sl.line_net_amount) - SUM(COALESCE(sl.line_estimated_cost, sl.line_net_amount * 0.6)) as gross_margin_amount,
        SUM(sl.quantity) as units_sold,
        COUNT(DISTINCT sl.invoice_id) as order_count,
        COUNT(DISTINCT sl.customer_id) as unique_customers_count
      FROM public.sales_lines sl
      GROUP BY 1, 2, 3, 4, 5, 6;
    `;
    console.log("View created successfully.");
    process.exit(0);
  } catch(e) {
    console.error("Error creating view:", e);
    process.exit(1);
  }
}

createView();
