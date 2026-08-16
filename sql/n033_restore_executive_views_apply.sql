-- Recreate the views that were dropped by cascade

CREATE OR REPLACE VIEW vw_home_premium AS
SELECT 
    client_id,
    CURRENT_DATE as as_of_date,
    'executive' as snapshot_type,
    'OK' as salud_general,
    'Salud Controlada' as salud_general_texto,
    (SELECT COUNT(*) FROM insights_log WHERE status = 'activo') as total_alerts,
    (SELECT COUNT(DISTINCT insight_type) FROM insights_log WHERE status = 'activo') as affected_domains
FROM clients
LIMIT 1;

CREATE OR REPLACE VIEW vw_home_executive_summary AS
SELECT 
    client_id,
    as_of_date,
    snapshot_type,
    salud_general,
    salud_general_texto,
    total_alerts,
    affected_domains,
    (
        SELECT json_agg(
            json_build_object(
                'domain', domain_name,
                'domain_key', domain_name,
                'semaforo', CASE WHEN count > 0 THEN 'AMARILLO' ELSE 'VERDE' END,
                'estado', CASE WHEN count > 0 THEN 'Atención' ELSE 'Óptimo' END,
                'alertas_activas', count
            )
        )
        FROM (
            SELECT insight_type as domain_name, COUNT(*) as count 
            FROM insights_log 
            WHERE status = 'activo' 
            GROUP BY insight_type
        ) d
    ) as salud_por_dominio,
    (
        SELECT json_agg(
            json_build_object(
                'rank', calculated_priority,
                'domain', insight_type,
                'rule_id', insight_key,
                'titulo', 'Alerta en ' || insight_type,
                'semaforo', CASE WHEN severity = 'critico' THEN 'ROJO' WHEN severity = 'alerta' THEN 'AMARILLO' ELSE 'VERDE' END,
                'impacto_principal', 'Alta exposición',
                'impacto_secundario', 'Riesgo detectado',
                'accion_corta', 'Ver detalle',
                'link_destino', '/insights'
            )
        )
        FROM (
            SELECT * FROM vw_priority_engine
            ORDER BY calculated_priority DESC
            LIMIT 3
        ) t
    ) as top_3_decisiones
FROM vw_home_premium;
