-- N039 Apply: Actualizar capacidad real y crear vistas de insights de supply

-- 1. Modificar vw_sales_pipeline_vs_supply para contemplar ensambles
DROP VIEW IF EXISTS public.vw_sales_pipeline_vs_supply CASCADE;

CREATE OR REPLACE VIEW public.vw_sales_pipeline_vs_supply AS
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
    -- Stock fisico base
    COALESCE(s.stock_available, 0::numeric) AS stock_available,
    -- Capacidad de entrega: Si es Ensamblaje, usamos theoretical_build_capacity
    CASE
        WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric)
        ELSE COALESCE(s.supply_available_qty, 0::numeric)
    END AS supply_available_qty,
    
    COALESCE(s.supply_status, 'Sin info supply'::text) AS supply_status,
    
    -- Deliverable_qty basado en la nueva formula
    CASE
        WHEN 
            (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) 
            >= d.quantity_pending THEN d.quantity_pending
        ELSE 
            (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END)
    END AS deliverable_qty,
    
    -- At Risk Qty
    CASE
        WHEN d.expected_ship_date > (CURRENT_DATE + COALESCE(cc.supply_risk_horizon_days, 90)::double precision * '1 day'::interval) THEN 0::numeric
        WHEN d.quantity_pending > (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) THEN d.quantity_pending - (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END)
        ELSE 0::numeric
    END AS at_risk_qty,
    
    -- Deliverable Revenue
    CASE
        WHEN d.quantity_pending > 0::numeric THEN d.pending_revenue *
        CASE
            WHEN (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) >= d.quantity_pending THEN 1::numeric
            ELSE (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) / NULLIF(d.quantity_pending, 0::numeric)
        END
        ELSE 0::numeric
    END AS deliverable_revenue,
    
    -- Revenue At Risk
    CASE
        WHEN d.expected_ship_date > (CURRENT_DATE + COALESCE(cc.supply_risk_horizon_days, 90)::double precision * '1 day'::interval) THEN 0::numeric
        WHEN d.quantity_pending > 0::numeric THEN d.pending_revenue *
        CASE
            WHEN d.quantity_pending > (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) THEN (d.quantity_pending - (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END)) / NULLIF(d.quantity_pending, 0::numeric)
            ELSE 0::numeric
        END
        ELSE 0::numeric
    END AS revenue_at_supply_risk
   FROM open_sales_order_demand d
     LEFT JOIN inventory_supply_semantic_current s ON s.item_id = d.item_id
     LEFT JOIN stg_items_master_clean i ON i.item_id = d.item_id
     CROSS JOIN client_config cc;

GRANT SELECT ON public.vw_sales_pipeline_vs_supply TO authenticated;

-- Recrear vistas dependientes (CASCADE dropped them)
CREATE OR REPLACE VIEW public.vw_sales_pipeline_supply_risk_customers AS
 SELECT c.customer_internal_id AS customer_id,
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
  GROUP BY c.customer_internal_id, c.customer_name;
GRANT SELECT ON public.vw_sales_pipeline_supply_risk_customers TO authenticated;

CREATE OR REPLACE VIEW public.vw_sales_pipeline_supply_executive_summary AS
 SELECT sum(vw_sales_pipeline_vs_supply.pending_revenue) AS pipeline_total_revenue,
    sum(vw_sales_pipeline_vs_supply.deliverable_revenue) AS pipeline_deliverable_revenue,
    sum(vw_sales_pipeline_vs_supply.revenue_at_supply_risk) AS pipeline_revenue_at_risk,
    sum(vw_sales_pipeline_vs_supply.pending_margin) AS pipeline_total_margin,
    sum(
        CASE
            WHEN vw_sales_pipeline_vs_supply.pending_revenue > 0::numeric THEN vw_sales_pipeline_vs_supply.pending_margin * (vw_sales_pipeline_vs_supply.revenue_at_supply_risk / vw_sales_pipeline_vs_supply.pending_revenue)
            ELSE 0::numeric
        END) AS margin_at_supply_risk
   FROM public.vw_sales_pipeline_vs_supply;
GRANT SELECT ON public.vw_sales_pipeline_supply_executive_summary TO authenticated;

-- 2. Crear vw_supply_action_insights
DROP VIEW IF EXISTS public.vw_supply_action_insights CASCADE;

CREATE OR REPLACE VIEW public.vw_supply_action_insights AS
SELECT 
    'S001' AS rule_id,
    'critico' AS severidad,
    'Órdenes Vencidas en Pipeline' AS regla,
    'Órdenes de venta con fecha de compromiso en el pasado que siguen pendientes de entrega.' AS descripcion,
    'Existen ' || count(DISTINCT v.document_number) || ' órdenes vencidas por $' || 
        trim(to_char(sum(v.pending_revenue), '999,999,999.99')) || '. ' ||
        'El equipo comercial debe reprogramar o cancelar estas órdenes.' AS recomendacion,
    CURRENT_DATE AS detected_at
FROM public.vw_sales_pipeline_vs_supply v
WHERE v.expected_ship_date < CURRENT_DATE
  AND v.pending_revenue > 0
HAVING count(DISTINCT v.document_number) > 0
UNION ALL
SELECT 
    'S002' AS rule_id,
    'alerta' AS severidad,
    'Quiebre Crítico sin Inbound' AS regla,
    'Artículos en quiebre que no tienen reposición ni embarques en tránsito.' AS descripcion,
    'Se detectaron ' || count(DISTINCT v.item_id) || ' artículos críticos con ingreso en riesgo, pero que tienen Inbound = 0. ' ||
    'Abastecimiento debe colocar órdenes de compra urgentemente.' AS recomendacion,
    CURRENT_DATE AS detected_at
FROM public.vw_sales_pipeline_vs_supply v
LEFT JOIN inventory_supply_semantic_current s ON s.item_id = v.item_id
WHERE v.revenue_at_supply_risk > 0 
  AND COALESCE(s.inbound_qty, 0) = 0
HAVING count(DISTINCT v.item_id) > 0
UNION ALL
SELECT 
    'E001' AS rule_id,
    'critico' AS severidad,
    'Alerta E001 (Cliente Prioritario)' AS regla,
    'Cliente prioritario con órdenes no entregables por quiebre de stock.' AS descripcion,
    'El cliente ' || r.customer_name || ' tiene $' || trim(to_char(r.total_revenue_at_risk, '999,999,999.99')) || 
    ' en riesgo (compromiso más próximo: ' || to_char(r.earliest_compromise_date, 'DD/MM/YYYY') || ').' AS recomendacion,
    CURRENT_DATE AS detected_at
FROM public.vw_sales_pipeline_supply_risk_customers r
JOIN public.kpi_top_clientes t ON t.customer_internal_id = r.customer_id
WHERE r.risk_status = 'Crítico'
ORDER BY severidad ASC
LIMIT 3;

GRANT SELECT ON public.vw_supply_action_insights TO authenticated;
