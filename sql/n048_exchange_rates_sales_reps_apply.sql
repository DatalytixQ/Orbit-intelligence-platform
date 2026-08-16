-- Migración N048: Ajuste de raw_ns_exchange_rates (fuente cambia de currencyrate a currency)
-- y tabla raw_ns_sales_reps (estructura para carga vía REST API)

-- raw_ns_exchange_rates: reemplazar columnas de currencyrate por columnas de currency.exchangerate
ALTER TABLE public.raw_ns_exchange_rates
    ADD COLUMN IF NOT EXISTS currency_name   VARCHAR(255),
    ADD COLUMN IF NOT EXISTS currency_symbol VARCHAR(20);

-- Los datos de exchange rates ahora son: id, currency_name, currency_symbol, exchangerate
-- basecurrency, transactioncurrency, effectivedate se mantienen para compatibilidad pero quedan NULL

-- raw_ns_sales_reps: estructura para carga vía REST API
-- (employee record accesible con permiso 'Listas -> Registro de empleado' en NS)
-- Si falta el permiso, esta tabla se puede cargar manualmente con el script seed_sales_reps.js
ALTER TABLE public.raw_ns_sales_reps
    ADD COLUMN IF NOT EXISTS firstname       VARCHAR(255),
    ADD COLUMN IF NOT EXISTS lastname        VARCHAR(255),
    ADD COLUMN IF NOT EXISTS email           VARCHAR(255),
    ADD COLUMN IF NOT EXISTS entityid        VARCHAR(255);

-- Vista DM para exchange rates actualizada
DROP VIEW IF EXISTS public.dm_dim_exchange_rates;
CREATE OR REPLACE VIEW public.dm_dim_exchange_rates AS
SELECT
    id               AS currency_id,
    currency_name    AS currency_name,
    currency_symbol  AS currency_symbol,
    exchangerate     AS current_rate,
    snapshot_ts      AS rate_as_of,
    'ARS'            AS base_currency_symbol
FROM public.raw_ns_exchange_rates
WHERE exchangerate IS NOT NULL;

-- NOTA IMPORTANTE sobre tasas históricas:
-- Las tasas históricas de cada transacción están en raw_ns_transactions.exchangerate
-- Para conversión ARS/USD de transacciones históricas, usar:
-- SELECT t.exchangerate FROM raw_ns_transactions t WHERE t.id = <id>
