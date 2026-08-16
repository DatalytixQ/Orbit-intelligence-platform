-- Migración N047: Agregar columnas de auditoría a todas las tablas raw_ns_ nuevas
-- Problema: Las tablas creadas en n045/n046 no tienen source_system, client_id, snapshot_ts
-- que el motor ETL (engine.py) agrega desde el campo "defaults" de los JSON de mapping.

ALTER TABLE public.raw_ns_accounts
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_currencies
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_exchange_rates
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_employees
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_locations
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_subsidiaries
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_items
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_ap_open_items
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_journal_entries
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;

ALTER TABLE public.raw_ns_sales_reps
    ADD COLUMN IF NOT EXISTS source_system VARCHAR(100),
    ADD COLUMN IF NOT EXISTS client_id     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS snapshot_ts   TIMESTAMP;
