-- N031 Apply: Create Business Health Score semantic view

CREATE OR REPLACE VIEW vw_business_health_score AS
WITH sales_score AS (
    SELECT 
        CASE 
            WHEN COALESCE(f.forecast_ars, 0) > 0 THEN 
                CASE 
                    WHEN (s.ventas_ars / f.forecast_ars) >= 0.95 THEN 100
                    WHEN (s.ventas_ars / f.forecast_ars) >= 0.85 THEN 80
                    WHEN (s.ventas_ars / f.forecast_ars) >= 0.70 THEN 50
                    ELSE 20
                END
            ELSE 100
        END as score,
        'Ventas vs Forecast' as dimension
    FROM kpi_sales_current_month s
    LEFT JOIN kpi_sales_forecast_monthly f ON s.mes = f.mes
),
finance_score AS (
    SELECT 
        CASE 
            WHEN COALESCE(dso_days, 0) <= 30 THEN 100
            WHEN dso_days > 30 AND dso_days <= 60 THEN 80
            WHEN dso_days > 60 AND dso_days <= 90 THEN 50
            ELSE 20
        END as score,
        'DSO y Cobranzas' as dimension
    FROM kpi_finance_dso_summary
),
inventory_score AS (
    SELECT 
        CASE 
            WHEN COALESCE(critical_items, 0) = 0 THEN 100
            WHEN critical_items <= 5 THEN 80
            WHEN critical_items <= 20 THEN 50
            ELSE 20
        END as score,
        'Salud de Inventario' as dimension
    FROM kpi_inventory_critical_items_count
),
combined_scores AS (
    SELECT score, dimension FROM sales_score
    UNION ALL
    SELECT score, dimension FROM finance_score
    UNION ALL
    SELECT score, dimension FROM inventory_score
)
SELECT 
    ROUND(AVG(score), 0) as overall_score,
    CASE 
        WHEN AVG(score) >= 80 THEN 'Optimal'
        WHEN AVG(score) >= 50 THEN 'Warning'
        ELSE 'Critical'
    END as health_band,
    json_agg(json_build_object('dimension', dimension, 'score', score)) as dimensions,
    CURRENT_TIMESTAMP as as_of
FROM combined_scores;

-- Create table for historical snapshots
CREATE TABLE IF NOT EXISTS executive_health_snapshot (
    id SERIAL PRIMARY KEY,
    snapshot_date DATE NOT NULL UNIQUE,
    overall_score NUMERIC NOT NULL,
    health_band VARCHAR(50) NOT NULL,
    dimensions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to take daily snapshot
CREATE OR REPLACE FUNCTION take_daily_health_snapshot()
RETURNS void AS $$
BEGIN
    INSERT INTO executive_health_snapshot (snapshot_date, overall_score, health_band, dimensions)
    SELECT CURRENT_DATE, overall_score, health_band, dimensions::jsonb
    FROM vw_business_health_score
    ON CONFLICT (snapshot_date) 
    DO UPDATE SET 
        overall_score = EXCLUDED.overall_score,
        health_band = EXCLUDED.health_band,
        dimensions = EXCLUDED.dimensions;
END;
$$ LANGUAGE plpgsql;
