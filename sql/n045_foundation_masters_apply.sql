-- Migración N045: Maestros y Configuración Base (Phase 1)
-- Propósito: Crear tablas raw_ y dm_dim_ para Plan de Cuentas, Monedas, Tasas de Cambio, Empleados y Clientes.

-- 1. PLAN DE CUENTAS (Accounts)
CREATE TABLE IF NOT EXISTS public.raw_ns_accounts (
    id VARCHAR(255) PRIMARY KEY,
    acctnumber VARCHAR(255),
    acctname VARCHAR(255),
    accttype VARCHAR(255),
    cashflowratetype VARCHAR(50),
    generalratetype VARCHAR(50),
    subsidiary VARCHAR(255),
    isinactive VARCHAR(5),
    last_modified_ts TIMESTAMP
);

CREATE OR REPLACE VIEW public.dm_dim_accounts AS
SELECT 
    id as account_id,
    acctnumber as account_number,
    acctname as account_name,
    accttype as account_type,
    subsidiary as subsidiary_id
FROM public.raw_ns_accounts
WHERE isinactive = 'F' OR isinactive IS NULL;

-- 2. MONEDAS (Currencies)
CREATE TABLE IF NOT EXISTS public.raw_ns_currencies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    symbol VARCHAR(10),
    isinactive VARCHAR(5),
    last_modified_ts TIMESTAMP
);

CREATE OR REPLACE VIEW public.dm_dim_currencies AS
SELECT 
    id as currency_id,
    name as currency_name,
    symbol as currency_symbol
FROM public.raw_ns_currencies
WHERE isinactive = 'F' OR isinactive IS NULL;

-- 3. TASAS DE CAMBIO (Exchange Rates)
CREATE TABLE IF NOT EXISTS public.raw_ns_exchange_rates (
    id VARCHAR(255) PRIMARY KEY,
    basecurrency VARCHAR(255),
    transactioncurrency VARCHAR(255),
    exchangerate NUMERIC(19,8),
    effectivedate TIMESTAMP,
    last_modified_ts TIMESTAMP
);

CREATE OR REPLACE VIEW public.dm_dim_exchange_rates AS
SELECT 
    id as exchange_rate_id,
    basecurrency as base_currency_id,
    transactioncurrency as transaction_currency_id,
    exchangerate as exchange_rate,
    effectivedate as effective_date
FROM public.raw_ns_exchange_rates;

-- 4. EMPLEADOS / VENDEDORES (Employees)
CREATE TABLE IF NOT EXISTS public.raw_ns_employees (
    id VARCHAR(255) PRIMARY KEY,
    entityid VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    issalesrep VARCHAR(5),
    isinactive VARCHAR(5),
    last_modified_ts TIMESTAMP
);

CREATE OR REPLACE VIEW public.dm_dim_employees AS
SELECT 
    id as employee_id,
    entityid as employee_code,
    TRIM(COALESCE(firstname, '') || ' ' || COALESCE(lastname, '')) as employee_name,
    email,
    issalesrep as is_sales_rep
FROM public.raw_ns_employees
WHERE isinactive = 'F' OR isinactive IS NULL;

-- 5. CLIENTES ENRIQUECIDOS (Customers)
-- (Asumimos que raw_ns_customers ya existe, agregaremos/aseguraremos los campos clave para B2B)
-- Modificamos la vista existente o creamos la canónica dm_dim_customers
CREATE OR REPLACE VIEW public.dm_dim_customers AS
SELECT 
    customer_id,
    customer_id as customer_code,
    companyname as company_name,
    NULL as email,
    -- Aquí podemos extender con category, channel_id, etc. dependiendo de los custom fields extraídos
    NULL as created_date
FROM public.raw_ns_customers;


