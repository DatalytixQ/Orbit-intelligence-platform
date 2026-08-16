-- N040 Apply: Time Travel para Supply Pipeline

-- 1. Eliminar las vistas existentes
DROP VIEW IF EXISTS public.vw_sales_pipeline_supply_executive_summary CASCADE;
DROP VIEW IF EXISTS public.vw_sales_pipeline_supply_risk_customers CASCADE;
DROP VIEW IF EXISTS public.vw_supply_action_insights CASCADE;
DROP VIEW IF EXISTS public.vw_sales_pipeline_vs_supply CASCADE;

-- 2. Crear funcin fn_sales_pipeline_vs_supply
CREATE OR REPLACE FUNCTION public.fn_sales_pipeline_vs_supply(baseline_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    order_internal_id text,
    document_number text,
    customer_id text,
    item_id text,
    item_name text,
    location text,
    expected_ship_date date,
    quantity_pending numeric,
    pending_revenue numeric,
    pending_cost numeric,
    pending_margin numeric,
    stock_available numeric,
    supply_available_qty numeric,
    supply_status text,
    deliverable_qty numeric,
    at_risk_qty numeric,
    deliverable_revenue numeric,
    revenue_at_supply_risk numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.order_internal_id::text,
        d.document_number::text,
        d.customer_id::text,
        d.item_id::text,
        i.item_name::text,
        d.location::text,
        d.expected_ship_date,
        d.quantity_pending,
        d.pending_revenue,
        d.pending_cost,
        d.pending_margin,
        -- Stock fisico base
        COALESCE(s.stock_available, 0::numeric) AS stock_available,
        -- Capacidad de entrega
        CASE
            WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric)
            ELSE COALESCE(s.supply_available_qty, 0::numeric)
        END AS supply_available_qty,
        
        COALESCE(s.supply_status, 'Sin info supply'::text) AS supply_status,
        
        -- Deliverable_qty
        CASE
            WHEN 
                (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END) 
                >= d.quantity_pending THEN d.quantity_pending
            ELSE 
                (CASE WHEN i.item_type = 'Ensamblaje' THEN COALESCE(s.theoretical_build_capacity, 0::numeric) + COALESCE(s.inbound_qty, 0::numeric) ELSE COALESCE(s.supply_available_qty, 0::numeric) END)
        END AS deliverable_qty,
        
        -- At Risk Qty
        CASE
            WHEN d.expected_ship_date > (baseline_date + COALESCE(cc.supply_risk_horizon_days, 90)::double precision * '1 day'::interval) THEN 0::numeric
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
            WHEN d.expected_ship_date > (baseline_date + COALESCE(cc.supply_risk_horizon_days, 90)::double precision * '1 day'::interval) THEN 0::numeric
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
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.fn_sales_pipeline_vs_supply TO authenticated;
