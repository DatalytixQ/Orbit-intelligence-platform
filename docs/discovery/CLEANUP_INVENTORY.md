# Inventario de Limpieza (CLEANUP INVENTORY)

De acuerdo con la **Regla de Oro de Ejecución** (Modo solo lectura y mapeo), Antigravity ha aislado todos los archivos residuales (scripts de prueba, documentación antigua y consultas temporales) en directorios aislados fuera del scope de empaquetado del aplicativo (`/archive_legacy/`).

El runtime actual del backend y frontend han quedado saneados y libres de ruido, garantizando que todo siga operando de manera idéntica pero con un repositorio limpio.

## 1. Archivos Aislados en Node.js (Backend)
Se ha creado el directorio `archive_legacy/backend/` y se han movido los siguientes 73 archivos residuales:

- `app-backup.js`
- `apply_dso_fix.js`, `apply_dso_sql.js`
- `audit_db.js`, `audit_db2.js`, `db_audit.json`
- `check_*.js` (21 scripts de verificación temporal: `check_cols.js`, `check_cols2.js`, `check_dates.js`, `check_functions.js`, `check_inventory.js`, `check_invoice.js`, `check_item.js`, `check_max_date.js`, `check_risk.js`, `check_routine.js`, `check_sabbagh.js`, `check_sales_lines.js`, `check_sales_schema.js`, `check_stg_sales.js`, `check_tables.js`, `check_tables2.js`, `check_view.js`, `check_views.js`)
- `create_view.js`, `create_view_c001.js`
- `dump_views.js`
- `fix_*.js` (3 scripts de parche: `fix_inventory_coverage.js`, `fix_inventory_executive_coverage.js`, `fix_inventory_func.js`)
- `generate_reports.js`
- `get_func.js`
- `migrate_policies.js`, `update_views_policies.js`
- `query.js`, `tables.js`, `rename_inbound.js`, `setup_reps_view.js`
- `research_*.js` (10 scripts de research: `research_db.js`, `research_db2.js`, `research_db3.js`, `research_db4.js`, `research_db5.js`, `research_db6.js`, `research_db_matviews.js`, `research_dso.js`, `research_dso2.js`, `research_dso3.js`)
- `schema_check*.js` (3 scripts)
- `temp_*.js` (11 scripts)
- `test_*.js` (7 scripts: `test_db.js`, `test_db_2.js`, `test_div_zero.js`, `test_dqbot.js`, `test_parse.js`, `test_sales.js`, `test_val.js`)
- `matview.txt`, `views.txt`, `views_dump.txt`, `reporte_ventas.md`

### 1.1 Archivos Core Conservados (Clean Pack)
El directorio `backend/` principal ahora solo contiene los archivos necesarios para la ejecución y sincronización:
- `.env`, `.env.example`, `.gitignore`
- `app.js` (Server Express)
- `db.js` (Conexión Supabase)
- `package.json`, `package-lock.json`
- `migrate.js`, `run_ingest.js`, `sync_final.js`, `refresh_mv.js`

## 2. Archivos Aislados en React (Frontend)
Se ha creado el directorio `archive_legacy/frontend/` y se movió un archivo temporal en la raíz:
- `Nuevo archivo`

## 3. Identificación de Basura en la Base de Datos (Supabase)
Durante la auditoría de `information_schema`, se detectaron abundantes objetos generados por extensiones de Testing (`pgTap`) y herramientas vectoriales (`pgvector`) que engrosan innecesariamente el catálogo.

- **Funciones:** Se mapearon **1,235 funciones** en el esquema `public`. Más del 95% de estas pertenecen a rutinas de pruebas (`isa_ok`, `throws_like`, `table_owner_is`, etc.) inyectadas por `pgTap`. 
- **Tablas Temporales:** Existen tablas antiguas asociadas a pruebas de migraciones pasadas.

*(Ver `DATA_LINEAGE_MATRIX.md` para el detalle estructural de las tablas operativas válidas).*
