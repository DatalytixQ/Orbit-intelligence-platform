# SOP Sales Intelligence

**Document:** `sop_sales_intelligence.md`  
**Version:** 2.0  
**Status:** Functional SOP  
**Owner:** ERP Intelligence Platform

---

# 1. Purpose

Este documento describe el funcionamiento completo del dominio **Sales Intelligence**, definiendo cómo la plataforma transforma la información comercial proveniente del ERP en KPIs, reglas de negocio, Insights ejecutivos y respuestas conversacionales mediante DQBot.

Este documento se encuentra alineado con:

- `functional.md`
- `database.md`
- `kpi.md`
- `api.md`
- `rules-engine.md`
- `dqbot-architecture.md`
- `technology-stack.md`

---

# 2. Business Objectives

El dominio Sales Intelligence busca responder preguntas como:

- ¿Cómo evolucionan las ventas?
- ¿Llegaremos a la meta mensual?
- ¿Cuál será el cierre proyectado?
- ¿Qué clientes generan mayor facturación?
- ¿Qué productos impulsan el negocio?
- ¿Cuál es el margen esperado?
- ¿Qué ventas presentan riesgo?
- ¿Qué factores afectan el forecast?
- ¿Cuál es la principal prioridad comercial?

---

# 3. Functional Scope

El proceso funcional comprende:

```text
Sales Transactions

↓

Sales Normalization

↓

Sales Semantic Layer

↓

KPIs

↓

Sales Rules

↓

Insights

↓

Priority Engine

↓

REST APIs

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

Sales Semantic Layer

↓

Sales KPIs

↓

Rules Engine

↓

Insight Engine

↓

Priority Engine

↓

REST APIs

↓

Dashboard / DQBot
```

---

# 5. Source Information

## Sales

- Sales Invoices
- Sales Orders
- Sales Lines
- Customers
- Items
- Salespersons
- Price Lists

---

## Commercial Planning

- Monthly Forecast
- Annual Targets
- Commercial Objectives
- Sales Settings

---

## Supply Integration

- Open Sales Orders
- Deliverable Revenue
- Revenue at Risk

---

## Master Data

- Customer Master
- Item Master
- Categories
- Subsidiaries
- Currency
- Exchange Rates

---

# 6. Semantic Objects

Las principales vistas semánticas del dominio son:

```text
sales_semantic_current

v_kpi_sales_base

vw_sales_projection_current

vw_sales_executive_summary

vw_sales_top_customers_current

vw_sales_top_products_current

vw_sales_customer_concentration

vw_sales_pipeline_vs_supply

vw_sales_pipeline_supply_executive_summary

vw_sales_insights
```

Estas vistas constituyen la única fuente oficial para KPIs, Rules Engine, APIs y DQBot.

---

# 7. Business Layer

## 7.1 Purpose

La Business Layer consolida y normaliza toda la información comercial proveniente del ERP antes de construir la capa semántica.

Su responsabilidad es garantizar que todas las métricas comerciales sean consistentes independientemente del ERP de origen.

---

## Main Business Objects

```text
sales

sales_lines

customers

items_master

sales_orders

sales_forecast_monthly

sales_settings

open_sales_order_demand
```

---

## Responsibilities

- Consolidar ventas.
- Normalizar clientes.
- Normalizar productos.
- Calcular importes netos.
- Calcular márgenes estimados.
- Homogeneizar monedas.
- Preparar información para la capa semántica.

---

# 8. Semantic Layer

## Purpose

La Semantic Layer constituye la fuente oficial para todos los procesos analíticos del dominio Sales.

Ni DQBot, ni las APIs, ni el Rules Engine consumen directamente tablas Business.

---

## Main Semantic Views

### Sales Current

```text
sales_semantic_current
```

Consolida:

- Ventas netas.
- Cantidades.
- Costos estimados.
- Márgenes.
- Clientes.
- Productos.

---

### KPI Base

```text
v_kpi_sales_base
```

Responsable de generar la base común para:

- KPIs.
- Dashboards.
- Indicadores ejecutivos.

---

### Sales Projection

```text
vw_sales_projection_current
```

Calcula:

- Actual Sales.
- Deliverable Revenue.
- Revenue at Risk.
- Projected Revenue Current.

---

### Executive Summary

```text
vw_sales_executive_summary
```

Genera:

- Sales MTD.
- Previous Month Sales.
- Margin MTD.
- Active Customers.
- Sales MoM.

---

### Customer Concentration

```text
vw_sales_customer_concentration
```

Calcula:

- Ventas Totales.
- Participación Top 10.
- Concentración comercial.

---

### Top Customers

```text
vw_sales_top_customers_current
```

Obtiene:

- Top Clientes.
- Ventas.
- Margen.
- Ranking.

---

### Top Products

```text
vw_sales_top_products_current
```

Obtiene:

- Productos líderes.
- Ventas.
- Margen.
- Cantidades.

---

### Sales Insights

```text
vw_sales_insights
```

Consolida los Insights generados por el Rules Engine.

---

# 9. KPI Layer

## Main Sales KPIs

| KPI | Description |
|------|-------------|
| Sales MTD | Ventas acumuladas del mes |
| Sales Previous Month | Ventas del mes anterior |
| Forecast | Pronóstico comercial |
| Projected Revenue | Proyección de cierre |
| Target Achievement | Cumplimiento de meta |
| Estimated Margin | Margen estimado |
| Active Customers | Clientes activos |
| Average Ticket | Ticket promedio |

---

## Commercial KPIs

| KPI | Description |
|------|-------------|
| Deliverable Revenue | Revenue entregable |
| Revenue at Risk | Revenue comprometido |
| Customer Concentration | Concentración Top 10 |
| Product Concentration | Concentración por productos |
| Forecast Accuracy | Exactitud del forecast |
| Sales Growth | Crecimiento comercial |

---

## KPI Relationships

```text
Sales

↓

Forecast

↓

Projection

↓

Rules

↓

Insights

↓

Executive KPIs
```

---

# 10. Rules Engine Integration

El dominio Sales utiliza las reglas comerciales definidas en `rules-engine.md`.

## Supported Rules

```text
V001
Forecast below Target

V002
Commercial Deviation

V003
Sales Trend

V004
Customer Concentration

V005
Product Concentration
```

---

## Processing Sequence

```text
Sales Semantic Views

↓

KPIs

↓

Rules Engine

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

El dominio puede generar automáticamente diagnósticos ejecutivos.

## Commercial Insights

- Forecast bajo meta.
- Desvío comercial.
- Caída de tendencia.
- Concentración de clientes.
- Concentración de productos.
- Margen deteriorado.
- Revenue comprometido.
- Riesgo de cumplimiento.

---

## Example Insight

```text
Forecast below Target

Severity:
HIGH

Impact:

ARS 1.250.000

Recommended Action:

Priorizar oportunidades cercanas al cierre y revisar restricciones de supply.
```

---

# 12. Executive Indicators

Los indicadores consolidados para la dirección incluyen:

| KPI | Source |
|------|--------|
| Sales MTD | vw_sales_executive_summary |
| Margin MTD | vw_sales_executive_summary |
| Forecast | kpi_sales_forecast_monthly |
| Projected Revenue | vw_sales_projection_current |
| Customer Concentration | vw_sales_customer_concentration |
| Deliverable Revenue | vw_sales_pipeline_supply_executive_summary |
| Revenue at Risk | vw_sales_pipeline_supply_executive_summary |
| Sales Insights | vw_sales_insights |

---

# 13. REST API Integration

## Sales APIs

```http
GET /api/sales/current
GET /api/sales/monthly
GET /api/sales/forecast
GET /api/sales/projection
GET /api/sales/pipeline
GET /api/sales/customers
GET /api/sales/products
GET /api/sales/insights
```

---

# 14. Dashboard Integration

El Dashboard consume únicamente APIs oficiales.

## Widgets

- Sales MTD
- Forecast
- Projected Revenue
- Revenue at Risk
- Top Customers
- Top Products
- Sales Insights
- Commercial Priorities

---

# 15. DQBot Integration

DQBot puede responder preguntas como:

> ¿Cómo van las ventas este mes?

> ¿Llegaremos a la meta?

> ¿Qué clientes concentran más ventas?

> ¿Qué productos explican el crecimiento?

> ¿Qué está afectando el forecast?

DQBot consume:

```text
Sales APIs
Insights APIs
Analytics APIs
Priority Engine
```

Nunca calcula KPIs directamente.

---

# 16. Explainability

Cada respuesta comercial debe explicar:

- KPI utilizado.
- Regla activada.
- Umbral superado.
- Impacto económico.
- Acción recomendada.

---

# 17. Cross-Domain Dependencies

Sales depende directamente de:

```text
Inventory
Supply
Accounts Receivable
```

## Supply Impact

```text
Open Sales Orders
↓
Supply Availability
↓
Deliverable Revenue
↓
Revenue at Risk
↓
Sales Projection
```

---

# 18. Data Quality Controls

Validaciones mínimas:

- Ventas con cliente válido.
- Productos con maestro activo.
- Costos disponibles.
- Moneda válida.
- Fechas válidas.
- Facturas duplicadas eliminadas.
- Pipeline sincronizado.

---

# 19. Refresh Strategy

## 19.1 Processing Pipeline

El dominio **Sales Intelligence** sigue un proceso secuencial para garantizar que toda la información comercial utilizada por la plataforma sea consistente y trazable.

```text
ERP

↓

RAW

↓

STG

↓

Business Layer

↓

Sales Semantic Layer

↓

KPIs

↓

Rules Engine

↓

Insight Engine

↓

Priority Engine

↓

REST APIs

↓

Executive Dashboard

↓

DQBot
```

---

## Refresh Frequency

Frecuencia recomendada para el MVP:

```text
05:00

15:00
```

En futuras versiones la frecuencia podrá parametrizarse por cliente o activarse mediante eventos.

---

# 20. Operational Controls

Cada proceso de actualización deberá validar como mínimo:

- Carga completa de ventas.
- Integridad de clientes.
- Integridad de productos.
- Costos disponibles.
- Conversión de monedas.
- Forecast actualizado.
- Pipeline sincronizado.
- Revenue entregable calculado.
- Revenue en riesgo calculado.
- Ejecución del Rules Engine.
- Generación de Insights.
- Registro de auditoría.

---

# 21. Current Implementation Status

| Component | Status |
|-----------|--------|
| Sales Semantic Layer | Implemented |
| Executive Views | Implemented |
| KPIs | Implemented |
| Forecast | Implemented |
| Projection | Implemented |
| Rules V001–V005 | Defined |
| Insight Engine | Defined |
| Priority Engine | Defined |
| REST APIs | Implemented |
| DQBot Integration | Defined |

---

# 22. Current Limitations

La versión actual contempla las siguientes limitaciones conocidas:

- Forecast basado en reglas heurísticas.
- Predicción comercial no incorpora modelos de Machine Learning.
- Márgenes calculados con costo estimado cuando el costo real no está disponible.
- Configuración avanzada por cliente en fase de roadmap.
- Simulación de escenarios comerciales pendiente de implementación.

---

# 23. Product Roadmap

## Phase 1 — MVP

- KPIs comerciales.
- Forecast.
- Executive Dashboard.
- APIs.
- Rules Engine.
- DQBot.

---

## Phase 2

- Forecast avanzado.
- Configuración dinámica de reglas.
- Objetivos comerciales por unidad de negocio.
- Simulación de escenarios.

---

## Phase 3

- Predicción mediante IA.
- Recomendaciones comerciales automáticas.
- Detección de oportunidades.
- Explicaciones enriquecidas.
- Alertas proactivas.

---

# 24. Acceptance Criteria

El dominio **Sales Intelligence** se considera completo cuando:

- La capa semántica está documentada.
- Todos los KPIs oficiales están definidos.
- Las reglas V001–V005 están implementadas y documentadas.
- Los Insights comerciales son trazables.
- Las APIs consumen exclusivamente la capa analítica.
- DQBot responde utilizando únicamente KPIs e Insights oficiales.
- Existe trazabilidad completa desde el ERP hasta el Dashboard Ejecutivo.

---

# Appendix A — Sales Intelligence Pipeline

```text
Sales Transactions
        │
        ▼
Business Layer
        │
        ▼
Sales Semantic Layer
        │
        ▼
Sales KPIs
        │
        ▼
Rules Engine
        │
        ▼
Insight Engine
        │
        ▼
Priority Engine
        │
        ▼
REST APIs
        │
        ├────────► Executive Dashboard
        │
        ├────────► DQBot
        │
        └────────► External Integrations
```

---

# Appendix B — Related Documentation

## Core Documents

- `functional.md`
- `database.md`
- `kpi.md`
- `api.md`
- `rules-engine.md`

## Supporting Documents

- `technology-stack.md`
- `dqbot-architecture.md`
- `architecture.md`
- `operation.md`

## Related SOPs

- `sop_inventory_supply_intelligence.md`
- `sop_ar_intelligence.md`

---

# End of Document