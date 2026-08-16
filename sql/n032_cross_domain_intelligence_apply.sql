-- N032 Apply: Implement E-Series Cross Domain Rules and Priority Engine Update

-- Update vw_priority_engine to prioritize E-Series (Executive Cross-Domain)
DROP VIEW IF EXISTS vw_priority_engine CASCADE;
CREATE VIEW vw_priority_engine AS
SELECT 
    i.insight_key,
    i.insight_type,
    i.severity,
    i.detected_at,
    CASE 
        -- Executive Cross-Domain (E-Series) ALWAYS overrides single domain
        WHEN i.insight_key LIKE 'E00%' AND i.severity = 'critico' THEN 150
        WHEN i.insight_key LIKE 'E00%' AND i.severity = 'alerta' THEN 120
        WHEN i.insight_key LIKE 'E00%' AND i.severity = 'warning' THEN 100
        WHEN i.insight_key LIKE 'E00%' AND i.severity = 'ok' THEN 20

        -- Priority for critical C-series insights (Finance/AR)
        WHEN i.insight_key LIKE 'C00%' AND i.severity = 'critico' THEN 100
        WHEN i.insight_key LIKE 'C00%' AND i.severity = 'alerta' THEN 75
        WHEN i.insight_key LIKE 'C00%' AND i.severity = 'warning' THEN 50
        WHEN i.insight_key LIKE 'C00%' AND i.severity = 'ok' THEN 10
        
        -- Default fallback logic for other series (e.g. I00x, V00x)
        WHEN i.severity = 'critico' THEN 90
        WHEN i.severity = 'alerta' THEN 60
        WHEN i.severity = 'warning' THEN 30
        ELSE 20
    END as calculated_priority
FROM public.insights_log i
WHERE i.status = 'activo';

-- Rule E001: Sales Pipeline Supply Risk (Sales + Inventory)
CREATE OR REPLACE VIEW vw_rule_e001_detail AS
SELECT 
    'E001' as rule_id,
    c.customer_name as cliente,
    v.revenue_at_supply_risk as monto_riesgo,
    'critico' as severidad,
    'Cliente prioritario con órdenes no entregables por quiebre de stock' as recomendacion
FROM vw_sales_pipeline_supply_risk_customers v
JOIN customers c ON c.customer_internal_id = v.customer_id
WHERE v.revenue_at_supply_risk > 100000;

-- Rule E002: Key Account Overdue (Sales + Finance)
CREATE OR REPLACE VIEW vw_rule_e002_detail AS
SELECT 
    'E002' as rule_id,
    c.customer_name as cliente,
    COALESCE(ar.overdue_balance, 0) as deuda_vencida,
    'alerta' as severidad,
    'Cliente Top con alta deuda vencida. Bloquear nuevos despachos.' as recomendacion
FROM customers c
LEFT JOIN kpi_finance_dso_by_customer_v4 ar ON c.customer_internal_id = ar.customer_id
WHERE ar.overdue_balance > 500000 AND ar.dso_days > 45;

-- Rule E003: Overstocked Slow Moving Inventory (Inventory + Finance Capital Tied Up)
CREATE OR REPLACE VIEW vw_rule_e003_detail AS
SELECT 
    'E003' as rule_id,
    i.item_id,
    i.item_name,
    i.inventory_value as capital_inmovilizado,
    'warning' as severidad,
    'Liberar capital. Aplicar promoción especial para rotar inventario inmovilizado.' as recomendacion
FROM kpi_inventory_top_slow_moving i
WHERE i.inventory_value > 50000;

