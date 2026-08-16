-- Migración n052: Fundamentos de Jerarquía y COGS Estimado
-- Incluye adaptaciones necesarias para drill-down, forecast configurable y costo estimado.

-- ============================================================
-- 1. LÍNEAS DE TRANSACCIÓN: Costo Estimado (Requisito CFO)
-- ============================================================
ALTER TABLE public.raw_ns_transaction_lines ADD COLUMN IF NOT EXISTS costestimate NUMERIC(18,4);

-- ============================================================
-- 2. FORECAST: Tabla nativa para carga manual
-- ============================================================
CREATE TABLE IF NOT EXISTS public.app_sales_forecast (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(255) NOT NULL,
    subsidiary_id VARCHAR(255),
    forecast_month DATE NOT NULL, -- Convención: Siempre primer día del mes (YYYY-MM-01)
    amount_base NUMERIC(18,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, subsidiary_id, forecast_month)
);

-- ============================================================
-- 3. SUBSIDIARIAS: Columnas de Jerarquía y Vista DM
-- ============================================================
ALTER TABLE public.raw_ns_subsidiaries ADD COLUMN IF NOT EXISTS parent_id VARCHAR(255);
ALTER TABLE public.raw_ns_subsidiaries ADD COLUMN IF NOT EXISTS full_name VARCHAR(1000);

DROP VIEW IF EXISTS public.dm_dim_subsidiaries CASCADE;
CREATE OR REPLACE VIEW public.dm_dim_subsidiaries AS
SELECT 
    id AS subsidiary_id, 
    name AS subsidiary_name, 
    parent_id, 
    full_name,
    country, 
    currency AS default_currency_id
FROM public.raw_ns_subsidiaries
WHERE isinactive = 'F' OR isinactive IS NULL;

-- Helper: Retorna el ID de la subsidiaria y el de todos sus descendientes en el árbol
CREATE OR REPLACE FUNCTION public.get_subsidiary_tree(root_id TEXT) 
RETURNS TEXT[] AS $$
  WITH RECURSIVE tree AS (
    SELECT id FROM public.raw_ns_subsidiaries WHERE id = root_id
    UNION ALL
    SELECT s.id FROM public.raw_ns_subsidiaries s JOIN tree t ON s.parent_id = t.id
  ) 
  SELECT ARRAY_AGG(id) FROM tree;
$$ LANGUAGE SQL STABLE;

-- ============================================================
-- 4. CLASIFICACIONES (Clases): Columnas de Jerarquía y Vista DM
-- ============================================================
ALTER TABLE public.raw_ns_classifications ADD COLUMN IF NOT EXISTS parent_id VARCHAR(255);
ALTER TABLE public.raw_ns_classifications ADD COLUMN IF NOT EXISTS full_name VARCHAR(1000);

DROP VIEW IF EXISTS public.dm_dim_classifications CASCADE;
CREATE OR REPLACE VIEW public.dm_dim_classifications AS
SELECT 
    id AS class_id, 
    name AS class_name, 
    parent_id, 
    full_name
FROM public.raw_ns_classifications
WHERE isinactive = 'F' OR isinactive IS NULL;

-- Helper: Retorna el class_id y el de todas sus subclases descendientes
CREATE OR REPLACE FUNCTION public.get_classification_tree(root_id TEXT) 
RETURNS TEXT[] AS $$
  WITH RECURSIVE tree AS (
    SELECT id FROM public.raw_ns_classifications WHERE id = root_id
    UNION ALL
    SELECT c.id FROM public.raw_ns_classifications c JOIN tree t ON c.parent_id = t.id
  ) 
  SELECT ARRAY_AGG(id) FROM tree;
$$ LANGUAGE SQL STABLE;

-- ============================================================
-- 5. ARTÍCULOS (Items): Columnas faltantes para Drill-Down
-- ============================================================
-- Ya agregadas en n046 pero faltaba que el ETL las poblara. 
-- Nos aseguramos de que existan.
ALTER TABLE public.raw_ns_items ADD COLUMN IF NOT EXISTS displayname VARCHAR(500);
ALTER TABLE public.raw_ns_items ADD COLUMN IF NOT EXISTS salesdescription TEXT;
ALTER TABLE public.raw_ns_items ADD COLUMN IF NOT EXISTS class VARCHAR(255);
ALTER TABLE public.raw_ns_items ADD COLUMN IF NOT EXISTS department VARCHAR(255);
ALTER TABLE public.raw_ns_items ADD COLUMN IF NOT EXISTS baseprice NUMERIC(18,4);
ALTER TABLE public.raw_ns_items ADD COLUMN IF NOT EXISTS cost NUMERIC(18,4);

-- ============================================================
-- 6. CLIENTES (Customers): Datos de contacto y ubicación
-- ============================================================
ALTER TABLE public.raw_ns_customers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.raw_ns_customers ADD COLUMN IF NOT EXISTS phone VARCHAR(100);
ALTER TABLE public.raw_ns_customers ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE public.raw_ns_customers ADD COLUMN IF NOT EXISTS shipping_address TEXT;

DROP VIEW IF EXISTS public.dm_dim_customers CASCADE;
CREATE OR REPLACE VIEW public.dm_dim_customers AS
SELECT 
    customer_id,
    customer_id as customer_code,
    companyname as company_name,
    email,
    phone,
    billing_address,
    shipping_address
FROM public.raw_ns_customers;
