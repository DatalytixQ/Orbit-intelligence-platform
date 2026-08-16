-- Migración n055: Soporte Multientidad (Subsidiarias)
-- Agregando columnas subsidiary a las tablas raw de transacciones y clientes

-- 1. Alterar Tablas RAW
ALTER TABLE public.raw_ns_transactions ADD COLUMN IF NOT EXISTS subsidiary VARCHAR(255);
ALTER TABLE public.raw_ns_transaction_lines ADD COLUMN IF NOT EXISTS subsidiary VARCHAR(255);
ALTER TABLE public.raw_ns_customers ADD COLUMN IF NOT EXISTS subsidiary VARCHAR(255);

-- 2. Asegurarse de que RLS controle el acceso por subsidiary
-- Para evitar conflicto con la política existente "tenant_isolation_policy" basada en client_id,
-- creamos una nueva política que restringe TAMBIÉN por subsidiary_id si el usuario está atado a una subsidiaria.
-- (Asumiendo que el claim JWT pueda traer un 'subsidiary_id'. Si es null, ve todas las del tenant)

CREATE POLICY subsidiary_isolation_policy_tx ON public.raw_ns_transactions
    FOR ALL
    USING (
        current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'subsidiary_id' IS NULL
        OR subsidiary = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'subsidiary_id')
    );

CREATE POLICY subsidiary_isolation_policy_lines ON public.raw_ns_transaction_lines
    FOR ALL
    USING (
        current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'subsidiary_id' IS NULL
        OR subsidiary = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'subsidiary_id')
    );

CREATE POLICY subsidiary_isolation_policy_customers ON public.raw_ns_customers
    FOR ALL
    USING (
        current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'subsidiary_id' IS NULL
        OR subsidiary = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'subsidiary_id')
    );

-- 3. Corregir Vistas Data Mart que asumían que la columna se llamaba subsidiary_id
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
    t.salesrep_id    AS salesrep_id,
    tl.department_id AS department_id,
    COALESCE(tl.class_id, i.category) AS class_id,
    t.sales_channel  AS sales_channel_id,
    t.subsidiary     AS subsidiary_id, -- AQUI ESTA LA CORRECCION
    t.currency_id    AS currency_id,
    t.exchange_rate  AS exchange_rate,
    tl.item_id       AS item_id,
    
    so.trandate::DATE AS order_date,

    CASE 
        WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) 
        ELSE 0 
    END AS quantity,
    
    tl.rate          AS unit_price,
    (tl.netamount * -1) AS net_amount_local,
    (COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) AS net_amount_base,
    
    i.unit_cost      AS unit_cost_reference,
    (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0)) AS actual_cogs_local,
    (COALESCE(t.exchange_rate, 1) * (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0))) AS actual_cogs_base,
    (tl.netamount * -1) - (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(i.unit_cost, 0)) AS actual_gross_profit,
    
    (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(tl.costestimate, i.unit_cost, 0)) AS estimated_cogs_local,
    (COALESCE(t.exchange_rate, 1) * (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(tl.costestimate, i.unit_cost, 0))) AS estimated_cogs_base,
    (tl.netamount * -1) - (CASE WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) ELSE 0 END * COALESCE(tl.costestimate, i.unit_cost, 0)) AS estimated_gross_profit
    
FROM public.raw_ns_transactions t
JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
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
    t.subsidiary     AS subsidiary_id, -- AQUI ESTA LA CORRECCION
    tl.item_id       AS item_id, 
    CASE 
        WHEN i.item_type IN ('InvtPart', 'Assembly', 'Kit') THEN (tl.quantity * -1) 
        ELSE 0 
    END AS quantity, 
    (tl.netamount * -1) AS amount_local,
    (COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) AS amount_base,
    
    ((tl.netamount * -1) * (COALESCE(t.probability, 100) / 100.0)) AS weighted_amount_local,
    ((COALESCE(t.exchange_rate, 1) * (tl.netamount * -1)) * (COALESCE(t.probability, 100) / 100.0)) AS weighted_amount_base

FROM public.raw_ns_transactions t
LEFT JOIN public.raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
LEFT JOIN public.dm_dim_items_enriched i ON tl.item_id = i.item_id
WHERE t.type IN ('SalesOrd', 'Estimate');
