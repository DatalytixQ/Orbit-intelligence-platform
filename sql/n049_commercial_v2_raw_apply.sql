-- Migración n049: Estructuras RAW para completar Módulo Comercial (v2.1)

-- 1. Empleados / Representantes de Venta
CREATE TABLE IF NOT EXISTS public.raw_ns_employees (
    id            VARCHAR(255) PRIMARY KEY,
    entityid      VARCHAR(500),
    firstname     VARCHAR(255),
    lastname      VARCHAR(255),
    email         VARCHAR(255),
    issalesrep    VARCHAR(5),
    subsidiary    VARCHAR(255),
    department    VARCHAR(255),
    source_system VARCHAR(100),
    client_id     VARCHAR(255),
    snapshot_ts   TIMESTAMP
);

-- 2. Catálogo de Departamentos
CREATE TABLE IF NOT EXISTS public.raw_ns_departments (
    id            VARCHAR(255) PRIMARY KEY,
    name          VARCHAR(500),
    parent        VARCHAR(255),
    isinactive    VARCHAR(5),
    source_system VARCHAR(100),
    client_id     VARCHAR(255),
    snapshot_ts   TIMESTAMP
);

-- 3. Catálogo de Clasificaciones (Categorías)
CREATE TABLE IF NOT EXISTS public.raw_ns_classifications (
    id            VARCHAR(255) PRIMARY KEY,
    name          VARCHAR(500),
    isinactive    VARCHAR(5),
    source_system VARCHAR(100),
    client_id     VARCHAR(255),
    snapshot_ts   TIMESTAMP
);
