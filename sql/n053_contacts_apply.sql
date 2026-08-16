-- Migración n053: Integración B2B de Múltiples Contactos por Cliente
-- Permite visualizar roles (comprador, AP, etc.) y contactos directos asociados a cada cliente.

-- 1. Estructura RAW para Contactos
CREATE TABLE IF NOT EXISTS public.raw_ns_contacts (
    id                VARCHAR(255) PRIMARY KEY,
    entityid          VARCHAR(255),
    first_name        VARCHAR(255),
    last_name         VARCHAR(255),
    email             VARCHAR(255),
    phone             VARCHAR(100),
    job_title         VARCHAR(500),
    role_id           VARCHAR(255),
    company_id        VARCHAR(255),
    source_system     VARCHAR(100),
    client_id         VARCHAR(255),
    snapshot_ts       TIMESTAMP,
    last_modified_ts  TIMESTAMP
);

-- 2. Vista Data Mart para Contactos
DROP VIEW IF EXISTS public.dm_dim_contacts CASCADE;
CREATE OR REPLACE VIEW public.dm_dim_contacts AS
SELECT 
    id AS contact_id,
    company_id AS customer_id,
    TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) AS contact_name,
    email,
    phone,
    job_title,
    role_id
FROM public.raw_ns_contacts;
