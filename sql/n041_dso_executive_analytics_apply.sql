-- n041_dso_executive_analytics_apply.sql

-- 1. View para Trend Histórico del DSO (Últimos 6 meses)
-- Como no tenemos una tabla dura de DSO histórico, usamos el finance_ar_snapshot_daily
-- y derivamos un "DSO" simulado basado en el ratio de mora para demostrar la funcionalidad ejecutiva.
DROP VIEW IF EXISTS public.vw_kpi_finance_dso_trend CASCADE;
CREATE OR REPLACE VIEW public.vw_kpi_finance_dso_trend AS
WITH monthly_snapshots AS (
  SELECT 
    date_trunc('month', snapshot_date)::date AS month_date,
    avg(open_balance) AS open_balance,
    avg(overdue_balance) AS overdue_balance
  FROM public.finance_ar_snapshot_daily
  WHERE snapshot_date >= current_date - interval '6 months'
  GROUP BY 1
)
SELECT 
  month_date,
  to_char(month_date, 'Mon YYYY') AS month_name,
  -- DSO Simulado: Base 30 días + impacto de mora
  round((30 + (overdue_balance / greatest(open_balance, 1)) * 45)::numeric, 1) AS actual_dso,
  -- BPDSO Simulado: Best Possible DSO (Fijo en 30 para el MVP, asumiendo términos estándar de 30 días)
  30.0 AS best_possible_dso
FROM monthly_snapshots
ORDER BY month_date ASC;

-- 2. View para Top DSO Offenders
-- Clientes que pagan más lento, desviando el DSO global.
DROP VIEW IF EXISTS public.vw_kpi_finance_dso_offenders CASCADE;
CREATE OR REPLACE VIEW public.vw_kpi_finance_dso_offenders AS
SELECT 
  customer_id,
  customer_name,
  round(dso_days::numeric, 1) as dso_days,
  -- Asumimos término ideal de 30 días
  round((dso_days - 30)::numeric, 1) as dso_gap,
  round(overdue_90_balance::numeric, 2) as critical_balance
FROM public.mv_kpi_finance_dso_action_list
WHERE dso_days > 45
ORDER BY dso_gap DESC
LIMIT 20;
