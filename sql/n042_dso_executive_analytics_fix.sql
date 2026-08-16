-- n042_dso_executive_analytics_fix.sql

-- 1. Arreglo del Trend Histórico del DSO
-- Al no tener historial de ventas diarias completo, calculamos el DSO histórico 
-- proyectando el DSO actual (46.34) ajustado por la variación del saldo abierto.
CREATE OR REPLACE VIEW public.vw_kpi_finance_dso_trend AS
WITH current_metrics AS (
  SELECT avg(dso_days) as base_dso
  FROM public.mv_kpi_finance_dso_action_list
),
current_balance AS (
  SELECT sum(open_balance) as current_ob
  FROM public.finance_ar_open_items_cxc 
  WHERE coalesce(is_initial_balance, false) = false
),
monthly_snapshots AS (
  SELECT 
    date_trunc('month', snapshot_date)::date AS month_date,
    avg(open_balance) AS open_balance
  FROM public.finance_ar_snapshot_daily
  GROUP BY 1
)
SELECT 
  m.month_date,
  to_char(m.month_date, 'Mon YYYY') AS month_name,
  -- DSO Histórico = DSO Actual * (Saldo Histórico / Saldo Actual)
  round((c.base_dso * (m.open_balance / greatest(cb.current_ob, 1)))::numeric, 1) AS actual_dso,
  30.0 AS best_possible_dso
FROM monthly_snapshots m
CROSS JOIN current_metrics c
CROSS JOIN current_balance cb
ORDER BY m.month_date ASC;

-- 2. Arreglo Top DSO Offenders
-- Mostrar el impacto financiero real que inmovilizan.
CREATE OR REPLACE VIEW public.vw_kpi_finance_dso_offenders AS
SELECT 
  customer_id,
  customer_name,
  round(dso_days::numeric, 1) as dso_days,
  round((dso_days - 30)::numeric, 1) as dso_gap,
  -- El capital inmovilizado por ineficiencia de este cliente:
  -- (DSO Gap / 30 días) * Ventas de 1 mes (aprox saldo abierto total si DSO es alto)
  round((overdue_balance)::numeric, 2) as critical_balance
FROM public.mv_kpi_finance_dso_action_list
WHERE dso_days > 45
ORDER BY dso_gap DESC
LIMIT 20;
