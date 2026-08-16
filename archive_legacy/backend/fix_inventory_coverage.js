const sql = require('./db.js');
async function run() {
  await sql`
    CREATE OR REPLACE VIEW public.kpi_inventory_coverage AS
    SELECT s.item_id,
        COALESCE(m.item_name, s.item_name) AS item_name,
        COALESCE(m.item_class, s.item_class) AS item_class,
        s.quantity_available AS stock_available,
        s.inventory_value,
        COALESCE(d.avg_monthly_qty_3m, (0)::numeric) AS avg_monthly_qty_3m,
        COALESCE(m.lead_time_days, (90)::numeric) AS lead_time_days,
        (COALESCE(m.lead_time_days, (90)::numeric) / 30.0) AS target_coverage_months,
        CASE
            WHEN (COALESCE(d.avg_monthly_qty_3m, (0)::numeric) = (0)::numeric) THEN NULL::numeric
            ELSE (s.quantity_available / d.avg_monthly_qty_3m)
        END AS stock_coverage_months,
        CASE
            WHEN (COALESCE(d.avg_monthly_qty_3m, (0)::numeric) = (0)::numeric) THEN NULL::numeric
            ELSE ((s.quantity_available / d.avg_monthly_qty_3m) / (COALESCE(m.lead_time_days, (90)::numeric) / 30.0))
        END AS coverage_ratio,
        CASE
            WHEN (COALESCE(d.avg_monthly_qty_3m, (0)::numeric) = (0)::numeric) THEN 'Sin demanda reciente'::text
            WHEN (((s.quantity_available / d.avg_monthly_qty_3m) / (COALESCE(m.lead_time_days, (90)::numeric) / 30.0)) < 1.0) THEN 'Crítico'::text
            WHEN (((s.quantity_available / d.avg_monthly_qty_3m) / (COALESCE(m.lead_time_days, (90)::numeric) / 30.0)) < 1.5) THEN 'Riesgo'::text
            ELSE 'Saludable'::text
        END AS coverage_status
    FROM ((public.kpi_inventory_item_snapshot s
        LEFT JOIN public.items_master_v m ON ((TRIM(BOTH FROM s.item_id) = TRIM(BOTH FROM m.item_id))))
        LEFT JOIN public.kpi_item_demand_3m d ON ((TRIM(BOTH FROM s.item_id) = TRIM(BOTH FROM d.item_id))))
    WHERE (COALESCE(m.is_commercial, true) = true);
  `;
  console.log("Updated kpi_inventory_coverage");
  process.exit(0);
}
run();
