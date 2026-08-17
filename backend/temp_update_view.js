require('dotenv').config();
const sql = require('./db.js');
async function run() {
  try {
    await sql`
      CREATE OR REPLACE VIEW kpi_inventory_coverage AS
      WITH inbound_agg AS (
        SELECT item_id, SUM(quantity_inbound) as in_transit_qty
        FROM inbound_shipments_normalized
        GROUP BY item_id
      )
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
            ELSE ((s.quantity_available + COALESCE(i.in_transit_qty, 0)) / d.avg_monthly_qty_3m)
        END AS stock_coverage_months,
        CASE
            WHEN (COALESCE(d.avg_monthly_qty_3m, (0)::numeric) = (0)::numeric) THEN NULL::numeric
            ELSE (((s.quantity_available + COALESCE(i.in_transit_qty, 0)) / d.avg_monthly_qty_3m) / (COALESCE(m.lead_time_days, (90)::numeric) / 30.0))
        END AS coverage_ratio,
        CASE
            WHEN (COALESCE(d.avg_monthly_qty_3m, (0)::numeric) = (0)::numeric) THEN 'Sin demanda reciente'::text
            WHEN ((((s.quantity_available + COALESCE(i.in_transit_qty, 0)) / d.avg_monthly_qty_3m) / (COALESCE(m.lead_time_days, (90)::numeric) / 30.0)) < 1.0) THEN 'Crítico'::text
            WHEN ((((s.quantity_available + COALESCE(i.in_transit_qty, 0)) / d.avg_monthly_qty_3m) / (COALESCE(m.lead_time_days, (90)::numeric) / 30.0)) < 1.5) THEN 'Riesgo'::text
            ELSE 'Saludable'::text
        END AS coverage_status,
        COALESCE(i.in_transit_qty, 0) AS in_transit_qty
      FROM kpi_inventory_item_snapshot s
      LEFT JOIN items_master_v m ON TRIM(BOTH FROM s.item_id) = TRIM(BOTH FROM m.item_id)
      LEFT JOIN kpi_item_demand_3m d ON TRIM(BOTH FROM s.item_id) = TRIM(BOTH FROM d.item_id)
      LEFT JOIN inbound_agg i ON TRIM(BOTH FROM s.item_id) = TRIM(BOTH FROM i.item_id)
      WHERE COALESCE(m.is_commercial, true) = true;
    `;
    console.log('kpi_inventory_coverage updated!');
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
