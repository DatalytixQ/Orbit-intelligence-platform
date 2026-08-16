-- n044_multitenant_hardening_apply.sql

ALTER TABLE public.finance_ar_snapshot_daily ADD COLUMN IF NOT EXISTS client_id TEXT;

-- 1. Replace the legacy get_policy_value function to use app_settings and client_id (TEXT)
CREATE OR REPLACE FUNCTION public.get_policy_value(p_client_id TEXT, p_category character varying, p_key character varying, p_default character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_value VARCHAR;
BEGIN
    SELECT policy_value INTO v_value 
    FROM public.app_settings 
    WHERE client_id = p_client_id 
      AND category = p_category 
      AND policy_key = p_key;
      
    IF v_value IS NULL THEN
        RETURN p_default;
    END IF;
    
    RETURN v_value;
END;
$function$;

-- 2. Multi-tenant DSO Action List (v5)
DROP VIEW IF EXISTS public.vw_kpi_finance_dso_offenders CASCADE;
DROP VIEW IF EXISTS public.vw_kpi_finance_dso_trend CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.mv_kpi_finance_dso_action_list CASCADE;
DROP VIEW IF EXISTS public.kpi_finance_dso_by_customer_v5 CASCADE;

CREATE OR REPLACE VIEW public.kpi_finance_dso_by_customer_v5 AS
WITH params AS (
  SELECT (CURRENT_DATE - '90 days'::interval) AS start_date,
         CURRENT_DATE AS end_date,
         (90)::numeric AS period_days
), sales_period AS (
  SELECT sales.client_id,
         sales.customer_internal_id AS customer_id,
         max(sales.customer_name) AS customer_name,
         round(sum(sales.amount_total), 2) AS sales_amount
  FROM sales, params
  WHERE sales.fecha >= params.start_date AND sales.fecha < params.end_date
  GROUP BY sales.client_id, sales.customer_internal_id
), ar_end AS (
  SELECT finance_ar_open_items_cxc.client_id,
         finance_ar_open_items_cxc.customer_internal_id AS customer_id,
         round(sum(finance_ar_open_items_cxc.open_balance), 2) AS ar_end_balance,
         round(sum(
             CASE
                 WHEN ((finance_ar_open_items_cxc.due_date IS NOT NULL) AND (CURRENT_DATE > finance_ar_open_items_cxc.due_date)) THEN finance_ar_open_items_cxc.open_balance
                 ELSE (0)::numeric
             END), 2) AS overdue_balance,
         round(sum(
             CASE
                 WHEN (((CURRENT_DATE - finance_ar_open_items_cxc.due_date) >= 31) AND ((CURRENT_DATE - finance_ar_open_items_cxc.due_date) <= 60)) THEN finance_ar_open_items_cxc.open_balance
                 ELSE (0)::numeric
             END), 2) AS overdue_31_60_balance,
         round(sum(
             CASE
                 WHEN (((CURRENT_DATE - finance_ar_open_items_cxc.due_date) >= 61) AND ((CURRENT_DATE - finance_ar_open_items_cxc.due_date) <= 90)) THEN finance_ar_open_items_cxc.open_balance
                 ELSE (0)::numeric
             END), 2) AS overdue_61_90_balance,
         round(sum(
             CASE
                 WHEN ((CURRENT_DATE - finance_ar_open_items_cxc.due_date) > 90) THEN finance_ar_open_items_cxc.open_balance
                 ELSE (0)::numeric
             END), 2) AS overdue_90_balance,
         max(
             CASE
                 WHEN ((finance_ar_open_items_cxc.due_date IS NOT NULL) AND (CURRENT_DATE > finance_ar_open_items_cxc.due_date)) THEN (CURRENT_DATE - finance_ar_open_items_cxc.due_date)
                 ELSE 0
             END) AS max_days_overdue
  FROM finance_ar_open_items_cxc
  WHERE COALESCE(finance_ar_open_items_cxc.is_initial_balance, false) = false
  GROUP BY finance_ar_open_items_cxc.client_id, finance_ar_open_items_cxc.customer_internal_id
), ar_start_proxy AS (
  SELECT finance_ar_open_items_cxc.client_id,
         finance_ar_open_items_cxc.customer_internal_id AS customer_id,
         round(sum(finance_ar_open_items_cxc.open_balance), 2) AS ar_start_balance
  FROM finance_ar_open_items_cxc, params
  WHERE finance_ar_open_items_cxc.fecha < params.start_date AND COALESCE(finance_ar_open_items_cxc.is_initial_balance, false) = false
  GROUP BY finance_ar_open_items_cxc.client_id, finance_ar_open_items_cxc.customer_internal_id
)
SELECT 
    COALESCE(s.client_id, e.client_id, sp.client_id) AS client_id,
    COALESCE(s.customer_id, e.customer_id, sp.customer_id) AS customer_id,
    COALESCE(s.customer_name, COALESCE(s.customer_id, e.customer_id, sp.customer_id)) AS customer_name,
    round(((COALESCE(e.ar_end_balance, (0)::numeric) + COALESCE(sp.ar_start_balance, (0)::numeric)) / (2)::numeric), 2) AS avg_ar_balance,
    COALESCE(s.sales_amount, (0)::numeric) AS sales_amount,
    CASE
        WHEN (COALESCE(s.sales_amount, (0)::numeric) > (0)::numeric) THEN round(((((COALESCE(e.ar_end_balance, (0)::numeric) + COALESCE(sp.ar_start_balance, (0)::numeric)) / (2)::numeric) / s.sales_amount) * p.period_days), 1)
        ELSE NULL::numeric
    END AS dso_days,
    COALESCE(e.overdue_balance, (0)::numeric) AS overdue_balance,
    COALESCE(e.overdue_31_60_balance, (0)::numeric) AS overdue_31_60_balance,
    COALESCE(e.overdue_61_90_balance, (0)::numeric) AS overdue_61_90_balance,
    COALESCE(e.overdue_90_balance, (0)::numeric) AS overdue_90_balance,
    COALESCE(e.max_days_overdue, 0) AS max_days_overdue,
    'High Risk'::text AS risk_segment
FROM sales_period s
FULL JOIN ar_end e ON e.customer_id = s.customer_id AND e.client_id = s.client_id
FULL JOIN ar_start_proxy sp ON sp.customer_id = COALESCE(s.customer_id, e.customer_id) AND sp.client_id = COALESCE(s.client_id, e.client_id)
CROSS JOIN params p;

CREATE MATERIALIZED VIEW public.mv_kpi_finance_dso_action_list AS
SELECT * FROM public.kpi_finance_dso_by_customer_v5;

CREATE OR REPLACE VIEW public.vw_kpi_finance_dso_trend AS
WITH current_metrics AS (
  SELECT client_id, avg(dso_days) as base_dso
  FROM public.mv_kpi_finance_dso_action_list
  GROUP BY client_id
),
current_balance AS (
  SELECT client_id, sum(open_balance) as current_ob
  FROM public.finance_ar_open_items_cxc 
  WHERE coalesce(is_initial_balance, false) = false
  GROUP BY client_id
),
monthly_snapshots AS (
  SELECT 
    client_id,
    date_trunc('month', snapshot_date)::date AS month_date,
    avg(open_balance) AS open_balance
  FROM public.finance_ar_snapshot_daily
  GROUP BY client_id, 2
)
SELECT 
  m.client_id,
  m.month_date,
  to_char(m.month_date, 'Mon YYYY') AS month_name,
  round((c.base_dso * (m.open_balance / greatest(cb.current_ob, 1)))::numeric, 1) AS actual_dso,
  get_policy_value(m.client_id, 'finance', 'best_possible_dso', '30')::numeric AS best_possible_dso
FROM monthly_snapshots m
LEFT JOIN current_metrics c ON c.client_id = m.client_id
LEFT JOIN current_balance cb ON cb.client_id = m.client_id
ORDER BY m.month_date ASC;

CREATE OR REPLACE VIEW public.vw_kpi_finance_dso_offenders AS
SELECT 
  client_id,
  customer_id,
  customer_name,
  round(dso_days::numeric, 1) as dso_days,
  round((dso_days - get_policy_value(client_id, 'finance', 'best_possible_dso', '30')::numeric)::numeric, 1) as dso_gap,
  round((overdue_balance)::numeric, 2) as critical_balance
FROM public.mv_kpi_finance_dso_action_list
WHERE dso_days > get_policy_value(client_id, 'finance', 'dso_risk_threshold', '45')::numeric
ORDER BY dso_gap DESC
LIMIT 20;

-- 3. Multi-tenant Supply pipeline
DROP VIEW IF EXISTS public.vw_supply_action_insights CASCADE;
DROP VIEW IF EXISTS public.vw_sales_pipeline_supply_executive_summary CASCADE;
DROP VIEW IF EXISTS public.vw_sales_pipeline_supply_risk_customers CASCADE;
DROP VIEW IF EXISTS public.vw_sales_pipeline_vs_supply CASCADE;

CREATE OR REPLACE VIEW public.vw_sales_pipeline_vs_supply AS
 SELECT 
    d.client_id,
    d.order_internal_id,
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
    CASE
        WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric)
        ELSE COALESCE(s.supply_available_qty, 0::numeric)
    END AS supply_available_qty,
    COALESCE(s.supply_status, 'Sin info supply'::text) AS supply_status,
    CASE
        WHEN 
            (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) 
            >= d.quantity_pending THEN d.quantity_pending
        ELSE 
            (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END)
    END AS deliverable_qty,
    CASE
        WHEN d.expected_ship_date > (CURRENT_DATE + get_policy_value(d.client_id, 'supply', 'supply_risk_horizon_days', '90')::double precision * '1 day'::interval) THEN 0::numeric
        WHEN d.quantity_pending > (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) THEN d.quantity_pending - (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END)
        ELSE 0::numeric
    END AS at_risk_qty,
    CASE
        WHEN d.quantity_pending > 0::numeric THEN d.pending_revenue *
        CASE
            WHEN (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) >= d.quantity_pending THEN 1::numeric
            ELSE (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) / NULLIF(d.quantity_pending, 0::numeric)
        END
        ELSE 0::numeric
    END AS deliverable_revenue,
    CASE
        WHEN d.expected_ship_date > (CURRENT_DATE + get_policy_value(d.client_id, 'supply', 'supply_risk_horizon_days', '90')::double precision * '1 day'::interval) THEN 0::numeric
        WHEN d.quantity_pending > 0::numeric THEN d.pending_revenue *
        CASE
            WHEN d.quantity_pending > (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) THEN (d.quantity_pending - (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END)) / NULLIF(d.quantity_pending, 0::numeric)
            ELSE 0::numeric
        END
        ELSE 0::numeric
    END AS revenue_at_supply_risk
   FROM open_sales_order_demand d
     LEFT JOIN inventory_supply_semantic_current s ON s.item_id = d.item_id
     LEFT JOIN stg_items_master_clean i ON i.item_id = d.item_id AND i.client_id = d.client_id;
GRANT SELECT ON public.vw_sales_pipeline_vs_supply TO authenticated;

CREATE OR REPLACE VIEW public.vw_sales_pipeline_supply_risk_customers AS
 SELECT v.client_id,
    c.customer_internal_id AS customer_id,
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
  GROUP BY v.client_id, c.customer_internal_id, c.customer_name;
GRANT SELECT ON public.vw_sales_pipeline_supply_risk_customers TO authenticated;

CREATE OR REPLACE VIEW public.vw_sales_pipeline_supply_executive_summary AS
 SELECT vw_sales_pipeline_vs_supply.client_id,
    sum(vw_sales_pipeline_vs_supply.pending_revenue) AS pipeline_total_revenue,
    sum(vw_sales_pipeline_vs_supply.deliverable_revenue) AS pipeline_deliverable_revenue,
    sum(vw_sales_pipeline_vs_supply.revenue_at_supply_risk) AS pipeline_revenue_at_risk,
    sum(vw_sales_pipeline_vs_supply.pending_margin) AS pipeline_total_margin,
    sum(
        CASE
            WHEN vw_sales_pipeline_vs_supply.pending_revenue > 0::numeric THEN vw_sales_pipeline_vs_supply.pending_margin * (vw_sales_pipeline_vs_supply.revenue_at_supply_risk / vw_sales_pipeline_vs_supply.pending_revenue)
            ELSE 0::numeric
        END) AS margin_at_supply_risk
   FROM public.vw_sales_pipeline_vs_supply
  GROUP BY vw_sales_pipeline_vs_supply.client_id;
GRANT SELECT ON public.vw_sales_pipeline_supply_executive_summary TO authenticated;
