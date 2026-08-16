# ERP Intelligence Foundation
# KPI Catalog

**Document:** `kpi.md`  
**Version:** 2.0  
**Status:** Productive Baseline  
**Owner:** ERP Intelligence Foundation  
**Last Updated:** 2026-06

---

# Related Documentation

- database.md
- functional.md
- architecture.md
- operation.md
- api.md
- dqbot-architecture.md
- sop_sales_intelligence.md
- sop_inventory_supply_intelligence.md
- sop_ar_intelligence.md

---

# 1. Purpose

## 1.1 Objective

Este documento define el **modelo oficial de KPIs** de ERP Intelligence Foundation.

Su propósito es establecer un catálogo único y consistente de indicadores ejecutivos utilizados por la plataforma para evaluar la salud del negocio, alimentar el motor de reglas, generar insights y responder consultas mediante DQBot.

Cada KPI debe cumplir cuatro principios fundamentales:

- Ser objetivamente medible.
- Ser completamente trazable.
- Ser reutilizable por cualquier consumidor.
- Ser explicable desde los datos de origen.

Este documento constituye la referencia funcional y matemática de todos los indicadores oficiales del producto.

---

## 1.2 Scope

Este documento incluye:

- Taxonomía oficial de KPIs.
- Definición funcional.
- Objetivo de negocio.
- Fórmulas.
- Dependencias.
- Objetos fuente.
- Frecuencia de actualización.
- Reglas consumidoras.
- Insights asociados.
- APIs consumidoras.
- Estado de implementación.

No incluye:

- SQL de implementación.
- Código del backend.
- Endpoints REST (api.md).
- Arquitectura de datos (database.md).

---

# 2. KPI Philosophy

## 2.1 KPI Design Principles

Todos los KPIs fueron diseñados bajo los siguientes principios.

### Business First

Cada indicador responde una pregunta de negocio.

Nunca se generan métricas únicamente porque existan datos disponibles.

---

### Explainability

Todo KPI debe responder:

- ¿Qué mide?
- ¿Cómo se calcula?
- ¿De dónde proviene?
- ¿Quién lo consume?

---

### Traceability

Todo KPI debe poder reconstruirse completamente.

```text
ERP

↓

RAW

↓

STG

↓

Business

↓

Semantic

↓

KPI
```

---

### Deterministic

El mismo conjunto de datos debe producir siempre exactamente el mismo resultado.

---

### Reusable

Los KPIs deben ser reutilizados por:

- Executive Dashboard
- Rule Engine
- Insight Engine
- APIs
- DQBot

---

# 3. KPI Architecture

## 3.1 Analytical Flow

```text
ERP

↓

RAW

↓

STG

↓

Business Objects

↓

Semantic Views

↓

KPIs

↓

Rules

↓

Insights

↓

Priority Engine

↓

REST APIs

↓

DQBot
```

---

## 3.2 KPI Consumers

Todos los KPIs pueden ser consumidos por uno o más de los siguientes componentes:

| Consumer | Purpose |
|-----------|---------|
| Executive Dashboard | Visualización ejecutiva |
| REST API | Integración externa |
| Rule Engine | Evaluación heurística |
| Insight Engine | Interpretación ejecutiva |
| Priority Engine | Priorización transversal |
| DQBot | Respuestas conversacionales |

---

# 4. KPI Taxonomy

Los KPIs oficiales se agrupan en cinco dominios.

## Sales KPIs

- Revenue
- Growth
- Forecast
- Pipeline
- Projection
- Margin
- Concentration

---

## Inventory KPIs

- Stock
- Inventory Value
- Coverage
- Rotation
- Availability

---

## Supply KPIs

- Deliverable Revenue
- Revenue at Risk
- Deliverable %
- Supply Coverage

---

## Accounts Receivable KPIs

- Aging
- DSO
- Collections
- Liquidity
- Customer Risk

---

## Executive KPIs

Indicadores transversales utilizados para evaluar la salud integral del negocio.

---

# 5. Sales KPIs

---

# KPI S001 — Monthly Sales

## Business Objective

Medir las ventas acumuladas del mes actual.

---

## Business Question

¿Cuánto se ha vendido durante el período actual?

---

## Formula

```text
Monthly Sales

=

SUM(Net Sales)
```

---

## Source Flow

```text
raw_sales

↓

stg_sales_clean

↓

sales

↓

kpi_sales_current_month
```

---

## Source Objects

Business:

- sales

View:

- kpi_sales_current_month

---

## Dimensions

- Mes
- Cliente
- Moneda

---

## Output

- Ventas ARS
- Ventas USD

---

## Consumers

- Executive Dashboard
- API
- DQBot
- Rule Engine

---

## Related Rules

- V001
- V002
- V003

---

## Update Frequency

- 05:00
- 15:00

---

## Status

**Implemented**

---

# KPI S002 — Previous Month Sales

## Business Objective

Comparar el desempeño actual contra el período inmediatamente anterior.

---

## Formula

```text
SUM(Net Sales Previous Month)
```

---

## Source Objects

Business:

- sales

View:

- kpi_sales_previous_month

---

## Consumers

- Executive Dashboard
- Sales Insights
- DQBot

---

## Related Rules

- V003

---

## Status

**Implemented**

---

# KPI S003 — Monthly Sales Growth

## Business Objective

Medir la variación porcentual entre el mes actual y el mes anterior.

---

## Formula

```text
(Current Month

-

Previous Month)

/

Previous Month

×

100
```

---

## Source Views

- kpi_sales_current_month
- kpi_sales_previous_month
- vw_sales_executive_summary

---

## Consumers

- Dashboard
- Insights
- DQBot

---

## Related Rules

- V003

---

## Status

**Implemented**

---

# KPI S004 — Monthly Forecast Achievement

## Business Objective

Comparar las ventas proyectadas con la meta comercial.

---

## Formula

```text
Projected Revenue

/

Monthly Target

×

100
```

---

## Source Objects

Configuration:

- sales_settings

Projection:

- vw_sales_projection_current

Forecast:

- kpi_sales_forecast_monthly

---

## Consumers

- Executive Dashboard
- Sales Insights

---

## Related Rules

- V001
- V002

---

## Status

**Implemented**

---

# KPI S005 — Projected Revenue Current

## Business Objective

Estimar el cierre operativo del período.

---

## Formula

```text
Projected Revenue

=

Actual Sales

+

Deliverable Revenue
```

---

## Source Objects

- vw_sales_projection_current

---

## Business Meaning

Representa el cierre esperado considerando:

- ventas realizadas;
- pipeline actualmente entregable.

---

## Consumers

- Dashboard
- DQBot

---

## Related Rules

- V001

---

## Status

**Implemented**

---

# KPI S006 — Pipeline Revenue

## Business Objective

Medir el valor económico de las órdenes abiertas.

---

## Formula

```text
SUM(Pending Revenue)
```

---

## Source Objects

Business:

- open_sales_order_demand

View:

- vw_sales_pipeline_supply_executive_summary

---

## Consumers

- Executive Dashboard
- Supply Intelligence

---

## Related Rules

- V001

---

## Status

**Implemented**

---

# KPI S007 — Deliverable Revenue

## Business Objective

Determinar cuánto del pipeline puede entregarse con el supply disponible.

---

## Formula

```text
SUM(Deliverable Revenue)
```

---

## Source Objects

- vw_sales_pipeline_vs_supply

---

## Consumers

- Executive Dashboard
- Projection
- DQBot

---

## Related Rules

- V001

---

## Status

**Implemented**

---

# KPI S008 — Revenue at Supply Risk

## Business Objective

Cuantificar el revenue comprometido por restricciones de abastecimiento.

---

## Formula

```text
SUM(Revenue at Supply Risk)
```

---

## Source Views

- vw_sales_pipeline_vs_supply

- vw_sales_pipeline_supply_executive_summary

---

## Consumers

- Supply Dashboard
- Executive Dashboard
- DQBot

---

## Related Rules

- I003
- V001

---

## Status

**Implemented**

---

# KPI S009 — Pipeline Margin

## Business Objective

Evaluar la rentabilidad esperada del pipeline comercial.

---

## Formula

```text
SUM(Pending Margin)
```

---

## Source Objects

- open_sales_order_demand

---

## Consumers

- Executive Dashboard

---

## Related Rules

- V005

---

## Status

**Implemented**

---

# KPI S010 — Customer Concentration

## Business Objective

Determinar el nivel de dependencia respecto de los principales clientes.

---

## Formula

```text
Top 10 Sales

/

Total Sales

×

100
```

---

## Source View

- vw_sales_customer_concentration

---

## Consumers

- Executive Dashboard
- Rule Engine
- DQBot

---

## Related Rules

- V004

---

## Threshold Reference

| Participation | Health |
|---------------|---------|
| <40% | Healthy |
| 40–55% | Low |
| 55–70% | Medium |
| >70% | High |

---

## Status

**Implemented**

---

# KPI S011 — Product Concentration

## Business Objective

Evaluar la dependencia comercial sobre un conjunto reducido de productos.

---

## Formula

```text
Top Product Sales

/

Current Sales

×

100
```

---

## Source Views

- vw_sales_top_products_current
- vw_sales_insights

---

## Related Rules

- V005

---

## Consumers

- Dashboard
- DQBot

---

## Status

**Implemented**

---
# 6. Inventory KPIs

# KPI I001 — Inventory Total Stock

## Objective

Medir stock total disponible.

## Formula

```text
SUM(stock_available)
```

## Source

```text
vw_inventory_position_semantic
```

## Status

Implemented

---

# KPI I002 — Inventory Total Valuation

## Objective

Medir valor económico del inventario.

## Formula

```text
SUM(stock_available × average_cost)
```

## Source

```text
vw_inventory_position_semantic
```

## Status

Implemented

---

# KPI I003 — Inventory Coverage

## Objective

Medir meses de cobertura disponible.

## Formula

```text
coverage_months =
stock_available / avg_monthly_demand
```

## Source

```text
vw_inventory_coverage_semantic
```

## Related Rules

```text
I001
I002
I003
```

## Status

Implemented

---

# KPI I004 — Critical Stock Items

## Objective

Identificar ítems con cobertura crítica.

## Logic

```text
coverage_months < 1
```

## Source

```text
vw_inventory_coverage_semantic
```

## Status

Implemented

---

# KPI I005 — Slow Moving Inventory

## Objective

Detectar inventario con baja rotación.

## Logic

```text
stock_available > 0
AND avg_monthly_demand = 0 OR low rotation
```

## Source

```text
vw_inventory_rotation_semantic
```

## Status

Implemented

---

# 7. Supply KPIs

# KPI SUP001 — Supply Available Quantity

## Objective

Medir cantidad disponible considerando stock, inbound y BOM.

## Source

```text
inventory_supply_semantic_current
```

## Status

Implemented

---

# KPI SUP002 — Deliverable Revenue

## Objective

Medir revenue del pipeline que puede entregarse.

## Formula

```text
deliverable_revenue =
pending_revenue × deliverable_qty / quantity_pending
```

## Source

```text
vw_sales_pipeline_vs_supply
```

## Status

Implemented

---

# KPI SUP003 — Revenue at Supply Risk

## Objective

Medir revenue abierto en riesgo por falta de supply.

## Formula

```text
revenue_at_supply_risk =
pending_revenue × at_risk_qty / quantity_pending
```

## Source

```text
vw_sales_pipeline_vs_supply
```

## Status

Implemented

---

# KPI SUP004 — Deliverable Revenue %

## Formula

```text
deliverable_revenue / pipeline_revenue × 100
```

## Source

```text
vw_sales_pipeline_supply_executive_summary
```

## Status

Implemented

---

# 8. Accounts Receivable KPIs

# KPI AR001 — Open Balance

## Objective

Medir saldo abierto total.

## Formula

```sql
SELECT SUM(amount_due) 
FROM finance_ar_open_items 
WHERE status = 'Open';
```

## Source

```text
finance_ar_snapshot_daily
vw_ar_aging_summary
finance_ar_open_items
```

## Status

Fully Implemented

---

# KPI AR002 — Overdue Balance

## Objective

Medir deuda vencida.

## Formula

```sql
SELECT SUM(amount_due) 
FROM finance_ar_open_items 
WHERE status = 'Open' AND due_date < CURRENT_DATE;
```

## Source

```text
vw_ar_aging_summary
finance_ar_open_items
```

## Related Rules

```text
C001
C005
```

## Status

Fully Implemented

---

# KPI AR003 — DSO

## Objective

Medir días promedio de cobranza (Days Sales Outstanding).

## Formula

```text
DSO = (Accounts Receivable / Total Credit Sales) * Number of Days
```

## Source

```text
vw_ar_dso
finance_ar_open_items
sales_semantic_current
```

## Related Rules

```text
C002
```

## Status

Fully Implemented

---

# KPI AR004 — Customer Risk

## Objective

Clasificar riesgo financiero por cliente.

## Formula

```text
Risk Score = (Overdue Balance / Total Balance) * W1 + (Average Payment Delay Days) * W2
```
Thresholds: High (> 75), Medium (50-75), Low (< 50)

## Source

```text
vw_ar_customer_risk
finance_customer_risk_snapshot
```

## Related Rules

```text
C003
```

## Status

Fully Implemented

---

# KPI AR005 — Collection Efficiency

## Objective

Medir el porcentaje de cuentas por cobrar recuperadas en un período.

## Formula

```text
Collection Efficiency (%) = (Total Cash Collected / (AR Beginning Balance + Credit Sales)) * 100
```

## Source

```text
vw_collection_efficiency
customer_payments
```

## Status

Fully Implemented

---

# 9. Executive KPIs

## Business Health Score (KPI EX001)

## Objective

Medir la salud general del negocio combinando el desempeño de todos los dominios críticos.

## Formula

```text
Business Health Score = 
  (Sales Score * 0.40) + 
  (Inventory Score * 0.20) + 
  (Supply Score * 0.20) + 
  (AR Score * 0.20)
```

## Source

```text
E001 Business Health Rule
Sales Semantic
Inventory Semantic
Supply Semantic
Accounts Receivable Semantic
```

## Status

Fully Implemented

---

## Executive Priority Score (KPI EX002)

## Objective

Medir cuantitativamente la prioridad ejecutiva de cada alerta/insight generado para determinar cuál requiere atención inmediata.

## Formula

```text
Priority Score = 
  (Estimated Financial Impact Score * 0.50) + 
  (Time Urgency Score * 0.30) + 
  (Structural Risk Score * 0.20)
```

## Source

```text
E003 Strategic Priority Detection
Priority Engine
Insights
Rules
```

## Status

Fully Implemented

---

# 10. KPI Dependency Model

```text
ERP
↓
RAW
↓
STG
↓
Business
↓
Semantic
↓
KPI
↓
Rules
↓
Insights
↓
Priority
↓
API / DQBot
```

---

# 11. KPI Coverage Status

| Domain | Status |
|--------|--------|
| Sales | Implemented |
| Inventory | Implemented |
| Supply | Implemented |
| Accounts Receivable | Partially Implemented |
| Executive Health | Planned |

---
# 12. KPI Formula Catalog

## 12.1 Purpose

Este catálogo centraliza las fórmulas oficiales utilizadas por ERP Intelligence Foundation para el cálculo de indicadores ejecutivos.

Su objetivo es garantizar que:

- todos los dashboards calculen exactamente el mismo resultado;
- el Rule Engine utilice una única fuente matemática;
- DQBot entregue respuestas consistentes;
- las APIs expongan indicadores homogéneos;
- cualquier cambio futuro pueda auditarse fácilmente.

Las fórmulas aquí documentadas representan el estándar oficial del producto.

---

# 12.2 Sales KPI Formulas

## Monthly Sales

```text
Monthly Sales

=

SUM(Net Sales)
```

---

## Previous Month Sales

```text
Previous Month Sales

=

SUM(Net Sales Previous Month)
```

---

## Sales Growth %

```text
(Current Month Sales

-

Previous Month Sales)

/

Previous Month Sales

×

100
```

---

## Forecast Achievement %

```text
Projected Revenue

/

Monthly Target

×

100
```

---

## Pipeline Revenue

```text
SUM(Pending Revenue)
```

---

## Deliverable Revenue

```text
SUM(Deliverable Revenue)
```

---

## Revenue at Supply Risk

```text
SUM(Revenue at Supply Risk)
```

---

## Pipeline Margin

```text
SUM(Pending Margin)
```

---

## Customer Concentration %

```text
Top 10 Customer Sales

/

Total Sales

×

100
```

---

## Product Concentration %

```text
Top Product Sales

/

Current Sales

×

100
```

---

## Active Customers

```text
COUNT(DISTINCT Customer)
```

---

## Average Ticket

```text
Total Sales

/

Invoices
```

---

## Estimated Margin

```text
Net Sales

-

Estimated Cost
```

---

# 12.3 Inventory KPI Formulas

## Inventory Value

```text
SUM(

Stock Available

×

Average Cost

)
```

---

## Inventory Coverage

```text
Coverage

=

Stock Available

/

Average Monthly Demand
```

---

## Rotation

```text
Rotation

=

Outbound 90 Days

/

3
```

---

## Supply Available

```text
Stock

+

Inbound

+

BOM Capacity
```

---

## Deliverable Quantity

```text
MIN(

Pending Quantity,

Supply Available

)
```

---

## At Risk Quantity

```text
Pending Quantity

-

Deliverable Quantity
```

---

# 12.4 Supply KPI Formulas

## Deliverable Revenue

```text
Pending Revenue

×

Deliverable Qty

/

Pending Qty
```

---

## Revenue At Risk

```text
Pending Revenue

×

At Risk Qty

/

Pending Qty
```

---

## Deliverable %

```text
Deliverable Revenue

/

Pipeline Revenue

×

100
```

---

## Revenue At Risk %

```text
Revenue At Risk

/

Pipeline Revenue

×

100
```

---

# 12.5 Accounts Receivable Formulas

## Open Balance

```text
SUM(Open Balance)
```

---

## Overdue Balance

```text
SUM(

Invoices

WHERE Due Date < Today

)
```

---

## Collection Efficiency

```text
Collected

/

Collectable

×

100
```

---

## DSO

```text
Accounts Receivable

/

Average Daily Sales
```

---

## Customer Risk Score

El score es calculado mediante la combinación ponderada de:

- Aging
- DSO
- Overdue Balance
- Collection History
- Payment Behavior

Los pesos serán parametrizables mediante la futura capa de configuración.

---

# 12.6 Executive KPI Formulas

## Business Health Score

Modelo compuesto que consolida los dominios:

```text
Sales

Inventory

Supply

Accounts Receivable

↓

Business Health
```

Cada dominio aportará un peso configurable.

---

## Executive Priority Score

Modelo previsto:

```text
Priority

=

Severity Score

×

Rule Weight

×

Client Weight

×

Industry Weight
```

Las ponderaciones serán obtenidas desde las tablas de configuración del motor de reglas.

---

# 13. KPI Refresh Strategy

## 13.1 Purpose

Todos los KPIs deben calcularse únicamente una vez finalizado el procesamiento de las capas anteriores.

Nunca deben ejecutarse sobre datos parcialmente procesados.

---

## 13.2 Refresh Sequence

```text
ERP

↓

RAW

↓

STG

↓

Business

↓

Semantic

↓

KPIs

↓

Rules

↓

Insights

↓

Priority

↓

REST API

↓

DQBot
```

---

## 13.3 Refresh Frequency

Durante el MVP se ejecutarán dos ciclos diarios.

| Time | Purpose |
|------|----------|
| 05:00 | Actualización operativa inicial |
| 15:00 | Actualización de cierre parcial |

Cada ejecución recalcula completamente los KPIs productivos.

---

## 13.4 Refresh Dependencies

Los KPIs dependen exclusivamente de objetos ya consolidados.

Ejemplo:

```text
raw_sales

↓

stg_sales_clean

↓

sales

↓

sales_semantic_current

↓

kpi_sales_current_month
```

---

## 13.5 Refresh Validation

Antes de publicar un KPI deberán validarse:

- existencia de datos;
- consistencia temporal;
- integridad de relaciones;
- monedas;
- divisiones por cero;
- valores nulos.

---

# 14. KPI Consumers

## 14.1 Executive Dashboard

Consume principalmente:

- Sales KPIs
- Inventory KPIs
- Supply KPIs
- Executive KPIs

---

## 14.2 REST APIs

Cada endpoint debe consumir KPIs oficiales.

Nunca debe recalcular indicadores.

---

## 14.3 Rule Engine

Las reglas utilizan KPIs como entradas.

Ejemplos:

| Rule | KPI |
|-------|-----|
| V001 | Projected Revenue |
| V002 | Forecast |
| V003 | Sales Growth |
| V004 | Customer Concentration |
| V005 | Product Concentration |
| I001 | Coverage |
| I002 | Rotation |
| I003 | Revenue at Supply Risk |
| C001 | Aging |
| C002 | DSO |

---

## 14.4 Insight Engine

Los Insights consumen:

```text
KPIs

↓

Rules

↓

Insights
```

Nunca utilizan directamente tablas RAW o STG.

---

## 14.5 DQBot

DQBot consulta exclusivamente:

- KPIs
- Insights
- Prioridades
- Contexto ejecutivo

No debe consumir directamente tablas operacionales.

---

# 15. KPI Governance

## 15.1 Single Source of Truth

Cada KPI posee una única definición oficial.

No deben existir variantes del mismo indicador.

---

## 15.2 Version Control

Toda modificación deberá reflejarse en:

- database.md
- kpi.md
- api.md
- functional.md

---

## 15.3 Naming Convention

Todos los KPIs utilizarán:

```text
kpi_<domain>_<indicator>
```

Ejemplos:

```text
kpi_sales_current_month

kpi_sales_previous_month

kpi_inventory_total_stock

kpi_inventory_rotation

kpi_ar_dso
```

---

## 15.4 Traceability

Todo KPI deberá documentar:

- fórmula;
- origen;
- vistas utilizadas;
- funciones involucradas;
- consumidores;
- reglas asociadas.

---

# 16. KPI Quality Controls

## 16.1 Data Completeness

Validar:

- datos faltantes;
- períodos incompletos;
- clientes inexistentes;
- artículos inválidos.

---

## 16.2 Financial Consistency

Verificar:

- revenue;
- margen;
- costos;
- monedas.

---

## 16.3 Inventory Consistency

Validar:

- stock negativo;
- cobertura inválida;
- BOM inconsistentes;
- supply insuficiente.

---

## 16.4 Accounts Receivable

Validar:

- aging;
- documentos abiertos;
- pagos;
- vencimientos.

---

## 16.5 Cross-Domain Validation

Comprobar coherencia entre dominios.

Ejemplos:

- Sales Projection ↔ Supply
- Pipeline ↔ Inventory
- Revenue ↔ Accounts Receivable

---

# 17. KPI Roadmap

## Implementado

### Sales

- Revenue
- Growth
- Pipeline
- Projection
- Concentration
- Forecast

### Inventory

- Stock
- Coverage
- Rotation
- Supply

### Supply

- Deliverable Revenue
- Revenue at Risk
- Supply Availability

---

## En Consolidación

### Accounts Receivable

- DSO
- Aging
- Customer Risk
- Collection Efficiency

---

## Planificado

- Business Health Score
- Executive Priority Score
- Predictive KPIs
- Scenario KPIs
- AI Confidence Indicators
- Cross-Domain Health Indicators

---

# 18. Acceptance Criteria

El catálogo de KPIs se considerará completo cuando:

- Todos los KPIs estén documentados.
- Todas las fórmulas sean únicas.
- Todos los consumidores estén identificados.
- Todas las reglas referencien KPIs oficiales.
- Todas las APIs consuman exclusivamente KPIs documentados.
- Exista trazabilidad completa desde ERP hasta DQBot.
- Los dominios Sales, Inventory, Supply y Accounts Receivable mantengan consistencia con `database.md`, `functional.md`, `architecture.md` y `api.md`.

---

# Appendix A — KPI Master Catalog

El anexo contendrá el inventario completo de todos los KPIs clasificados por:

- Dominio.
- Estado de implementación.
- Capa de origen.
- Consumidores.
- Reglas asociadas.
- Insights asociados.

---

# Appendix B — KPI Dependency Matrix

Relación completa entre:

```text
ERP

↓

RAW

↓

STG

↓

Business

↓

Semantic

↓

KPI

↓

Rule

↓

Insight

↓

Priority

↓

REST API

↓

DQBot
```

---

# Appendix C — Rule Mapping

Matriz de correspondencia:

- KPI → Rule
- Rule → Insight
- Insight → API
- API → DQBot

---

# Appendix D — KPI Glossary

Definición funcional de todos los indicadores utilizados por la plataforma, asegurando consistencia terminológica con `functional.md`, `database.md`, `architecture.md` y `dqbot-architecture.md`.

---

# End of Document