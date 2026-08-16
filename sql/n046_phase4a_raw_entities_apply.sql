-- Migración N046: Tablas RAW para entidades nuevas confirmadas accesibles vía SuiteQL
-- Fase 4A + 4C: Locations, Subsidiaries, Items, Sales Reps (via customer), AP/Vendor Bills
-- NOTA: AccountingLine y TransactionLine GL fields NO disponibles en esta edición de NetSuite.
--       GL Impact se derivará de transaction + transaction_lines + accounts (approach alternativo).

-- 1. UBICACIONES (Locations)
CREATE TABLE IF NOT EXISTS public.raw_ns_locations (
    id                VARCHAR(255) PRIMARY KEY,
    name              VARCHAR(500),
    subsidiary        VARCHAR(255),
    isinactive        VARCHAR(5),
    last_modified_ts  TIMESTAMP
);

-- 2. SUBSIDIARIAS (Subsidiaries)
CREATE TABLE IF NOT EXISTS public.raw_ns_subsidiaries (
    id                VARCHAR(255) PRIMARY KEY,
    name              VARCHAR(500),
    country           VARCHAR(255),
    currency          VARCHAR(255),
    isinactive        VARCHAR(5),
    last_modified_ts  TIMESTAMP
);

-- 3. ARTÍCULOS / MAESTRO DE PRODUCTOS (Items)
CREATE TABLE IF NOT EXISTS public.raw_ns_items (
    id                VARCHAR(255) PRIMARY KEY,
    itemid            VARCHAR(500),
    displayname       VARCHAR(500),
    salesdescription  TEXT,
    itemtype          VARCHAR(100),
    department        VARCHAR(255),
    class             VARCHAR(255),
    subsidiary        VARCHAR(255),
    isinactive        VARCHAR(5),
    baseprice         NUMERIC(18,4),
    cost              NUMERIC(18,4),
    last_modified_ts  TIMESTAMP
);

-- 4. CUENTAS POR PAGAR (AP / Vendor Bills)
CREATE TABLE IF NOT EXISTS public.raw_ns_ap_open_items (
    id                VARCHAR(255) PRIMARY KEY,
    tranid            VARCHAR(255),
    trandate          DATE,
    entity            VARCHAR(255),
    subsidiary        VARCHAR(255),
    currency          VARCHAR(255),
    exchangerate      NUMERIC(18,6),
    amount            NUMERIC(18,2),
    status            VARCHAR(100),
    duedate           DATE,
    last_modified_ts  TIMESTAMP
);

-- 5. REPRESENTANTES DE VENTA (derivado de customer.salesrep — no hay acceso a employee directo)
-- Se almacena como dimensión enriquecida: el ID del salesrep junto con su nombre desde contact
CREATE TABLE IF NOT EXISTS public.raw_ns_sales_reps (
    salesrep_id       VARCHAR(255) PRIMARY KEY,
    entityid          VARCHAR(255),
    firstname         VARCHAR(255),
    lastname          VARCHAR(255),
    email             VARCHAR(255),
    last_modified_ts  TIMESTAMP
);

-- 6. ASIENTOS CONTABLES / JOURNAL ENTRIES (GL disponible solo a nivel de cabecera)
CREATE TABLE IF NOT EXISTS public.raw_ns_journal_entries (
    id                VARCHAR(255) PRIMARY KEY,
    tranid            VARCHAR(255),
    trandate          DATE,
    subsidiary        VARCHAR(255),
    memo              TEXT,
    approved          VARCHAR(5),
    currency          VARCHAR(255),
    exchangerate      NUMERIC(18,6),
    last_modified_ts  TIMESTAMP
);

-- ============================================================
-- DIMENSIONES NORMALIZADAS (Data Mart layer)
-- ============================================================

CREATE OR REPLACE VIEW public.dm_dim_locations AS
SELECT
    id           AS location_id,
    name         AS location_name,
    subsidiary   AS subsidiary_id
FROM public.raw_ns_locations
WHERE isinactive = 'F' OR isinactive IS NULL;

CREATE OR REPLACE VIEW public.dm_dim_subsidiaries AS
SELECT
    id       AS subsidiary_id,
    name     AS subsidiary_name,
    country  AS country,
    currency AS default_currency_id
FROM public.raw_ns_subsidiaries
WHERE isinactive = 'F' OR isinactive IS NULL;

CREATE OR REPLACE VIEW public.dm_dim_items AS
SELECT
    id               AS item_id,
    itemid           AS item_code,
    displayname      AS item_name,
    salesdescription AS description,
    itemtype         AS item_type,
    class            AS item_class,
    subsidiary       AS subsidiary_id,
    baseprice        AS base_price,
    cost             AS standard_cost
FROM public.raw_ns_items
WHERE isinactive = 'F' OR isinactive IS NULL;

CREATE OR REPLACE VIEW public.dm_dim_sales_reps AS
SELECT
    salesrep_id                                                    AS sales_rep_id,
    entityid                                                       AS rep_code,
    TRIM(COALESCE(firstname,'') || ' ' || COALESCE(lastname,''))  AS rep_name,
    email
FROM public.raw_ns_sales_reps;
