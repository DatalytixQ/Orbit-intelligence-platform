# API Documentation

**Document:** `api.md`  
**Version:** 2.0  
**Status:** Productive Baseline  
**Owner:** ERP Intelligence Foundation  

---

# 1. Purpose

Define the official REST API contract for ERP Intelligence Foundation.

The API exposes executive intelligence, not raw ERP data.

It provides access to:

- KPIs
- Executive summaries
- Insights
- Priorities
- Sales Intelligence
- Inventory Intelligence
- Supply Intelligence
- Accounts Receivable Intelligence
- DQBot conversational intelligence

---

# 2. API Principles

- Business-first endpoints.
- Read-only analytical consumption.
- No RAW or STG direct exposure.
- JSON responses.
- Stable contracts.
- Traceable to `database.md` and `kpi.md`.
- DQBot-compatible.
- Multi-tenant ready.
- External API fields should use English technical naming.

---

# 3. API Architecture

```text
Frontend / DQBot
        ↓
REST API
        ↓
Business Layer
        ↓
Semantic Layer
        ↓
KPI Layer
        ↓
Rules
        ↓
Insights
        ↓
Priority Engine
```

APIs must never consume directly:

```text
RAW
STG
ERP source tables
```

---

# 4. Current Frontend Consumption

Current frontend service:

```text
frontend/services/aiService.js
```

Implemented calls:

```text
POST /api/ai/chat-v2
GET  /api/analytics/executive
GET  /api/insights/current
```

---

# 5. API Domains

```text
/api/sales/*
/api/inventory/*
/api/finance/*
/api/analytics/*
/api/insights/*
/api/ai/*
```

Planned domains:

```text
/api/rules/*
/api/priorities/*
/api/scenarios/*
/api/configuration/*
/api/tenants/*
/api/health/*
```

---

# 6. Authentication

## Current MVP

Authentication is handled at the application layer.

## Target Model

Planned API authentication model:

```text
JWT
RBAC
Tenant-aware authorization
Supabase Auth
```

---

# 7. Response Standard

Successful response:

```json
{
  "ok": true,
  "data": {},
  "meta": {
    "domain": "sales",
    "source": "kpi_layer",
    "generated_at": "2026-06-29T00:00:00Z"
  }
}
```

Error response:

```json
{
  "ok": false,
  "error": "Controlled error message"
}
```

---

# 8. Naming Standard

External JSON fields should use English technical naming.

Example:

```json
{
  "sales_ars": 1250000,
  "sales_usd": 1200,
  "forecast_ars": 1500000,
  "projected_revenue": 1400000,
  "revenue_at_supply_risk": 250000
}
```

Internal database aliases may remain unchanged, but API responses should standardize external contracts.

---

# 9. Status Classification

Each endpoint must be classified as:

```text
IMPLEMENTED
PARTIALLY_IMPLEMENTED
PLANNED
```

---

# 10. Sales API

## 10.1 Purpose

El dominio **Sales API** expone toda la inteligencia comercial del producto.

No entrega información transaccional del ERP, sino información procesada y consolidada desde la capa analítica.

Sus consumidores principales son:

- Executive Dashboard
- DQBot
- Executive Home
- Insight Engine
- Integraciones externas

---

## 10.2 Analytical Flow

```text
ERP

↓

RAW

↓

STG

↓

Business

↓

Sales Semantic Layer

↓

Sales KPIs

↓

Sales Rules

↓

Sales Insights

↓

REST API
```

---

## 10.3 Endpoint Catalog

| Endpoint | Purpose | Status |
|----------|---------|--------|
| GET /api/sales/current | Ventas del período actual | IMPLEMENTED |
| GET /api/sales/monthly | Histórico mensual | IMPLEMENTED |
| GET /api/sales/forecast | Forecast comercial | IMPLEMENTED |
| GET /api/sales/projection | Proyección del período | IMPLEMENTED |
| GET /api/sales/pipeline | Pipeline comercial | IMPLEMENTED |
| GET /api/sales/customers | Clientes principales | IMPLEMENTED |
| GET /api/sales/products | Productos principales | IMPLEMENTED |
| GET /api/sales/concentration | Concentración comercial | IMPLEMENTED |
| GET /api/sales/insights | Insights comerciales | IMPLEMENTED |
| GET /api/sales/executive-summary | Resumen ejecutivo | IMPLEMENTED |

---

## 10.4 Main Data Sources

Business Objects

```text
sales

sales_semantic_current

open_sales_order_demand
```

Semantic Views

```text
vw_sales_executive_summary

vw_sales_projection_current

vw_sales_pipeline_vs_supply

vw_sales_pipeline_supply_executive_summary

vw_sales_customer_concentration

vw_sales_top_customers_current

vw_sales_top_products_current

vw_sales_insights
```

KPIs

```text
kpi_sales_current_month

kpi_sales_previous_month

kpi_sales_forecast_monthly
```

---

# 11. Inventory API

## 11.1 Purpose

Expone el estado operativo del inventario y su impacto sobre el negocio.

---

## 11.2 Endpoint Catalog

| Endpoint | Purpose | Status |
|----------|---------|--------|
| GET /api/inventory/overview | Estado general | IMPLEMENTED |
| GET /api/inventory/coverage | Cobertura | IMPLEMENTED |
| GET /api/inventory/rotation | Rotación | IMPLEMENTED |
| GET /api/inventory/value | Valor inventario | IMPLEMENTED |
| GET /api/inventory/critical | Inventario crítico | IMPLEMENTED |
| GET /api/inventory/slow-moving | Baja rotación | IMPLEMENTED |
| GET /api/inventory/items | Consulta de artículos | IMPLEMENTED |

---

## 11.3 Source Objects

```text
stg_items_master_clean

stg_inventory_clean

vw_inventory_items_semantic

vw_inventory_position_semantic

vw_inventory_rotation_semantic

vw_inventory_coverage_semantic
```

---

# 12. Supply API

## 12.1 Purpose

Expone la capacidad real de abastecimiento del negocio.

Su objetivo es responder preguntas como:

- ¿Qué porcentaje del pipeline puede entregarse?
- ¿Qué revenue está en riesgo?
- ¿Qué clientes serán afectados?
- ¿Qué productos limitan las ventas?

---

## 12.2 Endpoint Catalog

| Endpoint | Purpose | Status |
|----------|---------|--------|
| GET /api/supply/current | Estado Supply | IMPLEMENTED |
| GET /api/supply/pipeline | Pipeline vs Supply | IMPLEMENTED |
| GET /api/supply/revenue-risk | Revenue en riesgo | IMPLEMENTED |
| GET /api/supply/customers | Clientes afectados | IMPLEMENTED |
| GET /api/supply/bom | Capacidad BOM | IMPLEMENTED |
| GET /api/supply/alerts | Alertas | IMPLEMENTED |

---

## 12.3 Source Objects

```text
inventory_supply_semantic_current

inventory_bom_capacity_current

vw_sales_pipeline_vs_supply

vw_sales_pipeline_supply_executive_summary

vw_sales_pipeline_supply_risk_customers

vw_executive_sales_supply_alerts
```

---

# 13. Finance / Accounts Receivable API

## 13.1 Purpose

Expone indicadores de liquidez, cobranzas y riesgo financiero.

---

## 13.2 Current Status

Este dominio se encuentra parcialmente implementado.

La documentación funcional y el SOP específico del dominio serán desarrollados posteriormente.

---

## 13.3 Planned Endpoint Catalog

| Endpoint | Purpose | Status |
|----------|---------|--------|
| GET /api/finance/overview | Resumen financiero | PARTIALLY_IMPLEMENTED |
| GET /api/finance/aging | Aging | PARTIALLY_IMPLEMENTED |
| GET /api/finance/dso | DSO | PARTIALLY_IMPLEMENTED |
| GET /api/finance/customer-risk | Riesgo clientes | PARTIALLY_IMPLEMENTED |
| GET /api/finance/collections | Cobranzas | PLANNED |
| GET /api/finance/liquidity | Liquidez | PLANNED |

---

## 13.4 Planned Data Sources

```text
finance_ar_snapshot_daily

finance_customer_risk_snapshot

vw_ar_aging_summary

vw_ar_customer_risk

vw_ar_open_items_detail
```

---

## 13.5 Pending Documentation

Antes de considerar este dominio completo deberán existir:

- sop_ar_intelligence.md
- reglas financieras documentadas
- catálogo completo de KPIs financieros
- definición de APIs finales

---

# 14. Cross-Domain Dependency Matrix

| API Domain | Database | KPI | Rules | Insights |
|------------|----------|-----|--------|----------|
| Sales | ✔ | ✔ | ✔ | ✔ |
| Inventory | ✔ | ✔ | ✔ | ✔ |
| Supply | ✔ | ✔ | ✔ | ✔ |
| Finance | ✔ | Parcial | Parcial | Parcial |

---

# 15. Analytics API

## 15.1 Purpose

El dominio **Analytics API** expone la visión ejecutiva consolidada del negocio.

Su objetivo es entregar indicadores de alto nivel ya procesados, evitando que los consumidores deban reconstruir información desde múltiples dominios.

Está diseñado para ser consumido por:

- Executive Dashboard
- Executive Home
- Mobile Dashboard
- Integraciones BI
- DQBot

---

## 15.2 Analytical Flow

```text
Sales KPIs
            │
Inventory KPIs
            │
Supply KPIs
            │
Finance KPIs
            │
Executive Rules
            │
Executive Insights
            │
Analytics API
```

---

## 15.3 Endpoint Catalog

| Endpoint | Purpose | Status |
|----------|---------|--------|
| GET /api/analytics/executive | Executive Home | IMPLEMENTED |
| GET /api/analytics/health | Business Health | PLANNED |
| GET /api/analytics/summary | Resumen Ejecutivo | PLANNED |
| GET /api/analytics/priorities | Prioridades Ejecutivas | PLANNED |
| GET /api/analytics/trends | Tendencias | PLANNED |
| GET /api/analytics/scenarios | Escenarios | PLANNED |

---

## 15.4 Primary Sources

Sales

```text
vw_sales_executive_summary
```

Inventory

```text
inventory_supply_semantic_current
```

Supply

```text
vw_sales_pipeline_supply_executive_summary
```

Finance

```text
finance_customer_risk_snapshot
```

Insights

```text
vw_sales_insights
```

Priority Engine

```text
priority_queue_current
```

(Objeto planificado)

---

## 15.5 Executive Response Example

```json
{
  "snapshot_date": "2026-06-29",
  "sales_mtd": 1285000,
  "projected_revenue": 1548000,
  "deliverable_revenue": 1480000,
  "revenue_at_supply_risk": 68000,
  "business_health": "Healthy",
  "active_priorities": 4
}
```

---

# 16. Insights API

## 16.1 Purpose

Expone los Insights generados por el motor heurístico.

Los Insights representan interpretación ejecutiva, no únicamente indicadores.

Cada Insight responde:

- ¿Qué ocurre?
- ¿Por qué ocurre?
- ¿Cuál es el impacto?
- ¿Qué acción se recomienda?

---

## 16.2 Processing Flow

```text
KPIs

↓

Rules

↓

Insights

↓

Priority Engine

↓

REST API
```

---

## 16.3 Endpoint Catalog

| Endpoint | Purpose | Status |
|----------|---------|--------|
| GET /api/insights/current | Insights activos | IMPLEMENTED |
| GET /api/insights/history | Historial | PLANNED |
| GET /api/insights/domain/{domain} | Insights por dominio | PLANNED |
| GET /api/insights/{rule} | Insight específico | PLANNED |

---

## 16.4 Response Structure

```json
{
  "rule_id": "V001",
  "domain": "sales",
  "severity": "HIGH",
  "severity_score": 3,
  "title": "Forecast below target",
  "description": "...",
  "recommended_action": "...",
  "impact_value": 285000,
  "generated_at": "2026-06-29T05:00:00Z"
}
```

---

## 16.5 Supported Domains

```text
Sales

Inventory

Supply

Accounts Receivable

Executive
```

---

# 17. DQBot API

## 17.1 Purpose

DQBot constituye la interfaz conversacional del producto.

No consulta directamente tablas del ERP.

Opera exclusivamente sobre información analítica consolidada.

---

## 17.2 Processing Pipeline

```text
Question

↓

Intent Detection

↓

Domain Detection

↓

Context Builder

↓

KPIs

↓

Rules

↓

Insights

↓

Priority

↓

Natural Language Response
```

---

## 17.3 Endpoint

```text
POST /api/ai/chat-v2
```

---

## 17.4 Request

```json
{
  "question": "How are sales performing this month?"
}
```

---

## 17.5 Response

```json
{
  "ok": true,
  "answer": "...",
  "data": [],
  "insights": [],
  "suggested_questions": [],
  "meta": {
    "domain": "sales",
    "intent": "business_diagnosis",
    "generated_at": "2026-06-29T11:00:00Z"
  }
}
```

---

## 17.6 Information Sources

DQBot puede consumir únicamente:

```text
KPIs

Insights

Executive Summaries

Priority Engine

Business Configuration
```

Nunca debe consultar directamente:

```text
RAW

STG

Business Tables

ERP
```

---

## 17.7 Future Capabilities

Planificadas:

- Multi-turn conversation
- Context persistence
- Scenario comparison
- Executive recommendations
- Root Cause Analysis
- Explainable AI
- Cross-domain diagnosis

---

# 18. Cross-Domain Integration

La API debe garantizar consistencia entre dominios.

```text
Sales

↓

Inventory

↓

Supply

↓

Finance

↓

Rules

↓

Insights

↓

Analytics

↓

DQBot
```

Cada endpoint debe consumir únicamente objetos documentados en:

- database.md
- kpi.md

---

# 19. API Versioning Strategy

## Versioning Standard

```text
/api/v1/
/api/v2/
```

Durante el MVP se mantendrá una única versión funcional.

La evolución futura deberá preservar compatibilidad hacia atrás cuando sea posible.

---

## Compatibility Rules

- No eliminar campos existentes.
- Agregar nuevos campos como opcionales.
- Mantener contratos JSON estables.
- Documentar cambios entre versiones.

---

# 20. Security and Governance

## Authentication

Objetivo de arquitectura:

```text
Supabase Auth

↓

JWT

↓

RBAC

↓

Tenant Validation
```

---

## Authorization Levels

Roles previstos:

| Role | Access |
|-------|---------|
| Administrator | Full |
| Executive | Executive Analytics |
| Manager | Domain Analytics |
| Analyst | Read Only |
| API Integration | Service Account |

---

## Audit

Todas las llamadas deberán registrar:

- timestamp
- tenant
- endpoint
- execution time
- response status
- correlation_id

---

# 21. API Quality Standards

Cada endpoint deberá cumplir:

- Respuesta determinística.
- Uso exclusivo de capas analíticas.
- Contratos JSON documentados.
- Trazabilidad hacia KPIs.
- Consistencia entre dominios.
- Manejo uniforme de errores.
- Compatibilidad con DQBot.

---

# 22. Endpoint Traceability Matrix

## 22.1 Purpose

Toda API debe tener trazabilidad completa desde el origen de los datos hasta la respuesta entregada al consumidor.

La siguiente matriz constituye el contrato oficial entre:

- Base de Datos
- KPIs
- Rule Engine
- Insight Engine
- REST API
- DQBot

---

# 22.2 Sales Traceability

| Endpoint | View / Table | KPI | Rules | Insight |
|-----------|--------------|-----|--------|----------|
| GET /api/sales/current | kpi_sales_current_month | Monthly Sales | V001 V002 | Forecast |
| GET /api/sales/monthly | vw_sales_monthly | Monthly Sales | V003 | Trend |
| GET /api/sales/forecast | kpi_sales_forecast_monthly | Forecast | V001 V002 | Forecast Gap |
| GET /api/sales/projection | vw_sales_projection_current | Projected Revenue | V001 | Projection |
| GET /api/sales/pipeline | vw_sales_pipeline_vs_supply | Pipeline Revenue | V001 I003 | Supply Impact |
| GET /api/sales/customers | vw_sales_top_customers_current | Customer Sales | V004 | Customer Concentration |
| GET /api/sales/products | vw_sales_top_products_current | Product Sales | V005 | Product Concentration |
| GET /api/sales/concentration | vw_sales_customer_concentration | Customer Concentration | V004 | Executive Insight |
| GET /api/sales/insights | vw_sales_insights | Multiple | V001-V005 | Sales Insights |

---

# 22.3 Inventory Traceability

| Endpoint | View | KPI | Rules |
|-----------|------|-----|--------|
| GET /api/inventory/overview | vw_inventory_position_semantic | Total Stock | I001 |
| GET /api/inventory/value | vw_inventory_position_semantic | Inventory Value | I001 |
| GET /api/inventory/coverage | vw_inventory_coverage_semantic | Coverage | I002 |
| GET /api/inventory/rotation | vw_inventory_rotation_semantic | Rotation | I003 |
| GET /api/inventory/critical | vw_inventory_coverage_semantic | Critical Coverage | I001 |
| GET /api/inventory/slow-moving | vw_inventory_rotation_semantic | Slow Moving | I004 |

---

# 22.4 Supply Traceability

| Endpoint | View | KPI | Rules |
|-----------|------|-----|--------|
| GET /api/supply/current | inventory_supply_semantic_current | Supply Available | I003 |
| GET /api/supply/pipeline | vw_sales_pipeline_vs_supply | Deliverable Revenue | I003 |
| GET /api/supply/revenue-risk | vw_sales_pipeline_vs_supply | Revenue at Risk | I003 |
| GET /api/supply/customers | vw_sales_pipeline_supply_risk_customers | Supply Risk | I003 |
| GET /api/supply/alerts | vw_executive_sales_supply_alerts | Executive Alerts | I003 |

---

# 22.5 Finance Traceability

| Endpoint | Planned Source | KPI | Rules |
|-----------|----------------|-----|--------|
| GET /api/finance/overview | finance_ar_snapshot_daily | Open Balance | C001 |
| GET /api/finance/aging | vw_ar_aging_summary | Aging | C001 |
| GET /api/finance/dso | vw_ar_dso | DSO | C002 |
| GET /api/finance/customer-risk | finance_customer_risk_snapshot | Customer Risk | C003 |
| GET /api/finance/collections | vw_collection_efficiency | Collection Efficiency | C004 |

---

# 23. Standard JSON Contracts

## 23.1 Executive Summary

```json
{
  "snapshot_date": "2026-06-29",
  "sales": {},
  "inventory": {},
  "supply": {},
  "finance": {},
  "insights": [],
  "priorities": []
}
```

---

## 23.2 KPI Response

```json
{
  "ok": true,
  "domain": "sales",
  "kpi": "monthly_sales",
  "value": 1250000,
  "currency": "ARS",
  "generated_at": "2026-06-29T05:00:00Z"
}
```

---

## 23.3 Insight Response

```json
{
  "rule_id": "V001",
  "severity": "HIGH",
  "severity_score": 3,
  "title": "Forecast below target",
  "impact_value": 250000,
  "recommended_action": "...",
  "detail_payload": {}
}
```

---

## 23.4 Collection Response

```json
{
  "ok": true,
  "data": [],
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total_records": 325
  }
}
```

---

# 24. Error Management

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Successful request |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Unauthorized |
| 404 | Resource not found |
| 409 | Business conflict |
| 422 | Validation error |
| 429 | Rate limit exceeded |
| 500 | Internal error |
| 503 | Service unavailable |

---

## Standard Error Contract

```json
{
  "ok": false,
  "error": {
    "code": "BUSINESS_VALIDATION_ERROR",
    "message": "Forecast configuration not found.",
    "correlation_id": "xxxx-xxxx"
  }
}
```

---

# 25. Performance Guidelines

## Target Response Times

| Endpoint Type | Target |
|--------------|--------|
| KPI | < 300 ms |
| Executive Summary | < 700 ms |
| Insights | < 800 ms |
| DQBot Context | < 1.5 s |

---

## Optimization Principles

- Consultar únicamente vistas analíticas.
- Evitar cálculos complejos durante la ejecución del endpoint.
- Centralizar la lógica de negocio en funciones SQL y capas semánticas.
- Reutilizar KPIs previamente calculados.

---

# 26. API Roadmap

## MVP

- Sales API
- Inventory API
- Supply API
- Analytics API
- Insights API
- DQBot API

---

## Next Release

- Finance API completa.
- Rules API.
- Priority API.
- Configuration API.
- Scenario API.

---

## Future Evolution

- GraphQL Gateway (opcional).
- Streaming de eventos.
- Webhooks.
- API pública para partners.
- SDK oficial.

---

# 27. Acceptance Criteria

La API se considera completa cuando:

- Existe trazabilidad completa Endpoint → Database → KPI → Rule → Insight.
- Todos los contratos JSON están documentados.
- Todos los endpoints consumen únicamente capas analíticas.
- La nomenclatura es consistente entre dominios.
- Los errores siguen un contrato único.
- La autenticación y autorización están definidas.
- La documentación está sincronizada con `functional.md`, `database.md`, `kpi.md`, `architecture.md` y `operation.md`.

---

# Appendix A — Domain Coverage

| Domain | Status |
|---------|--------|
| Sales | Complete |
| Inventory | Complete |
| Supply | Complete |
| Finance | Partial |
| Analytics | Complete |
| Insights | Complete |
| DQBot | Complete |

---

# Appendix B — Layer Consumption

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
REST API
   ↓
Frontend
DQBot
External Integrations
```

---

# Appendix C — Documentation Dependencies

La API depende directamente de los siguientes documentos maestros:

- `functional.md`
- `database.md`
- `kpi.md`
- `architecture.md`
- `operation.md`

Y mantiene consistencia con:

- `rules-engine.md`
- `dqbot-architecture.md`
- `sop_sales_intelligence.md`
- `sop_inventory_supply_intelligence.md`
- `sop_ar_intelligence.md`

---

# End of Document