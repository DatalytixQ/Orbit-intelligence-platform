-- N039 Rollback

DROP VIEW IF EXISTS public.vw_supply_action_insights CASCADE;

-- Restaurar vw_sales_pipeline_vs_supply original
DROP VIEW IF EXISTS public.vw_sales_pipeline_vs_supply CASCADE;

CREATE OR REPLACE VIEW public.vw_sales_pipeline_vs_supply AS
 SELECT d.order_internal_id,
    d.document_number,
    d.customer_id,
    d.item_id,
    i.item_name,
    d.location,
    d.expected_ship_date,
    d.quantity_pending,
    d.pending_revenue,
    d.pending_cost,
    d.pending_margin,
    COALESCE(s.stock_available, 0::numeric) AS stock_available,
    COALESCE(s.supply_available_qty, 0::numeric) AS supply_available_qty,
    COALESCE(s.supply_status, 'Sin info supply'::text) AS supply_status,
        CASE
            WHEN COALESCE(s.supply_available_qty, 0::numeric) >= d.quantity_pending THEN d.quantity_pending
            ELSE COALESCE(s.supply_available_qty, 0::numeric)
        END AS deliverable_qty,
        CASE
            WHEN d.expected_ship_date > (CURRENT_DATE + COALESCE(cc.supply_risk_horizon_days, 90)::double precision * '1 day'::interval) THEN 0::numeric
            WHEN d.quantity_pending > COALESCE(s.supply_available_qty, 0::numeric) THEN d.quantity_pending - COALESCE(s.supply_available_qty, 0::numeric)
            ELSE 0::numeric
        END AS at_risk_qty,
        CASE
            WHEN d.quantity_pending > 0::numeric THEN d.pending_revenue *
            CASE
                WHEN COALESCE(s.supply_available_qty, 0::numeric) >= d.quantity_pending THEN 1::numeric
                ELSE COALESCE(s.supply_available_qty, 0::numeric) / NULLIF(d.quantity_pending, 0::numeric)
            END
            ELSE 0::numeric
        END AS deliverable_revenue,
        CASE
            WHEN d.expected_ship_date > (CURRENT_DATE + COALESCE(cc.supply_risk_horizon_days, 90)::double precision * '1 day'::interval) THEN 0::numeric
            WHEN d.quantity_pending > 0::numeric THEN d.pending_revenue *
            CASE
                WHEN d.quantity_pending > COALESCE(s.supply_available_qty, 0::numeric) THEN (d.quantity_pending - COALESCE(s.supply_available_qty, 0::numeric)) / NULLIF(d.quantity_pending, 0::numeric)
                ELSE 0::numeric
            END
            ELSE 0::numeric
        END AS revenue_at_supply_risk
   FROM open_sales_order_demand d
     LEFT JOIN inventory_supply_semantic_current s ON s.item_id = d.item_id
     LEFT JOIN stg_items_master_clean i ON i.item_id = d.item_id
     CROSS JOIN client_config cc;

GRANT SELECT ON public.vw_sales_pipeline_vs_supply TO authenticated;

CREATE OR REPLACE VIEW public.vw_sales_pipeline_supply_risk_customers AS
 SELECT c.customer_internal_id AS customer_id,
    c.customer_name,
    count(DISTINCT v.document_number) AS affected_orders,
    sum(v.revenue_at_supply_risk) AS total_revenue_at_risk,
    min(v.expected_ship_date) AS earliest_compromise_date,
        CASE
            WHEN min(v.expected_ship_date) < CURRENT_DATE THEN 'Crítico'::text
            WHEN min(v.expected_ship_date) <= (CURRENT_DATE + '14 days'::interval) THEN 'Alto Riesgo'::text
            ELSE 'En Observación'::text
        END AS risk_status
   FROM public.vw_sales_pipeline_vs_supply v
     JOIN public.stg_customers_clean c ON c.customer_internal_id = v.customer_id
  WHERE v.revenue_at_supply_risk > 0::numeric
  GROUP BY c.customer_internal_id, c.customer_name;

GRANT SELECT ON public.vw_sales_pipeline_supply_risk_customers TO authenticated;

CREATE OR REPLACE VIEW public.vw_sales_pipeline_supply_executive_summary AS
 SELECT sum(vw_sales_pipeline_vs_supply.pending_revenue) AS pipeline_total_revenue,
    sum(vw_sales_pipeline_vs_supply.deliverable_revenue) AS pipeline_deliverable_revenue,
    sum(vw_sales_pipeline_vs_supply.revenue_at_supply_risk) AS pipeline_revenue_at_risk,
    sum(vw_sales_pipeline_vs_supply.pending_margin) AS pipeline_total_margin,
    sum(
        CASE
            WHEN vw_sales_pipeline_vs_supply.pending_revenue > 0::numeric THEN vw_sales_pipeline_vs_supply.pending_margin * (vw_sales_pipeline_vs_supply.revenue_at_supply_risk / vw_sales_pipeline_vs_supply.pending_revenue)
            ELSE 0::numeric
        END) AS margin_at_supply_risk
   FROM public.vw_sales_pipeline_vs_supply;

GRANT SELECT ON public.vw_sales_pipeline_supply_executive_summary TO authenticated;
