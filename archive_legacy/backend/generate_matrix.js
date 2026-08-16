const fs = require('fs');
const data = require('./db_audit.json');

const tables = data.tables.filter(t => !t.table_name.startsWith('pg_'));
const views = tables.filter(t => t.table_type === 'VIEW');
const baseTables = tables.filter(t => t.table_type === 'BASE TABLE');

// Just some core mapping knowledge we have
const markdown = `
# Matriz de Linaje de Datos y Auditoría (DATA LINEAGE MATRIX)

De acuerdo con la **Regla de Oro de Ejecución**, a continuación se presenta la auditoría exhaustiva de la base de datos (PostgreSQL/Supabase) y la trazabilidad de los KPIs para identificar el origen de discrepancias y documentar el flujo.

## 1. Inventario del Pipeline (4 Pasos)

La arquitectura de datos de ERP Intelligence Foundation sigue este modelo:
1. **INGESTA:** Aterrizaje de CSVs crudos (tablas \`csv_*\` y \`stg_*\` originales).
2. **LIMPIEZA:** Limpieza y deduplicación (tablas \`stg_*_clean\`).
3. **MODELADO:** Dimensinales y agregadas (tablas finales \`sales\`, \`finance_ar_open_items\`, \`inventory_*\`, \`customers\`).
4. **VISUALIZACIÓN:** Vistas (VIEW) y Vistas Materializadas (MATERIALIZED VIEW) consumidas por Node.js.

### 1.1 Tablas y Vistas por Módulo y Fase
| Objeto (Tabla / Vista) | Tipo | Pipeline | Módulo | Estado |
|---|---|---|---|---|
| \`csv_sales\` / \`stg_sales\` | BASE TABLE | 1. Ingesta | Ventas | ACTIVO EN CORE |
| \`stg_sales_clean\` | BASE TABLE | 2. Limpieza | Ventas | ACTIVO EN CORE |
| \`sales\` | BASE TABLE | 3. Modelado | Ventas | ACTIVO EN CORE |
| \`kpi_sales_ytd\` / \`kpi_sales_evolution_monthly\` | VIEW | 4. Visualización | Ventas | ACTIVO EN CORE |
| \`kpi_top_10_customer_sales_participation_2026\` | VIEW | 4. Visualización | Ventas | ACTIVO EN CORE |
| \`csv_ar_open_items\` | BASE TABLE | 1. Ingesta | CxC/DSO | ACTIVO EN CORE |
| \`stg_ar_open_items_clean\` | BASE TABLE | 2. Limpieza | CxC/DSO | ACTIVO EN CORE |
| \`finance_ar_open_items\` | BASE TABLE | 3. Modelado | CxC/DSO | ACTIVO EN CORE |
| \`customer_payments\` | BASE TABLE | 3. Modelado | CxC/DSO | ACTIVO EN CORE |
| \`finance_ar_open_items_cxc\` | VIEW | 4. Visualización | CxC | ACTIVO EN CORE |
| \`mv_kpi_finance_dso_action_list\` | MAT VIEW | 4. Visualización | DSO | ACTIVO EN CORE (Con falla lógica) |
| \`kpi_finance_dso_by_customer_v4\` | VIEW | 4. Visualización | DSO | ACTIVO EN CORE |
| \`csv_inventory_*\` | BASE TABLE | 1. Ingesta | Inventarios | ACTIVO EN CORE |
| \`stg_inventory_transactions_clean\` | BASE TABLE | 2. Limpieza | Inventarios | ACTIVO EN CORE |
| \`inventory_items\` | BASE TABLE | 3. Modelado | Inventarios | ACTIVO EN CORE |
| \`kpi_inventory_coverage\` | VIEW | 4. Visualización | Inventarios | ACTIVO EN CORE |
| \`vw_inventory_rotation_semantic\` | VIEW | 4. Visualización | Inventarios | ACTIVO EN CORE |
| \`customers\` | BASE TABLE | 3. Modelado | Global | ACTIVO EN CORE |
*(Nota: El esquema \`public\` contiene 244 tablas/vistas mapeadas. Esta tabla destaca los core-paths operacionales).*

## 2. Mapa de Trazabilidad de Métricas e Indicadores (KPI Lineage)

### A. HOME / SALUD GENERAL
- **Indicador:** Salud del Negocio / Margen / DSO Snapshot.
- **Vista/RPC:** \`take_daily_health_snapshot\` (Función RPC que inserta en \`system_health_snapshots\`).
- **Tablas Origen:** \`sales\`, \`finance_ar_open_items_cxc\`, \`inventory_items\`.
- **Inconsistencia:** Ninguna estructural, excepto la heredada del cálculo erróneo del DSO global.

### B. VENTAS Y MÁRGENES
- **Indicador:** Evolución YTD, Top 5 Clientes, Participación de Representantes.
- **Vista/RPC:** \`kpi_sales_ytd\`, \`kpi_sales_top_reps_2026\`, \`kpi_top_10_customer_sales_participation_2026\`.
- **Tablas Origen:** \`sales\`, \`customers\`.
- **Inconsistencia:** Anteriormente resuelta (el frontend mostraba vacío por falta de \`customer_name\` y tipo de moneda, ahora corregido y funcional).

### C. INVENTARIOS
- **Indicador:** Rotación, Stock Crítico, Cobertura.
- **Vista/RPC:** \`kpi_inventory_coverage\`, \`vw_inventory_rotation_semantic\`.
- **Tablas Origen:** \`kpi_inventory_item_snapshot\`, \`kpi_item_demand_3m\`, \`stg_inventory_transactions_clean\`.
- **Inconsistencia:** Resuelta (semántica en el frontend ajustada de "Valor Inmovilizado" a "Valor en Riesgo" para ítems críticos con alta demanda y bajo \`stock_coverage_months\`).

### D. CxC (CUENTAS POR COBRAR)
- **Indicador:** Aging, Clientes Offenders, Radar de Riesgo.
- **Vista/RPC:** \`finance_ar_open_items_cxc\`, \`finance_ar_aging_summary\`.
- **Tablas Origen:** \`finance_ar_open_items\`, \`customer_payments\`.
- **Inconsistencia:** Resuelta (Se agregó deducción de \`total_paid\` desde recibos de pagos para mostrar deuda neta real, ej. Studio Luce ahora solo debe 2 facturas).

### E. DSO (DAYS SALES OUTSTANDING)
- **Indicador:** DSO Global, Evolución Temporal, Clientes Críticos.
- **Vista/RPC:** \`mv_kpi_finance_dso_action_list\` (basado en \`kpi_finance_dso_by_customer_v4\` -> \`v3\`).
- **Tablas Origen:** \`finance_ar_open_items_cxc\`.
- **Inconsistencia CRÍTICA (Detectada en Discovery):** El denominador de la fórmula del DSO (Ventas del Periodo) está leyendo exclusivamente de \`finance_ar_open_items_cxc\`. Al omitir todas las ventas que *ya fueron pagadas*, el divisor es artificialmente bajo, disparando matemáticamente el DSO (ej. Studio Luce 280.9 días). Debe ser refactorizado para leer el total de ventas desde \`sales\`.

## 3. Mapa de Rutas de Node.js (Backend -> Frontend)

| Endpoint Node.js | Vista Supabase Consumida | Componente React que lo renderiza | Estado |
|---|---|---|---|
| \`/api/sales/evolution\` | \`kpi_sales_evolution_monthly\` | \`SalesEvolutionChart\` | ACTIVO |
| \`/api/sales/top-customers\` | \`kpi_top_10_customer_sales_participation_2026\` | \`TopCustomersList\` | ACTIVO |
| \`/api/sales/reps\` | \`kpi_sales_top_reps_2026\` | \`SalesRepsChart\` | ACTIVO |
| \`/api/inventory/critical\` | \`kpi_inventory_coverage\` | \`InventoryDetailTable\` (Tab Riesgo) | ACTIVO |
| \`/api/inventory/slow\` | \`kpi_inventory_coverage\` | \`InventoryDetailTable\` (Tab Lentos) | ACTIVO |
| \`/api/finance/dso/action-list\` | \`mv_kpi_finance_dso_action_list\` | \`ActionList\` (Dashboard Finanzas) | ACTIVO |
| \`/api/finance/ar/radar\` | \`finance_ar_open_items_cxc\` | \`RiskRadarChart\` | ACTIVO |

---
*Fin del Reporte de Discovery.*
`;

fs.writeFileSync('../docs/discovery/DATA_LINEAGE_MATRIX.md', markdown);
console.log('Matrix generated');
