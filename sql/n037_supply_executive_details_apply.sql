-- N037: Enriquecimiento de Supply Views (Item Names y Order Counts)

-- 1. Modificar vw_sales_pipeline_vs_supply para incluir item_name y mantener los otros campos.
DROP VIEW IF EXISTS vw_sales_pipeline_supply_risk_customers CASCADE;
DROP VIEW IF EXISTS vw_sales_pipeline_vs_supply CASCADE;

CREATE OR REPLACE VIEW vw_sales_pipeline_vs_supply AS
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
            WHEN d.quantity_pending > 0::numeric THEN d.pending_revenue *
            CASE
                WHEN d.quantity_pending > COALESCE(s.supply_available_qty, 0::numeric) THEN (d.quantity_pending - COALESCE(s.supply_available_qty, 0::numeric)) / NULLIF(d.quantity_pending, 0::numeric)
                ELSE 0::numeric
            END
            ELSE 0::numeric
        END AS revenue_at_supply_risk
   FROM open_sales_order_demand d
     LEFT JOIN inventory_supply_semantic_current s ON s.item_id = d.item_id
     LEFT JOIN stg_items_master_clean i ON i.item_id = d.item_id;

-- 2. Modificar vw_sales_pipeline_supply_risk_customers para contar órdenes y fecha más próxima
CREATE OR REPLACE VIEW vw_sales_pipeline_supply_risk_customers AS
  SELECT v.customer_id,
    c.customer_name,
    count(*) AS lines,
    count(DISTINCT v.document_number) AS affected_orders,
    min(v.expected_ship_date) AS earliest_ship_date,
    sum(v.pending_revenue) AS pipeline_revenue,
    sum(v.deliverable_revenue) AS deliverable_revenue,
    sum(v.revenue_at_supply_risk) AS revenue_at_supply_risk,
    sum(v.pending_margin) AS pipeline_margin
   FROM vw_sales_pipeline_vs_supply v
     LEFT JOIN customers c ON c.customer_internal_id = v.customer_id
  GROUP BY v.customer_id, c.customer_name
 HAVING sum(v.revenue_at_supply_risk) > 0::numeric
  ORDER BY (sum(v.revenue_at_supply_risk)) DESC;

-- 3. Restaurar Regla E001 (que se borró por CASCADE)
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
