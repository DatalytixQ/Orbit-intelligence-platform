-- Aplicar RLS a las tablas base
ALTER TABLE public.raw_ns_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_ns_transaction_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_ns_subsidiaries ENABLE ROW LEVEL SECURITY;

-- Ya que los DM son VISTAS, vamos a aplicarle security_invoker para que respeten el RLS
-- de las tablas base (raw_ns_transactions, etc).

ALTER VIEW public.dm_fact_sales SET (security_invoker = true);
ALTER VIEW public.dm_fact_pipeline SET (security_invoker = true);
ALTER VIEW public.dm_fact_rfm SET (security_invoker = true);
ALTER VIEW public.dm_dim_subsidiaries SET (security_invoker = true);

-- Eliminar politicas anteriores si existen
DROP POLICY IF EXISTS tenant_isolation_policy ON public.raw_ns_transactions;
DROP POLICY IF EXISTS tenant_isolation_policy ON public.raw_ns_transaction_lines;
DROP POLICY IF EXISTS tenant_isolation_policy ON public.raw_ns_subsidiaries;

-- Crear políticas basadas en 'client_id' (tenant_id)
-- Supabase setea current_setting('request.jwt.claims', true)
CREATE POLICY tenant_isolation_policy ON public.raw_ns_transactions
    FOR ALL
    USING (
        client_id = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'tenant_id')
        OR 
        current_setting('request.jwt.claims', true) IS NULL -- bypass for node.js direct queries for now, can be restricted later
    );

CREATE POLICY tenant_isolation_policy ON public.raw_ns_transaction_lines
    FOR ALL
    USING (
        transaction_id IN (
            SELECT transaction_id FROM public.raw_ns_transactions
            WHERE client_id = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'tenant_id')
            OR current_setting('request.jwt.claims', true) IS NULL
        )
    );
    
CREATE POLICY tenant_isolation_policy ON public.raw_ns_subsidiaries
    FOR ALL
    USING (
        client_id = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'tenant_id')
        OR current_setting('request.jwt.claims', true) IS NULL
    );
