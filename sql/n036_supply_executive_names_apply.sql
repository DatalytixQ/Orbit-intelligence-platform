-- N036: Add names to supply views
DROP VIEW IF EXISTS vw_inventory_inbound_semantic CASCADE;
CREATE OR REPLACE VIEW vw_inventory_inbound_semantic AS
SELECT 
  s.item_internal_id AS item_id,
  i.item_name AS item_name,
  sum(COALESCE(s.quantity_inbound, 0::numeric)) AS inbound_qty,
  min(s.expected_delivery_date) AS next_expected_date,
  min(s.available_for_sale_date) AS next_available_date
FROM stg_inbound_shipments_clean s
LEFT JOIN stg_items_master_clean i ON i.item_id = s.item_internal_id
WHERE COALESCE(s.quantity_inbound, 0::numeric) > 0::numeric
GROUP BY s.item_internal_id, i.item_name;

DROP VIEW IF EXISTS vw_sales_pipeline_supply_risk_customers CASCADE;
CREATE OR REPLACE VIEW vw_sales_pipeline_supply_risk_customers AS
SELECT 
  v.customer_id,
  c.customer_name,
  count(*) AS lines,
  sum(v.pending_revenue) AS pipeline_revenue,
  sum(v.deliverable_revenue) AS deliverable_revenue,
  sum(v.revenue_at_supply_risk) AS revenue_at_supply_risk,
  sum(v.pending_margin) AS pipeline_margin
FROM vw_sales_pipeline_vs_supply v
LEFT JOIN customers c ON c.customer_internal_id = v.customer_id
GROUP BY v.customer_id, c.customer_name
HAVING sum(v.revenue_at_supply_risk) > 0::numeric
ORDER BY sum(v.revenue_at_supply_risk) DESC;

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
