const sql = require('./db.js');

async function run() {
  console.log('Creating view kpi_sales_top_reps_2026...');

  try {
    await sql`
      CREATE OR REPLACE VIEW kpi_sales_top_reps_2026 AS
      SELECT 
          COALESCE(c.sales_rep, 'Sin Asignar') AS sales_rep,
          sum(s.amount_ars) AS rep_sales_ars,
          totals.total_sales_ars,
          CASE
              WHEN (totals.total_sales_ars = (0)::numeric) THEN (0)::numeric
              ELSE round(((sum(s.amount_ars) / totals.total_sales_ars) * (100)::numeric), 2)
          END AS participation_pct
      FROM (sales s
        LEFT JOIN customers c ON s.customer_internal_id = c.customer_internal_id
        CROSS JOIN ( 
            SELECT sum(sales.amount_ars) AS total_sales_ars
            FROM sales
            WHERE ((sales.fecha >= '2026-01-01'::date) AND (sales.fecha < '2027-01-01'::date))
        ) totals
      )
      WHERE ((s.fecha >= '2026-01-01'::date) AND (s.fecha < '2027-01-01'::date))
      GROUP BY COALESCE(c.sales_rep, 'Sin Asignar'), totals.total_sales_ars
      ORDER BY
          CASE
              WHEN (totals.total_sales_ars = (0)::numeric) THEN (0)::numeric
              ELSE round(((sum(s.amount_ars) / totals.total_sales_ars) * (100)::numeric), 2)
          END DESC, (sum(s.amount_ars)) DESC
      LIMIT 10;
    `;
    console.log('View created successfully.');
  } catch(e) {
    console.error('Error creating view:', e);
  }
  process.exit(0);
}
run();
