# SOP Inventory & Supply Intelligence

**Document:** `sop_inventory_supply_intelligence.md`  
**Version:** 2.0  
**Status:** Functional SOP  
**Owner:** ERP Intelligence Platform

---

# 1. Purpose

Este documento define el proceso funcional completo del dominio **Inventory & Supply Intelligence**.

Su objetivo es describir cómo la plataforma transforma información operacional del ERP en indicadores ejecutivos, reglas de negocio, Insights y respuestas conversacionales relacionadas con inventario, abastecimiento y capacidad de cumplimiento comercial.

Este SOP se encuentra alineado con:

- `functional.md`
- `database.md`
- `kpi.md`
- `rules-engine.md`
- `api.md`
- `dqbot-architecture.md`

---

# 2. Business Objectives

El dominio Inventory & Supply busca responder preguntas estratégicas como:

- ¿Existe riesgo de quiebre de stock?
- ¿Cuánto inventario disponible tenemos?
- ¿Cuál es la cobertura por producto?
- ¿Qué porcentaje del pipeline puede entregarse?
- ¿Qué ingresos están en riesgo por falta de abastecimiento?
- ¿Qué productos presentan sobre stock?
- ¿Qué componentes limitan la producción?
- ¿Cuál es el impacto económico del inventario?

---

# 3. Functional Scope

Este dominio comprende los siguientes procesos:

```text
Inventory Position

↓

Inventory Valuation

↓

Coverage

↓

Inventory Rotation

↓

Supply Availability

↓

BOM Capacity

↓

Sales Pipeline vs Supply

↓

Inventory Insights

↓

Executive Dashboard

↓

DQBot
```

---

# 4. Functional Architecture

```text
ERP

↓

RAW

↓

STG

↓

Business Layer

↓

Semantic Layer

↓

Inventory KPIs

↓

Rules Engine

↓

Insights

↓

REST API

↓

Dashboard / DQBot
```

---

# 5. Source Information

El dominio consume información proveniente de:

## Inventory

- Items Master
- Inventory Balance
- Inventory Cost
- Warehouse
- Locations

---

## Supply

- Purchase Orders
- Open Supply
- Incoming Inventory
- BOM Components
- Production Availability

---

## Commercial

- Open Sales Orders
- Sales Pipeline
- Pending Deliveries

---

## Configuration

- Item Master
- Cost Master
- Business Rules
- Client Configuration

---

# 6. Semantic Objects

Las principales vistas semánticas utilizadas son:

```text
inventory_supply_semantic_current

vw_inventory_position_semantic

vw_inventory_coverage_semantic

vw_inventory_rotation_semantic

vw_sales_pipeline_vs_supply

vw_sales_pipeline_supply_executive_summary

inventory_bom_capacity_current
```

Estas vistas representan la fuente oficial para KPIs, Rules Engine y APIs.

---

# 7. Business Layer

## 7.1 Purpose

La Business Layer normaliza la información proveniente del ERP antes de construir la capa semántica.

Su responsabilidad es garantizar consistencia entre inventario, abastecimiento y demanda comercial.

---

## Main Business Objects

```text
inventory_balance

inventory_transactions

purchase_orders

inventory_supply

bom_components

open_sales_order_demand
```

---

## Responsibilities

- Consolidar stock por producto.
- Calcular costos.
- Consolidar órdenes abiertas.
- Normalizar ubicaciones.
- Identificar supply comprometido.
- Preparar datos para la capa semántica.

---

# 8. Semantic Layer

## Purpose

La Semantic Layer representa la fuente oficial de información para todo el dominio Inventory & Supply.

DQBot, APIs, KPIs y Rules Engine nunca consumen directamente tablas Business.

---

## Main Semantic Views

### Inventory Position

```text
vw_inventory_position_semantic
```

Responsable de consolidar:

- Stock disponible.
- Stock comprometido.
- Stock reservado.
- Valor del inventario.

---

### Inventory Coverage

```text
vw_inventory_coverage_semantic
```

Calcula:

- Consumo promedio.
- Cobertura.
- Meses de inventario.
- Riesgo de quiebre.

---

### Inventory Rotation

```text
vw_inventory_rotation_semantic
```

Calcula:

- Rotación.
- Consumo histórico.
- Inventario inmovilizado.
- Slow Moving Inventory.

---

### Supply Availability

```text
inventory_supply_semantic_current
```

Consolida:

- Supply disponible.
- Órdenes de compra.
- Recepciones esperadas.
- Estado del abastecimiento.

---

### Pipeline vs Supply

```text
vw_sales_pipeline_vs_supply
```

Relaciona:

```text
Pipeline Comercial

↓

Supply Disponible

↓

Revenue Entregable

↓

Revenue en Riesgo
```

---

### Executive Summary

```text
vw_sales_pipeline_supply_executive_summary
```

Genera indicadores ejecutivos como:

- Revenue comprometido.
- Revenue entregable.
- Revenue en riesgo.
- % de cumplimiento potencial.

---

### BOM Capacity

```text
inventory_bom_capacity_current
```

Determina:

- Capacidad teórica.
- Componentes limitantes.
- Restricciones productivas.

---

# 9. KPI Layer

## Inventory KPIs

Los principales KPIs del dominio son:

| KPI | Description |
|------|-------------|
| Inventory Value | Valor total del inventario |
| Stock Available | Stock disponible |
| Coverage Months | Meses de cobertura |
| Inventory Rotation | Rotación |
| Slow Moving Inventory | Inventario de baja rotación |
| Dead Stock | Inventario sin movimiento |

---

## Supply KPIs

| KPI | Description |
|------|-------------|
| Supply Available | Supply disponible |
| Deliverable Revenue | Revenue entregable |
| Revenue at Risk | Revenue comprometido |
| Pipeline Coverage | Cobertura del pipeline |
| Supply Capacity | Capacidad disponible |
| BOM Capacity | Capacidad productiva |

---

## KPI Relationships

```text
Inventory Position

↓

Coverage

↓

Supply Capacity

↓

Deliverable Revenue

↓

Executive KPIs
```

---

# 10. Rules Engine Integration

El dominio Inventory & Supply utiliza las reglas documentadas en `rules-engine.md`.

## Supported Rules

```text
I001
Critical Inventory Coverage

I002
Low Inventory Rotation

I003
Supply Capacity Risk

I004
BOM Capacity Constraint

I005
Inventory Data Quality
```

---

## Processing Sequence

```text
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

REST API

↓

Dashboard

DQBot
```

---

# 11. Generated Insights

El Insight Engine puede generar diagnósticos como:

### Inventory

- Cobertura crítica.
- Sobre stock.
- Inventario inmovilizado.
- Riesgo de quiebre.
- Productos sin costo.

---

### Supply

- Revenue comprometido.
- Supply insuficiente.
- Riesgo de entrega.
- Restricciones BOM.
- Clientes afectados.

---

## Example Insight

```text
Supply Risk

Severity:
HIGH

Impact:

$125.000 Revenue at Risk

Recommended Action:

Priorizar abastecimiento de productos críticos.
```

---

# 12. Executive Indicators

Los indicadores consolidados utilizados por la dirección incluyen:

| KPI | Source |
|------|--------|
| Inventory Value | vw_inventory_position_semantic |
| Coverage Months | vw_inventory_coverage_semantic |
| Rotation | vw_inventory_rotation_semantic |
| Deliverable Revenue | vw_sales_pipeline_vs_supply |
| Revenue at Supply Risk | vw_sales_pipeline_vs_supply |
| Pipeline Coverage % | vw_sales_pipeline_supply_executive_summary |

---

# 13. REST API Integration

## 13.1 Purpose

Todas las capacidades del dominio Inventory & Supply son expuestas mediante APIs REST estandarizadas.

Estas APIs constituyen el único mecanismo autorizado para el consumo de información por parte de:

- Executive Dashboard
- DQBot
- Aplicaciones móviles
- Integraciones externas
- Reporting Services

---

# 14. Inventory APIs

## Inventory Overview

```http
GET /api/inventory/overview
```

### Returns

- Inventory Value
- Available Stock
- Reserved Stock
- Inventory Cost
- Inventory Health

---

## Inventory Position

```http
GET /api/inventory/position
```

### Returns

```text
Item

Warehouse

Available

Committed

Reserved

Net Available
```

---

## Inventory Coverage

```http
GET /api/inventory/coverage
```

### Returns

- Coverage Months
- Average Monthly Consumption
- Coverage Category
- Coverage Risk

---

## Inventory Rotation

```http
GET /api/inventory/rotation
```

### Returns

- Rotation Index
- Slow Moving Indicator
- Dead Stock Indicator
- Average Consumption

---

## Critical Inventory

```http
GET /api/inventory/critical
```

### Returns

Productos cuya cobertura activa reglas I001 o I005.

---

# 15. Supply APIs

## Supply Overview

```http
GET /api/supply/overview
```

### Returns

- Supply Available
- Purchase Orders
- Incoming Inventory
- Deliverable Revenue
- Revenue at Risk

---

## Pipeline vs Supply

```http
GET /api/supply/pipeline
```

### Returns

```text
Customer

Item

Pending Revenue

Deliverable Revenue

Revenue at Risk

Supply Status
```

---

## Supply Risk

```http
GET /api/supply/revenue-risk
```

### Returns

- Revenue at Risk
- Customers Impacted
- Items Impacted
- Pipeline Exposure

---

## Supply Alerts

```http
GET /api/supply/alerts
```

### Returns

Alertas generadas por:

- Supply Risk
- Negative Margin
- Critical Coverage
- Missing Supply

---

## BOM Capacity

```http
GET /api/supply/bom-capacity
```

### Returns

- Production Capacity
- Critical Components
- Capacity Constraints
- Available Production

---

# 16. Dashboard Integration

El Dashboard Ejecutivo consume únicamente APIs oficiales.

---

## Executive Widgets

### Inventory Summary

```text
Inventory Value

Coverage

Rotation

Health Score
```

---

### Supply Summary

```text
Pipeline Revenue

Deliverable Revenue

Revenue at Risk

Coverage %
```

---

### Executive Alerts

```text
Critical Inventory

Supply Risk

Slow Moving

Dead Stock
```

---

## Dashboard Flow

```text
REST API

↓

Executive Widgets

↓

Charts

↓

KPIs

↓

Insights

↓

Recommended Actions
```

---

# 17. DQBot Integration

DQBot utiliza exclusivamente las APIs del dominio.

---

## Supported Questions

### Inventory

> ¿Cuál es el valor del inventario?

---

> ¿Qué productos tienen cobertura crítica?

---

> ¿Qué productos tienen baja rotación?

---

### Supply

> ¿Qué ventas están en riesgo?

---

> ¿Cuál es el revenue entregable?

---

> ¿Qué clientes serán afectados?

---

> ¿Cuál es el principal problema del abastecimiento?

---

## Conversation Flow

```text
Question

↓

Intent Detection

↓

Inventory Domain

↓

Supply APIs

↓

Rules

↓

Insights

↓

Natural Language Response
```

---

# 18. Explainability

Todas las respuestas relacionadas con Inventory & Supply deberán incluir evidencia.

---

## Example

Pregunta:

> ¿Por qué existe riesgo de supply?

---

Respuesta:

```text
El revenue comprometido asciende a $420.000.

Actualmente sólo el 78% del pipeline puede entregarse.

Las restricciones provienen de tres productos críticos con cobertura inferior a un mes.

Las reglas I001 e I003 fueron activadas.

Se recomienda priorizar abastecimiento y revisar órdenes de compra abiertas.
```

---

## Evidence Sources

Las respuestas pueden citar:

- KPIs
- Semantic Views
- Rules
- Insights
- Executive Summary

Nunca deberán basarse en cálculos realizados por DQBot.

---

# 19. Cross-Domain Relationships

Inventory & Supply mantiene relaciones directas con otros dominios.

```text
Inventory

↓

Supply

↓

Sales

↓

Executive
```

## Sales

Afecta:

- Forecast
- Deliverable Revenue
- Pipeline
- Revenue at Risk

---

## Executive

Afecta:

- Business Health
- Priority Engine
- Executive Summary

---

## Finance (Future)

Permitirá estimar:

- Capital inmovilizado.
- Valor financiero del inventario.
- Impacto en flujo de caja.

---

# 20. Data Quality Controls

Antes de generar KPIs o Insights se ejecutan controles de calidad.

## Validation Rules

- Item Master completo.
- Costos disponibles.
- Ubicaciones válidas.
- Supply consistente.
- Cantidades positivas.
- BOM válida.
- Duplicados eliminados.

---

## Quality Outputs

```text
Quality Score

↓

Missing Costs

↓

Missing Master

↓

Invalid Supply

↓

Warnings
```

Los resultados alimentan directamente la regla **I005 — Inventory Data Quality**.

---

# 21. Refresh Strategy

## Processing Flow

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
```

## Frequency

```text
05:00
15:00
```

---

# 22. Operational Controls

Cada ejecución debe validar:

- carga completa;
- consistencia de inventario;
- costos disponibles;
- supply actualizado;
- pipeline sincronizado;
- errores registrados.

---

# 23. Current Status

| Component | Status |
|----------|--------|
| Inventory Position | Implemented |
| Coverage | Implemented |
| Rotation | Implemented |
| Supply Availability | Implemented |
| Pipeline vs Supply | Implemented |
| BOM Capacity | Implemented |
| Rules I001–I005 | Defined |
| DQBot Integration | Defined |

---

# 24. Limitations

- Supply allocation aún no optimiza competencia entre pedidos.
- BOM capacity es determinística.
- Forecast supply-constrained aún es básico.
- Reglas configurables por cliente quedan como roadmap.

---

# 25. Roadmap

## Phase 1

Consolidar baseline Inventory & Supply.

## Phase 2

Externalizar umbrales I001–I005.

## Phase 3

Agregar escenarios supply-constrained.

## Phase 4

Incorporar predicción de quiebre y demanda.

---

# 26. Acceptance Criteria

Este SOP queda completo cuando:

- Pipeline Inventory & Supply está documentado.
- KPIs están trazados.
- Reglas I001–I005 están definidas.
- APIs están documentadas.
- DQBot consume solo información consolidada.
- Limitaciones y roadmap están explícitos.

---

# End of Document