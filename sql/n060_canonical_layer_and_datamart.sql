-- Migración n060: Capa Canónica y Refactor DM v3
-- Construcción de modelo canónico para aislar la lógica de origen (NetSuite) 
-- y actualización de Data Marts comerciales con campos CRM, canales y fechas múltiples.

-- 1. MODELO CANÓNICO (Vistas de Entidades de Negocio)
-- Extraemos y estandarizamos atributos clave independiente de la plataforma origen.

CREATE OR REPLACE VIEW public.can_sales_invoices AS
SELECT 
    transaction_id,
    tranid AS invoice_number,
    trandate::DATE AS invoice_date,
    created_from_id,
    status,
    entity_id AS customer_id,
    COALESCE(salesrep_id, entity_id) AS salesrep_id, -- Fallback opcional si no hay rep en cabecera
    currency_id,
    COALESCE(exchange_rate, 1) AS exchange_rate,
    sales_channel,
    tax_total
FROM public.raw_ns_transactions
WHERE type IN ('CustInvc', 'CashSale');

CREATE OR REPLACE VIEW public.can_credit_memos AS
SELECT 
    transaction_id,
    tranid AS memo_number,
    trandate::DATE AS memo_date,
    created_from_id,
    status,
    entity_id AS customer_id,
    salesrep_id,
    currency_id,
    COALESCE(exchange_rate, 1) AS exchange_rate,
    sales_channel
FROM public.raw_ns_transactions
WHERE type IN ('CustCred', 'CashRfnd');

CREATE OR REPLACE VIEW public.can_sales_orders AS
SELECT 
    transaction_id,
    tranid AS order_number,
    trandate::DATE AS order_date,
    status,
    entity_id AS customer_id,
    salesrep_id,
    currency_id,
    COALESCE(exchange_rate, 1) AS exchange_rate,
    sales_channel
FROM public.raw_ns_transactions
WHERE type = 'SalesOrd';

CREATE OR REPLACE VIEW public.can_opportunities AS
SELECT 
    transaction_id,
    tranid AS opportunity_number,
    trandate::DATE AS opportunity_date,
    expected_close_date::DATE AS expected_close_date,
    probability,
    entity_status AS opportunity_status,
    status,
    entity_id AS customer_id,
    salesrep_id,
    currency_id,
    COALESCE(exchange_rate, 1) AS exchange_rate,
    sales_channel
FROM public.raw_ns_transactions
WHERE type = 'Estimate';

-- 2. DATA MART (Refactor v3)
-- Ahora construimos los hechos usando el modelo base pero apuntando al raw extendido
-- para mayor performance en joins (o usando las vistas canónicas si prefieren abstracción total)

DROP VIEW IF EXISTS public.dm_fact_sales CASCADE;
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
    t.salesrep_id    AS salesrep_id, -- Ahora lo toma de la cabecera de la transacción
    tl.department_id AS department_id,
    COALESCE(tl.class_id, i.category) AS class_id, -- Fallback temporal a legacy category hasta que i.class se extraiga
    t.sales_channel  AS sales_channel_id, -- Extraido vía Sales Channel Allocation Standard
    t.subsidiary_id  AS subsidiary_id,
    t.currency_id    AS currency_id,
    t.exchange_rate  AS exchange_rate,
    tl.item_id       AS item_id,
    
    -- Manejo de Fechas Secundarias (Order Date)
    so.trandate::DATE AS order_date,

    -- Lógica de Cantidades (ignorar servicios/impuestos para conteo de unidades físicas)
    CASE 
        WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) 
        ELSE 0 
    END AS quantity,
    
    tl.rate          AS unit_price,
    (tl.netamount * -1) AS net_amount_local,
    (COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) AS net_amount_base,
    
    -- COGS y MARGEN
    i.unit_cost      AS unit_cost_reference,
    -- ACTUAL COGS (Contable / Base)
    (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0)) AS actual_cogs_local,
    (COALESCE(t.exchange_rate, 1) * (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0))) AS actual_cogs_base,
    (tl.netamount * -1) - (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0)) AS actual_gross_profit,
    
    -- ESTIMATED COGS (Transaccional)
    (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(tl.costestimate, i.unit_cost, 0)) AS estimated_cogs_local,
    (COALESCE(t.exchange_rate, 1) * (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(tl.costestimate, i.unit_cost, 0))) AS estimated_cogs_base,
    (tl.netamount * -1) - (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(tl.costestimate, i.unit_cost, 0)) AS estimated_gross_profit
    
FROM public.raw_ns_transactions t
JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
-- Buscamos el documento origen para tener Order Date (SalesOrd)
LEFT JOIN public.raw_ns_transactions so ON t.created_from_id = so.transaction_id
LEFT JOIN public.dm_dim_items_enriched i ON tl.item_id = i.item_id
WHERE t.type IN ('CustInvc', 'CashSale', 'CustCred', 'CashRfnd');


DROP VIEW IF EXISTS public.dm_fact_pipeline CASCADE;
CREATE OR REPLACE VIEW public.dm_fact_pipeline AS
SELECT
    t.transaction_id AS transaction_id, 
    t.tranid         AS order_number, 
    t.trandate::DATE AS order_date,
    t.expected_close_date::DATE AS expected_close_date,
    COALESCE(t.probability, 100) AS probability,
    t.entity_status  AS opportunity_status,
    t.status         AS status, 
    t.entity_id      AS customer_id,
    t.salesrep_id    AS salesrep_id, 
    tl.department_id AS department_id, 
    tl.class_id      AS class_id, 
    t.sales_channel  AS sales_channel_id,
    t.subsidiary_id  AS subsidiary_id,
    tl.item_id       AS item_id, 
    CASE 
        WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) 
        ELSE 0 
    END AS quantity, 
    (tl.netamount * -1) AS amount_local,
    (COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) AS amount_base,
    
    -- Monto Ponderado (Pipeline Weight)
    ((tl.netamount * -1) * (COALESCE(t.probability, 100) / 100.0)) AS weighted_amount_local,
    ((COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) * (COALESCE(t.probability, 100) / 100.0)) AS weighted_amount_base

FROM public.raw_ns_transactions t
LEFT JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
LEFT JOIN public.dm_dim_items_enriched i ON tl.item_id = i.item_id
WHERE t.type IN ('SalesOrd', 'Estimate');


DROP VIEW IF EXISTS public.dm_fact_rfm CASCADE;
CREATE OR REPLACE VIEW public.dm_fact_rfm AS
SELECT
    t.entity_id AS customer_id,
    MAX(t.trandate::DATE)                       AS last_purchase_date,
    CURRENT_DATE - MAX(t.trandate::DATE)        AS recency_days,
    COUNT(DISTINCT t.transaction_id)            AS frequency,
    SUM(tl.netamount * -1)                      AS monetary_total_local,
    SUM(COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) AS monetary_total_base
FROM public.raw_ns_transactions t
JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
WHERE t.type IN ('CustInvc', 'CashSale')
GROUP BY t.entity_id;
