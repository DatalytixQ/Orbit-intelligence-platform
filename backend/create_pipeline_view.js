const sql = require('./db.js');

async function createView() {
  console.log("Creating vw_rule_C007_sales_pipeline...");
  try {
    await sql`DROP VIEW IF EXISTS public.vw_rule_C007_sales_pipeline`;
    await sql`
      CREATE VIEW public.vw_rule_C007_sales_pipeline AS
      SELECT 
        t.tranid as opportunity_id,
        CASE WHEN t.type = 'SalesOrd' THEN 'Orden Abierta (OV)' ELSE 'Cotización (Estimate)' END as stage,
        SUM(tl.netamount) as amount,
        CASE WHEN t.type = 'SalesOrd' THEN 90 ELSE 50 END as probability,
        MAX(t.trandate) as expected_close_date,
        'ERP Rep' as sales_rep,
        COALESCE(c.companyname, 'Cliente ' || t.entity_id) as client_name
      FROM public.raw_ns_transactions t
      JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
      LEFT JOIN public.raw_ns_customers c ON t.entity_id = c.customer_id
      WHERE t.type IN ('SalesOrd', 'Estimate') 
        AND t.status NOT IN ('Closed', 'Billed')
      GROUP BY t.tranid, t.type, t.entity_id, c.companyname;
    `;
    console.log("View vw_rule_C007_sales_pipeline created successfully.");
    process.exit(0);
  } catch(e) {
    console.error("Error creating view:", e);
    process.exit(1);
  }
}

createView();
