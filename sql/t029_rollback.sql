-- T029 Rollback: Revert vw_priority_engine (remove C-series specific logic)

CREATE OR REPLACE VIEW vw_priority_engine AS
SELECT 
    i.insight_key,
    i.insight_type,
    i.severity,
    i.detected_at,
    CASE 
        WHEN i.severity = 'critico' THEN 90
        WHEN i.severity = 'alerta' THEN 60
        WHEN i.severity = 'warning' THEN 30
        ELSE 20
    END as calculated_priority
FROM public.insights_log i
WHERE i.status = 'activo';
