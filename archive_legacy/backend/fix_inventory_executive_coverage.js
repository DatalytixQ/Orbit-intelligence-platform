const sql = require('./db.js');
async function run() {
  await sql`
    CREATE OR REPLACE VIEW public.vw_inventory_executive_coverage AS
    SELECT base.item_id,
        base.item_name,
        base.item_class,
        base.stock_available,
        COALESCE(ib.quantity_inbound, (0)::numeric) AS quantity_inbound,
        COALESCE(od.quantity_pending, (0)::numeric) AS quantity_pending,
        base.avg_monthly_qty_3m,
        base.lead_time_days,
        base.target_coverage_months,
        base.inventory_value,
        ((base.stock_available + COALESCE(ib.quantity_inbound, (0)::numeric)) - COALESCE(od.quantity_pending, (0)::numeric)) AS net_stock,
        CASE
            WHEN (base.avg_monthly_qty_3m > (0)::numeric) THEN (((base.stock_available + COALESCE(ib.quantity_inbound, (0)::numeric)) - COALESCE(od.quantity_pending, (0)::numeric)) / base.avg_monthly_qty_3m)
            ELSE (999)::numeric
        END AS net_coverage_months,
        CASE
            WHEN ((NOT (EXISTS ( SELECT 1
               FROM public.inventory_movements im
              WHERE ((im.item_id = base.item_id) AND ((im.quantity_signed < (0)::numeric) OR (im.movement_direction = 'Out'::text)) AND (im.transaction_date >= (CURRENT_DATE - '6 mons'::interval)))))) AND (base.stock_available > (0)::numeric)) THEN 'Sin demanda reciente'::text
            WHEN (((base.stock_available + COALESCE(ib.quantity_inbound, (0)::numeric)) - COALESCE(od.quantity_pending, (0)::numeric)) < (0)::numeric) THEN 'Quiebre Inminente (OV)'::text
            WHEN (
            CASE
                WHEN (base.avg_monthly_qty_3m > (0)::numeric) THEN (((base.stock_available + COALESCE(ib.quantity_inbound, (0)::numeric)) - COALESCE(od.quantity_pending, (0)::numeric)) / base.avg_monthly_qty_3m)
                ELSE (999)::numeric
            END < base.target_coverage_months) THEN 'Crítico'::text
            WHEN (
            CASE
                WHEN (base.avg_monthly_qty_3m > (0)::numeric) THEN (((base.stock_available + COALESCE(ib.quantity_inbound, (0)::numeric)) - COALESCE(od.quantity_pending, (0)::numeric)) / base.avg_monthly_qty_3m)
                ELSE (999)::numeric
            END < (base.target_coverage_months * 1.5)) THEN 'Riesgo'::text
            ELSE 'Saludable'::text
        END AS coverage_status
    FROM ((public.kpi_inventory_coverage base
        LEFT JOIN ( SELECT open_sales_order_demand.item_id,
            sum(open_sales_order_demand.quantity_pending) AS quantity_pending
           FROM public.open_sales_order_demand
          GROUP BY open_sales_order_demand.item_id) od ON ((od.item_id = base.item_id)))
        LEFT JOIN ( SELECT inbound_shipments.item_internal_id AS item_id,
            sum(inbound_shipments.quantity_inbound) AS quantity_inbound
           FROM public.inbound_shipments
          GROUP BY inbound_shipments.item_internal_id) ib ON ((ib.item_id = base.item_id)));
  `;
  console.log("Updated vw_inventory_executive_coverage");
  process.exit(0);
}
run();
