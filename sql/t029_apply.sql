-- T029 Apply: Update vw_priority_engine to include C-series

CREATE OR REPLACE VIEW vw_priority_engine AS
SELECT 
    i.insight_key,
    i.insight_type,
    i.severity,
    i.detected_at,
    CASE 
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

-- GRANT SELECT ON vw_priority_engine TO authenticated;
