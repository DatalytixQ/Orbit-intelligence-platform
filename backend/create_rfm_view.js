const sql = require('./db.js');

async function createView() {
  console.log("Creating vw_rule_C008_customers_rfm...");
  try {
    await sql`DROP VIEW IF EXISTS public.vw_rule_C008_customers_rfm`;
    await sql`
      CREATE VIEW public.vw_rule_C008_customers_rfm AS
      WITH customer_metrics AS (
        SELECT 
          t.entity_id as customer_id,
          MAX(t.trandate::date) as last_purchase_date,
          COUNT(DISTINCT t.transaction_id) as frequency_orders,
          SUM(tl.netamount::numeric) as monetary_value
        FROM public.raw_ns_transactions t
        JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
        WHERE t.type IN ('CustInvc', 'CashSale')
        GROUP BY t.entity_id
      )
      SELECT 
        m.customer_id,
        COALESCE(c.companyname, 'Cliente ' || m.customer_id) as customer_name,
        CURRENT_DATE - m.last_purchase_date as recency_days,
        m.frequency_orders,
        m.monetary_value,
        CASE 
          WHEN (CURRENT_DATE - m.last_purchase_date) <= 30 AND m.frequency_orders >= 5 THEN 'Champions'
          WHEN (CURRENT_DATE - m.last_purchase_date) <= 60 AND m.frequency_orders >= 2 THEN 'Fieles'
          WHEN (CURRENT_DATE - m.last_purchase_date) > 90 AND m.monetary_value > 100000 THEN 'En riesgo'
          WHEN (CURRENT_DATE - m.last_purchase_date) > 180 THEN 'Dormidos'
          ELSE 'Regulares'
        END as segment_name,
        CASE 
          WHEN (CURRENT_DATE - m.last_purchase_date) <= 30 AND m.frequency_orders >= 5 THEN 'Ofrecer programa VIP'
          WHEN (CURRENT_DATE - m.last_purchase_date) <= 60 AND m.frequency_orders >= 2 THEN 'Upsell a plan anual'
          WHEN (CURRENT_DATE - m.last_purchase_date) > 90 AND m.monetary_value > 100000 THEN 'Llamar urgente. Oferta de recuperación'
          WHEN (CURRENT_DATE - m.last_purchase_date) > 180 THEN 'Enviar campaña de reactivación'
          ELSE 'Mantener engagement'
        END as suggested_action
      FROM customer_metrics m
      LEFT JOIN public.raw_ns_customers c ON m.customer_id = c.customer_id;
    `;
    console.log("View vw_rule_C008_customers_rfm created successfully.");
    process.exit(0);
  } catch(e) {
    console.error("Error creating view:", e);
    process.exit(1);
  }
}

createView();
