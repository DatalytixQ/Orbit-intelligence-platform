-- Migración n050: Vistas DM para Módulo Comercial (v2.1)
-- Implementa lógica de COGS y enriquece métricas.

DROP VIEW IF EXISTS public.dm_dim_items_enriched CASCADE;
DROP VIEW IF EXISTS public.dm_dim_sales_reps CASCADE;
DROP VIEW IF EXISTS public.dm_dim_departments CASCADE;
DROP VIEW IF EXISTS public.dm_dim_classifications CASCADE;
DROP VIEW IF EXISTS public.dm_fact_sales CASCADE;
DROP VIEW IF EXISTS public.dm_fact_pipeline CASCADE;
DROP VIEW IF EXISTS public.dm_fact_rfm CASCADE;

-- 1. Enriquecimiento de Ítems (JOIN NS + Legacy con ROW_NUMBER para evitar duplicados)
CREATE OR REPLACE VIEW public.dm_dim_items_enriched AS
WITH dedup_legacy AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(item_sku)) ORDER BY snapshot_ts DESC) as rn
    FROM public.raw_items_master
)
SELECT
    ns.id          AS item_id,
    ns.itemid      AS item_code,
    ns.itemtype    AS item_type,
    ns.isinactive  AS is_inactive,
    COALESCE(leg.item_name, ns.itemid)  AS display_name,
    leg.item_category AS category,
    leg.item_subcategory AS subcategory,
    leg.average_cost::NUMERIC AS unit_cost,
    NULL::NUMERIC AS list_price
FROM public.raw_ns_items ns
LEFT JOIN dedup_legacy leg 
    ON LOWER(TRIM(ns.itemid)) = LOWER(TRIM(leg.item_sku)) AND leg.rn = 1;

-- 2. Vendedores (Sales Reps)
CREATE OR REPLACE VIEW public.dm_dim_sales_reps AS
SELECT
    id            AS salesrep_id,
    entityid      AS rep_entityid,
    firstname || ' ' || lastname AS rep_full_name,
    firstname,
    lastname,
    email,
    subsidiary    AS subsidiary_id
FROM public.raw_ns_employees;

-- 3. Departamentos
CREATE OR REPLACE VIEW public.dm_dim_departments AS
SELECT id AS department_id, name AS department_name, parent AS parent_id
FROM public.raw_ns_departments WHERE isinactive = 'F';

-- 4. Clasificaciones (Categorías/Clases)
CREATE OR REPLACE VIEW public.dm_dim_classifications AS
SELECT id AS class_id, name AS class_name
FROM public.raw_ns_classifications WHERE isinactive = 'F';

-- 5. FACT SALES (con COGS y Margen Bruto)
CREATE OR REPLACE VIEW public.dm_fact_sales AS
SELECT
    t.transaction_id AS transaction_id,
    t.tranid         AS invoice_number,
    t.trandate::DATE AS sale_date,
    DATE_TRUNC('month', t.trandate) AS sale_month,
    DATE_TRUNC('year', t.trandate)  AS sale_year,
    t.type           AS transaction_type,
    t.status         AS status,
    t.entity_id      AS customer_id,
    c.salesrep_id    AS salesrep_id,
    tl.department_id AS department_id,
    tl.class_id      AS class_id,
    t.subsidiary_id  AS subsidiary_id,
    t.currency_id    AS currency_id,
    t.exchange_rate  AS exchange_rate,
    tl.item_id       AS item_id,
    CASE 
        WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) 
        ELSE 0 
    END AS quantity,
    tl.rate          AS unit_price,
    (tl.netamount * -1) AS net_amount_local,
    (COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) AS net_amount_base,
    
    -- COGS y MARGEN
    i.unit_cost      AS unit_cost_reference,
    (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0)) AS cogs_local,
    (COALESCE(t.exchange_rate, 1) * (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0))) AS cogs_base,
    (tl.netamount * -1) - (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0)) AS gross_margin_local
    
FROM public.raw_ns_transactions t
JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
LEFT JOIN public.raw_ns_customers c ON t.entity_id = c.customer_id
LEFT JOIN public.dm_dim_items_enriched i ON tl.item_id = i.item_id
WHERE t.type IN ('CustInvc', 'CashSale', 'CustCred', 'CashRfnd');

-- 6. FACT PIPELINE (Oportunidades/OV)
CREATE OR REPLACE VIEW public.dm_fact_pipeline AS
SELECT
    t.transaction_id AS transaction_id, 
    t.tranid         AS order_number, 
    t.trandate::DATE AS order_date,
    t.status         AS status, 
    t.entity_id      AS customer_id,
    c.salesrep_id    AS salesrep_id, 
    tl.department_id AS department_id, 
    tl.class_id      AS class_id, 
    t.subsidiary_id  AS subsidiary_id,
    tl.item_id       AS item_id, 
    CASE 
        WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) 
        ELSE 0 
    END AS quantity, 
    (tl.netamount * -1) AS amount_local,
    (COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) AS amount_base
FROM public.raw_ns_transactions t
LEFT JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
LEFT JOIN public.raw_ns_customers c ON t.entity_id = c.customer_id
LEFT JOIN public.dm_dim_items_enriched i ON tl.item_id = i.item_id
WHERE t.type = 'SalesOrd';

-- 7. FACT RFM
CREATE OR REPLACE VIEW public.dm_fact_rfm AS
SELECT
    t.entity_id AS customer_id,
    MAX(t.trandate::DATE)                       AS last_purchase_date,
    CURRENT_DATE - MAX(t.trandate::DATE)        AS recency_days,
    COUNT(DISTINCT t.transaction_id)            AS frequency,
    SUM(tl.netamount)                           AS monetary_total_local,
    SUM(COALESCE(t.exchange_rate, 1) * tl.netamount) AS monetary_total_base
FROM public.raw_ns_transactions t
JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
WHERE t.type IN ('CustInvc', 'CashSale')
GROUP BY t.entity_id;
