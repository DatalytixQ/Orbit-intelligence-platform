# ERP Intelligence Foundation (NetSuite Edition)
# Database Architecture

**Document:** `database.md`  
**Version:** 2.0  
**Status:** Productive Baseline  
**Owner:** ERP Intelligence Foundation  
**Last Updated:** 2026-06

---

# Related Documentation

- functional.md
- architecture.md
- operation.md
- api.md
- kpi.md
- sop_sales_intelligence.md
- sop_inventory_supply_intelligence.md
- sop_ar_intelligence.md
- dqbot-architecture.md

---

# 1. Purpose

## 1.1 Objective

Este documento constituye la especificación oficial del modelo de datos de **ERP Intelligence Foundation**.

Su propósito es definir de forma integral la arquitectura de datos del producto, describiendo las capas de procesamiento, dominios funcionales, objetos productivos, funciones de transformación, vistas analíticas, KPIs, reglas de negocio e insights que soportan toda la plataforma.

Este documento debe considerarse la **Single Source of Truth (SSOT)** para todos los componentes relacionados con datos.

---

## 1.2 Scope

Este documento cubre:

- Arquitectura lógica.
- Arquitectura física.
- Arquitectura por capas.
- Modelo por dominios.
- Catálogo de tablas.
- Catálogo de funciones.
- Catálogo de vistas.
- Modelo semántico.
- Modelo KPI.
- Modelo de reglas.
- Modelo de insights.
- Objetos de configuración.
- Dependencias.
- Estrategia de actualización.
- Gobierno del dato.
- Calidad del dato.
- Roadmap del modelo de datos.

---

## 1.3 Out of Scope

Este documento **no** describe:

- Implementación del frontend.
- Código del backend.
- APIs REST (documentadas en `api.md`).
- Prompts de IA (documentados en `dqbot-architecture.md`).
- Infraestructura tecnológica (documentada en `technology-stack.md`).

---

# 2. Database Design Principles

La arquitectura de datos fue diseñada siguiendo una estrategia analítica moderna basada en separación de responsabilidades, trazabilidad completa y reutilización de componentes.

---

## 2.1 Layered Architecture

Todo procesamiento se organiza en capas claramente diferenciadas.

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
API
 ↓
DQBot
```

Cada capa posee una responsabilidad única y consume exclusivamente la capa inmediatamente inferior.

---

## 2.2 Immutable Raw Data

Los datos provenientes del ERP nunca deben modificarse.

Las tablas RAW representan una copia íntegra del origen y permiten:

- auditoría;
- reprocesamiento;
- recuperación;
- comparación histórica;
- trazabilidad completa.

---

## 2.3 Deterministic Transformations

Todas las funciones SQL implementadas deben producir exactamente el mismo resultado para un mismo conjunto de datos de entrada.

No se permite lógica aleatoria ni dependiente del contexto de ejecución.

---

## 2.4 Business First

El modelo está diseñado alrededor de conceptos de negocio y no de estructuras propias del ERP.

Ejemplos:

- Sales Pipeline
- Revenue at Risk
- Supply Intelligence
- Customer Risk
- Inventory Coverage
- Executive Health
- Business Priorities

---

## 2.5 Explainable Analytics

Todo KPI, Insight o Prioridad debe poder trazarse hasta:

- tabla RAW origen;
- función de transformación;
- tabla de negocio;
- vista semántica;
- regla aplicada.

Esto permite explicar cualquier resultado mostrado por DQBot.

---

## 2.6 Configurable Intelligence

La lógica configurable no debe quedar embebida permanentemente en las funciones SQL.

La arquitectura contempla una capa de configuración destinada a soportar:

- parámetros por cliente;
- parámetros por industria;
- pesos de severidad;
- umbrales;
- metas comerciales;
- configuración del motor de insights;
- parámetros futuros de IA.

Algunas capacidades ya existen y otras forman parte del roadmap.

---

## 2.7 ERP Agnostic

La arquitectura fue diseñada para ser independiente del ERP origen.

Actualmente consume información proveniente de NetSuite, pero la arquitectura permite incorporar otros ERP mediante APIs sin modificar las capas analíticas.

---

# 3. High-Level Database Architecture

## 3.1 End-to-End Data Flow

```text
NetSuite ERP Sources

 ├── Sales
 ├── Accounts Receivable
 ├── Inventory
 ├── Item Master
 ├── BOM
 ├── Inbound Shipments
 ├── Subsidiaries
 └── Locations

          │
          ▼

RAW Layer

          │
          ▼

STG Layer

          │
          ▼

Business Layer

          │
          ▼

Semantic Layer

          │
          ▼

KPI Layer

          │
          ▼

Rule Engine

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
          ▼

DQBot
```

---

## 3.2 Layer Responsibilities

| Layer | Responsibility |
|---------|----------------|
| ERP | Operational source systems |
| RAW | Immutable operational replica |
| STG | Cleansing, normalization and validation |
| Business | Consolidated business entities |
| Semantic | Business-oriented analytical model |
| KPI | Business metrics |
| Rules | Heuristic evaluation |
| Insights | Executive interpretation |
| Priority | Cross-domain prioritization |
| API | Controlled exposure layer |
| DQBot | Conversational intelligence |

---

## 3.3 Processing Philosophy

Cada capa agrega valor sobre la anterior:

```text
RAW
↓

Data Quality

↓

Business Meaning

↓

Business Metrics

↓

Executive Interpretation

↓

Business Decisions
```

---

# 4. Domain Architecture

La plataforma organiza el procesamiento por dominios funcionales independientes.

Cada dominio mantiene:

- pipeline propio;
- funciones propias;
- vistas semánticas;
- KPIs;
- reglas;
- insights.

---

# 4.1 Master Data Domain

## Objective

Mantener una fuente única de información maestra utilizada por toda la plataforma.

## Main Entities

- Items
- Customers
- Subsidiaries
- Locations
- BOM
- Currency
- Product Classification

## Main Responsibilities

- Normalización.
- Validación.
- Activación/Inactivación.
- Calidad de datos.
- Enriquecimiento básico.

## Consumers

- Sales
- Inventory
- Supply
- Accounts Receivable
- DQBot

---

# 4.2 Sales Intelligence Domain

## Objective

Transformar ventas reales y pipeline comercial en inteligencia ejecutiva.

## Coverage

- Sales Actuals
- Sales Forecast
- Open Sales Orders
- Sales Pipeline
- Customer Concentration
- Product Concentration
- Sales Projections
- Commercial Insights

## Processing Layers

RAW

↓

STG

↓

Sales Actuals

↓

Sales Semantic

↓

Sales KPIs

↓

Sales Rules

↓

Sales Insights

## Main Consumers

- Executive Dashboard
- REST APIs
- Priority Engine
- DQBot

---

# 4.3 Inventory Intelligence Domain

## Objective

Determinar disponibilidad, cobertura, rotación y valorización del inventario.

## Coverage

- Stock Position
- Inventory Value
- Rotation
- Coverage
- Critical Items
- Slow Moving Inventory
- Inventory Health

## Main Consumers

- Supply Intelligence
- Executive Dashboard
- DQBot

---

# 4.4 Supply Intelligence Domain

## Objective

Determinar la capacidad real de abastecimiento utilizando inventario disponible, BOM, inbound y demanda comercial.

## Coverage

- BOM Resolution
- Supply Availability
- Deliverable Revenue
- Revenue at Supply Risk
- Supply Coverage
- Executive Supply KPIs

## Consumers

- Sales Intelligence
- Executive Dashboard
- DQBot

---

# 4.5 Accounts Receivable Intelligence Domain

## Objective

Transformar documentos abiertos de clientes en indicadores de liquidez, riesgo y cobranza.

## Coverage

- Aging
- Collections
- DSO
- Customer Risk
- Liquidity
- Collections Health
- Financial Insights

## Consumers

- Executive Dashboard
- DQBot
- Priority Engine

---

# 4.6 Platform Configuration Domain

## Objective

Centralizar la configuración funcional del producto sin modificar la lógica estándar.

## Current Coverage

- Sales Settings
- Insight Execution Context
- Business Review Rules

## Planned Coverage

- Rule Thresholds
- Client Weights
- Industry Weights
- AI Configuration
- Rule Severity Profiles
- Scenario Parameters

---

# 5. RAW Layer

## 5.1 Purpose

La capa RAW almacena una réplica íntegra de la información extraída desde el ERP.

No contiene lógica de negocio.

No modifica registros.

No realiza cálculos.

Constituye la base para auditoría, reprocesamiento y trazabilidad.

---

## 5.2 Characteristics

- Replica fiel del ERP.
- Full Refresh (MVP).
- Evolución prevista hacia integración incremental vía API.
- Auditoría mediante `snapshot_ts`.
- Multi-tenant mediante `client_id`.

---

## 5.3 Productive RAW Objects

### Master Data

- raw_items_master

---

### Sales

- raw_sales
- raw_sales_lines
- raw_open_sales_orders

---

### Inventory

- raw_inventory
- raw_inventory_transactions

---

### Supply

- raw_item_bom
- raw_inbound_shipments

---

### Accounts Receivable

- raw_ar_open_items
- raw_customer_payments

---

## 5.4 Future Evolution

La arquitectura prevé reemplazar la carga manual por extracción automática desde el ERP mediante APIs, manteniendo exactamente la misma estructura RAW para preservar la compatibilidad con el resto del pipeline.

---

# 6. STG (Staging) Layer

## 6.1 Purpose

La capa STG constituye la etapa oficial de normalización.

Toda información proveniente del ERP debe atravesar esta capa antes de ingresar al modelo de negocio.

Responsabilidades:

- limpieza;
- normalización;
- validación;
- estandarización;
- enriquecimiento básico;
- eliminación de inconsistencias estructurales.

No incorpora aún reglas de negocio ni lógica analítica.

---

## 6.2 Processing Responsibilities

Durante esta etapa se realizan tareas como:

- Normalización de formatos.
- Conversión de tipos de datos.
- Validación de claves.
- Eliminación de duplicados.
- Homologación de códigos.
- Validación de maestros.
- Verificación de relaciones.
- Preparación para la capa Business.

---

## 6.3 Productive STG Objects

### Master Data

- stg_items_master_clean

---

### Sales

- stg_sales_clean
- stg_sales_lines_clean

---

### Inventory

- stg_inventory_clean
- stg_inventory_transactions_clean

---

### Supply

- stg_inbound_shipments_clean

---

### Accounts Receivable

- stg_ar_open_items_clean *(documentado y previsto como parte del dominio financiero)*
- stg_customer_payments_clean

---

## 6.4 Main STG Functions

Actualmente implementadas o previstas dentro del baseline del producto:

- refresh_stg_items_master_clean()
- refresh_stg_sales_clean()
- refresh_stg_sales_lines_clean()
- refresh_stg_inventory_clean()
- refresh_stg_inventory_transactions_clean()
- refresh_stg_inbound_shipments_clean()
- refresh_stg_ar_open_items_clean()

Estas funciones serán documentadas individualmente en la sección **Functions** de este documento, incluyendo:

- objetivo;
- entradas;
- salidas;
- validaciones;
- dependencias;
- consumidores;
- frecuencia de ejecución.

---
# 7. Business Layer

## 7.1 Purpose

La **Business Layer** constituye la primera capa del modelo donde los datos dejan de representar únicamente información operacional proveniente del ERP y pasan a transformarse en entidades de negocio reutilizables.

En esta capa se consolidan múltiples fuentes de información, aplicando reglas de negocio determinísticas para construir objetos estables que serán reutilizados por las capas semánticas, KPIs, reglas e insights.

La Business Layer no genera interpretación ejecutiva; únicamente construye entidades consistentes y reutilizables.

---

## 7.2 Responsibilities

La capa Business es responsable de:

- Consolidar información proveniente de STG.
- Resolver relaciones entre dominios.
- Generar entidades persistentes reutilizables.
- Calcular métricas base.
- Preparar información para consumo analítico.
- Mantener consistencia transversal entre dominios.

---

## 7.3 Processing Flow

```text
STG

↓

Business Entities

↓

Semantic Views

↓

KPIs

↓

Rules

↓

Insights
```

---

# 7.4 Productive Business Objects

## Master Data

### stg_items_master_clean

Representa el maestro oficial de artículos normalizado.

Es consumido por:

- Sales
- Inventory
- Supply
- BOM
- Cost Diagnostics

### Item Master Resolution Layer

Se encarga de unificar artículos de diferentes fuentes y resolver conflictos de master data (ej. diferentes SKUs para el mismo ítem físico en distintas subsidiarias).
Aplica reglas de negocio para:
- Deduplicar ítems.
- Estandarizar descripciones y unidades de medida (UOM).
- Asignar una jerarquía de producto única (Categoría, Subcategoría).
- Determinar el estado del ítem (Activo, Obsoleto, Descontinuado).

---

## Sales

### sales

Entidad consolidada de facturas de venta.

Objetivo:

- Revenue
- Moneda
- Cliente
- Documento
- Cobranza

Consumidores:

- KPIs
- Sales Semantic
- Executive Summary

---

### sales_lines

Detalle por línea de factura.

Consumidores:

- Performance de productos
- Márgenes
- Costos
- Concentración

---

### open_sales_order_demand

Entidad oficial del pipeline comercial.

Responsabilidades:

- órdenes abiertas
- revenue pendiente
- costo pendiente
- margen pendiente
- demanda pendiente

Consumidores:

- Supply Intelligence
- Projection
- Pipeline KPIs
- DQBot

---

## Inventory

### inventory_supply_semantic_current

Tabla productiva que resume el estado actual del supply.

Incluye:

- stock disponible
- supply disponible
- cobertura
- estado supply

Consumidores:

- Sales Pipeline
- Executive Dashboard
- DQBot

---

### inventory_bom_capacity_current

Capacidad teórica de producción por ensamble.

Calculada desde:

- BOM
- Inventario
- Componentes

---

## Accounts Receivable

### customer_payments

Registro final de pagos realizados por clientes, utilizado para medir la eficiencia de cobranza y alimentar los modelos predictivos de riesgo y DSO.

Consumidores:

- Semantic Views (vw_collection_efficiency)
- Rules (C-Series)
- Insights

---

### finance_customer_risk_snapshot

Snapshot consolidado del riesgo financiero por cliente.

Incluye:

- aging
- open balance
- DSO
- score
- riesgo

Consumidores:

- Rules
- Insights
- Executive Home
- DQBot

> **Estado:** Definición funcional disponible. Implementación en consolidación.

---

# 7.5 Business Functions

Las siguientes funciones generan o actualizan entidades de negocio:

| Function | Output |
|-----------|--------|
| refresh_sales_actuals() | sales |
| refresh_open_sales_order_demand() | open_sales_order_demand |
| refresh_inventory_supply_intelligence() | inventory_supply_semantic_current |
| refresh_finance_snapshots() | finance_customer_risk_snapshot |

Cada función será documentada completamente en la sección **Functions**.

---

# 7.6 Business Layer Dependency Map

```text
STG Sales
        │
        ▼
sales
        │
        ▼
sales_lines
        │
        ▼
Sales Semantic
```

```text
STG Inventory

      │

      ▼

Inventory Position

      │

      ▼

Supply Intelligence

      │

      ▼

Inventory Business Objects
```

```text
STG AR

      │

      ▼

Finance Snapshots

      │

      ▼

Customer Risk
```

---

# 8. Semantic Layer

## 8.1 Purpose

La Semantic Layer transforma las entidades de negocio en vistas analíticas orientadas a preguntas de negocio.

Estas vistas representan el principal punto de consumo para:

- KPIs
- Rule Engine
- Executive Dashboard
- APIs
- DQBot

No modifican información; únicamente la presentan bajo una perspectiva funcional.

---

## 8.2 Semantic Architecture

```text
Business Objects

↓

Semantic Views

↓

KPIs

↓

Rules

↓

Insights
```

---

# 8.3 Sales Semantic Views

## Sales Performance

- vw_sales_actual_summary
- vw_sales_item_performance
- vw_sales_customer_performance
- vw_sales_top_customers_current
- vw_sales_top_products_current

Objetivo:

Medir desempeño comercial.

## Sales Semantic Current

- vw_sales_semantic_current

Objetivo:

Proveer la foto actual y limpia de las ventas.
Agrupa la facturación a nivel mensual, unificando clientes, productos y valores brutos/netos listos para el consumo de KPIs e Insights.

---

## Sales Concentration

- vw_sales_customer_concentration

Objetivo:

Determinar dependencia comercial.

Incluye:

- participación Top 10
- ventas totales
- porcentaje concentración

---

## Sales Pipeline

### vw_sales_pipeline_vs_supply

Cruza:

- open_sales_order_demand
- inventory_supply_semantic_current

Calcula:

- deliverable_qty
- at_risk_qty
- deliverable_revenue
- revenue_at_supply_risk

Consumidores:

- Executive Summary
- Projection
- Alerts
- DQBot

---

### vw_sales_pipeline_supply_executive_summary

Resumen ejecutivo del pipeline.

Métricas:

- Pipeline Revenue
- Deliverable Revenue
- Revenue at Supply Risk
- Pipeline Margin
- Deliverable %
- Supply Risk %

---

### vw_sales_pipeline_risk

Clasificación de riesgo del pipeline.

Niveles:

- CRITICAL
- HIGH
- MEDIUM
- LOW

Basado en margen esperado.

---

### vw_sales_pipeline_profitability_distribution

Distribución de líneas según banda de margen.

Bandas:

- Negative
- 0–5%
- 5–10%
- 10–20%
- >20%

---

### vw_sales_pipeline_supply_risk_customers

Resume riesgo de supply por cliente.

Calcula:

- revenue en riesgo
- margen
- pipeline
- cantidad de líneas

---

## Sales Executive Views

### vw_sales_executive_summary

Resume:

- Sales MTD
- Sales Previous Month
- Margin MTD
- Active Customers
- Sales MoM

---

## Sales Projection

### vw_sales_projection_current

Combina:

- ventas reales
- pipeline entregable

Produce:

Projected Revenue Current

---

### vw_sales_projection_alerts

Genera alertas automáticas cuando:

Revenue at Risk > 0

---

## Sales Insights

### vw_sales_insights

Vista final del dominio comercial.

Integra:

- Contexto
- Forecast
- KPIs
- Reglas
- Targets
- Concentración
- Pipeline
- Projection

Genera:

- Insight
- Severidad
- Acción recomendada
- Payload estructurado

Consumidores:

- Executive Dashboard
- API
- DQBot

---

# 8.4 Inventory Semantic Views

Incluye:

- vw_inventory_items_semantic
- vw_inventory_position_semantic
- vw_inventory_rotation_semantic
- vw_inventory_coverage_semantic
- vw_inventory_inbound_semantic
- vw_inventory_bom_capacity_theoretical

Objetivo:

Representar la salud operacional del inventario.

## Inventory Supply Snapshot Daily

- inventory_supply_snapshot_daily

Objetivo:

Capturar diariamente el estado del inventario físico disponible y el suministro entrante (tránsito, producción). Sirve como base histórica para los modelos de machine learning que predecirán stockouts o calcularán el nivel de servicio.

---

# 8.5 Supply Semantic Views

Incluye:

- vw_sales_pipeline_vs_supply
- vw_sales_pipeline_supply_executive_summary

Objetivo:

Responder:

¿Qué parte del pipeline puede entregarse?

---

# 8.6 Accounts Receivable Semantic Views

Incluye (baseline previsto):

- `vw_ar_aging_summary`: Agrupa montos abiertos en tramos de envejecimiento (Current, 1-30, 31-60, 61-90, 90+).
- `vw_ar_customer_risk`: Proyecta el nivel de riesgo de cada cliente basado en historial de atrasos.
- `vw_ar_review_documents`: Lista consolidada de documentos relevantes de AR listos para inspección.
- `vw_ar_open_items_detail`: Detalle a nivel de factura/item de la cartera pendiente.
- `vw_ar_dso`: Calcula el DSO (Days Sales Outstanding) combinando cuentas por cobrar contra ventas a crédito históricas.
- `vw_collection_efficiency`: Mide el índice de eficiencia de cobranza usando registros de `customer_payments` frente a balances de inicio y ventas.

> **Estado:** Documentadas funcionalmente. Implementación en consolidación (Epic E1.2 / Epic E2.2).

---

# 8.7 Sales & Operations Planning (SOP) Semantic Views

Estas vistas cruzan información de múltiples dominios (Sales, Inventory, Supply) para soportar el ciclo de S&OP.

## SOP Demand vs Supply

- vw_sop_demand_supply_balance

Objetivo:
Comparar la demanda proyectada y el backlog de órdenes de venta con el inventario actual y el suministro en tránsito, identificando quiebres futuros (stockouts) o excesos de inventario a nivel SKU/Ubicación a lo largo del tiempo.

## SOP Forecast Accuracy

- vw_sop_forecast_accuracy

Objetivo:
Medir la desviación entre el forecast estadístico o comercial vs la venta real (MAPE, WMAPE, Bias).

---

# 9. KPI Layer

## 9.1 Purpose

La KPI Layer calcula indicadores de negocio reutilizables para todos los consumidores del producto.

Todos los KPIs son determinísticos, trazables y reutilizables.

---

## 9.2 KPI Categories

- Sales KPIs
- Inventory KPIs
- Supply KPIs
- Finance KPIs
- Executive KPIs

---

## 9.3 Sales KPIs

Incluye, entre otros:

- Monthly Sales
- Previous Month Sales
- Forecast
- Pipeline Revenue
- Deliverable Revenue
- Revenue at Supply Risk
- Pipeline Margin
- Customer Concentration
- Product Concentration
- Sales Growth
- Sales Projection

Estos KPIs serán documentados detalladamente en `kpi.md`.

---

## 9.4 Inventory KPIs

Incluye:

- Stock Available
- Inventory Value
- Rotation
- Coverage
- Supply Availability
- Deliverable Capacity

---

## 9.5 Finance KPIs

Incluye:

- DSO
- Aging
- Open Balance
- Collection Efficiency
- Customer Risk
- Liquidity

---

# 10. Rule Layer

## 10.1 Purpose

El Rule Layer interpreta los KPIs mediante reglas heurísticas.

Cada regla produce una evaluación objetiva de la salud del negocio.

---

## 10.2 Rule Domains

### Sales

Serie:

V001–V005

Actualmente implementadas mediante:

vw_sales_insights

Incluyen:

- Forecast
- Desvío
- Tendencia
- Concentración Clientes
- Concentración Productos

---

### Inventory

Serie:

I001–I005

Basadas en:

- cobertura
- rotación
- capacidad
- supply

> Algunas reglas ya poseen soporte de datos; otras permanecen planificadas para completar el motor analítico.

---

### Finance

Serie:

C001–C005

Basadas en:

- DSO
- Aging
- Cobranza
- Riesgo cliente

Implementación en progreso.

---

# 11. Insight Layer

## 11.1 Purpose

Transformar el resultado de las reglas en información ejecutiva accionable.

Cada Insight debe responder:

- Qué sucede.
- Por qué sucede.
- Cuál es el impacto.
- Qué acción se recomienda.

---

## 11.2 Insight Structure

Cada insight contiene:

- Rule ID
- Domain
- Severity
- Severity Score
- Metric Value
- Target Value
- Impact
- Insight Text
- Recommended Action
- Detail Payload
- Generated At

---

## 11.3 Current Insight Coverage

### Sales

Implementado mediante:

- vw_sales_insights

### Inventory

Previsto como parte del motor Inventory Intelligence.

### Accounts Receivable

Previsto como parte del dominio financiero.

---

# 12. Configuration Layer

## 12.1 Purpose

Centralizar todos los parámetros configurables del producto.

La configuración debe permanecer separada de la lógica estándar para facilitar la reutilización del producto entre distintos clientes e industrias.

---

## 12.2 Current Configuration Objects

### sales_settings

Define:

- metas comerciales
- forecast
- moneda
- tolerancias

---

### ar_settings

Define:

- plazos de tolerancia de cobranza
- umbrales de riesgo crediticio (low, medium, high)
- métricas base de cálculo DCO (Days Credit Outstanding)

---

### inventory_settings

Define:

- costos de almacenamiento (holding costs)
- umbrales de exceso y quiebre de stock por categoría
- políticas de reorden automáticas

---

### alert_config

Define:

- canales de notificación (Email, Slack, Webhook)
- umbrales de activación por KPI
- frecuencias de evaluación y reintentos de alertas

---

### client_config

Define:

- configuración multi-tenant (tenant_id)
- preferencias regionales (zona horaria, formato de fecha, idioma)
- habilitación de módulos (Sales, AR, Inventory, Supply)

---

### insight_execution_context

Define:

- contexto
- snapshot
- fecha
- cliente

Permite reproducir un mismo proceso de generación de insights.

---

### business_review_rules

Permite registrar excepciones específicas por cliente sin modificar la lógica estándar del producto.

---

## 12.3 Planned Configuration Objects

- rule_thresholds
- client_weights
- industry_weights
- severity_profiles
- ai_configuration
- scenario_configuration

Estas tablas permitirán parametrizar el comportamiento del motor de reglas y del motor de insights sin necesidad de cambios de código.

---
# 13. Operational Layer

## 13.1 Purpose

La **Operational Layer** concentra todos los componentes responsables de la ejecución del pipeline analítico.

No realiza cálculos de negocio; su función es coordinar, ejecutar, monitorear y auditar el procesamiento completo de datos desde la extracción del ERP hasta la generación de Insights consumidos por DQBot.

Esta capa constituye el puente entre la arquitectura operacional (`operation.md`) y el modelo de datos.

## 13.2 Operational Telemetry

### data_pipeline_step_log

Tabla de telemetría de ejecución. Registra automáticamente el resultado de cada función del pipeline de datos (ETL/ELT).

Propósito:
- Rastrear tiempos de ejecución y bloqueos.
- Registrar filas procesadas.
- Capturar errores de ejecución para alertas.

Todos los procedimientos de refresh (ej. `refresh_stg_sales_clean`) están instrumentados para insertar su resultado en esta tabla.

---

## 13.3 Operational Pipeline

```text
ERP

↓

Extraction

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

Priority Engine

↓

REST API

↓

DQBot
```

Cada etapa representa un punto de control auditable y reproducible.

---

## 13.3 Current MVP Operation

Actualmente el flujo operativo contempla:

- Extracción de información desde ERP.
- Carga de archivos fuente.
- Actualización de tablas RAW.
- Ejecución secuencial de funciones SQL.
- Generación de tablas productivas.
- Actualización de vistas analíticas.
- Publicación de KPIs e Insights.

El proceso actual se encuentra preparado para evolucionar hacia una orquestación completamente automatizada.

---

## 13.4 Target Operational Flow

Para el MVP productivo se contempla:

- Dos sincronizaciones diarias.
  - 05:00
  - 15:00
- Orquestación mediante n8n.
- Integración directa vía API con el ERP.
- Actualización incremental cuando el origen lo permita.
- Registro de errores y reintentos automáticos.

---

## 13.5 Operational Responsibilities

### Data Extraction

Responsable de obtener la información operacional desde el ERP.

Entradas:

- Sales
- Inventory
- Accounts Receivable
- Item Master
- BOM
- Inbound

Salida:

RAW Layer

---

### Data Validation

Verifica:

- integridad;
- formato;
- duplicados;
- registros inválidos;
- claves obligatorias.

---

### Data Processing

Ejecuta secuencialmente:

- funciones STG;
- funciones Business;
- generación de vistas;
- actualización de KPIs;
- evaluación de reglas;
- generación de insights.

---

### Monitoring

Debe registrar:

- inicio;
- fin;
- duración;
- errores;
- objetos actualizados;
- cantidad de registros.

---

## 13.6 Snapshot Strategy

Durante el MVP la plataforma mantiene snapshots consistentes del estado analítico.

Los snapshots permiten:

- reproducibilidad;
- auditoría;
- análisis histórico;
- comparación temporal.

En versiones posteriores podrán coexistir con estrategias incrementales.

---

# 14. Functions

## 14.1 Purpose

Las funciones representan el mecanismo oficial de transformación del modelo de datos.

Toda transformación persistente debe ejecutarse mediante funciones documentadas y versionadas.

---

## 14.2 Function Categories

Las funciones se agrupan en:

- STG Functions
- Business Functions
- Semantic Refresh Functions
- Snapshot Functions
- Utility Functions

---

# 14.3 STG Functions

## refresh_stg_items_master_clean()

### Purpose

Normalizar el maestro de artículos.

### Input

raw_items_master

### Output

stg_items_master_clean

### Responsibilities

- artículos activos;
- costos promedio;
- clasificación;
- flags;
- normalización.

---

## refresh_stg_sales_clean()

### Input

raw_sales

### Output

stg_sales_clean

### Responsibilities

- validación documental;
- normalización;
- preparación de ventas.

---

## refresh_stg_sales_lines_clean()

### Input

raw_sales_lines

### Output

stg_sales_lines_clean

---

## refresh_stg_inventory_clean()

### Input

raw_inventory

### Output

stg_inventory_clean

---

## refresh_stg_inventory_transactions_clean()

### Input

raw_inventory_transactions

### Output

stg_inventory_transactions_clean

---

## refresh_stg_inbound_shipments_clean()

### Input

raw_inbound_shipments

### Output

stg_inbound_shipments_clean

---

## refresh_stg_ar_open_items_clean()

### Status

Planned / Financial Domain

### Purpose

Normalizar documentos abiertos de clientes.

---

# 14.4 Business Functions

## refresh_sales_actuals()

Genera:

sales

sales_lines

Sales Semantic

---

## refresh_open_sales_order_demand()

Genera:

open_sales_order_demand

Responsable de:

- revenue pendiente;
- margen pendiente;
- demanda comercial.

---

## refresh_inventory_supply_intelligence()

Genera:

inventory_supply_semantic_current

Responsable de:

- supply disponible;
- cobertura;
- disponibilidad;
- capacidad BOM.

---

## refresh_finance_snapshots()

Genera:

finance_customer_risk_snapshot

Responsable de:

- aging;
- DSO;
- riesgo;
- score financiero.

---

# 14.5 Function Execution Sequence

```text
Items

↓

Sales

↓

Sales Lines

↓

Inventory

↓

Inventory Transactions

↓

Inbound

↓

Accounts Receivable

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
```

---

# 15. Productive Views

## 15.1 Purpose

Las vistas productivas representan el modelo analítico reutilizable por dashboards, APIs y DQBot.

Todas las vistas aquí documentadas forman parte del baseline oficial del producto.

---

# 15.2 Sales Views

## Performance

- vw_sales_actual_summary
- vw_sales_customer_performance
- vw_sales_item_performance
- vw_sales_item_cost_diagnostics
- vw_sales_top_customers_current
- vw_sales_top_products_current
- vw_sales_customer_concentration
- vw_sales_executive_summary

---

## Pipeline

- vw_sales_pipeline_vs_supply
- vw_sales_pipeline_supply_executive_summary
- vw_sales_pipeline_risk
- vw_sales_pipeline_profitability_distribution
- vw_sales_pipeline_supply_risk_customers
- vw_sales_open_demand_monthly

---

## Projection

- vw_sales_projection_current
- vw_sales_projection_alerts

---

## Executive

- vw_executive_sales_supply_alerts

---

## Insights

- vw_sales_insights

---

# 15.3 Inventory Views

- vw_inventory_items_semantic
- vw_inventory_position_semantic
- vw_inventory_rotation_semantic
- vw_inventory_coverage_semantic
- vw_inventory_inbound_semantic
- vw_inventory_bom_capacity_theoretical

---

# 15.4 Supply Views

- vw_sales_pipeline_vs_supply
- vw_sales_pipeline_supply_executive_summary

---

# 15.5 Accounts Receivable Views

Baseline previsto:

- vw_ar_aging_summary
- vw_ar_customer_risk
- vw_ar_review_documents
- vw_ar_open_items_detail

Estado:

Implementación en consolidación.

---

# 15.6 View Design Standard

Cada vista debe documentar:

- Objetivo.
- Dominio.
- Entradas.
- Salidas.
- Consumidores.
- Dependencias.
- KPIs asociados.
- Reglas consumidoras.

---

# 16. Materialized Objects

## 16.1 Purpose

Algunos objetos se materializan para mejorar rendimiento y estabilidad analítica.

Su actualización depende del pipeline operacional.

---

## 16.2 Current Materialized Business Objects

### inventory_bom_capacity_current

Objetivo:

Materializar capacidad teórica de producción.

---

### inventory_supply_semantic_current

Objetivo:

Materializar disponibilidad consolidada de supply.

---

### finance_customer_risk_snapshot

Objetivo:

Materializar riesgo financiero por cliente.

Estado:

Implementación en consolidación.

---

## 16.3 Future Materializations

Podrán incorporarse:

- Executive Snapshots
- Priority Snapshots
- Historical KPI Snapshots
- Historical Insight Snapshots

---

# 17. Dependency Maps

## 17.1 Purpose

Documentar el flujo completo de dependencias entre objetos.

---

## 17.2 Sales Dependency Map

```text
raw_sales

↓

stg_sales_clean

↓

sales

↓

sales_semantic_current

↓

Sales KPIs

↓

vw_sales_projection_current

↓

vw_sales_insights

↓

REST API

↓

DQBot
```

---

## 17.3 Pipeline Dependency Map

```text
raw_open_sales_orders

↓

open_sales_order_demand

↓

vw_sales_pipeline_vs_supply

↓

vw_sales_pipeline_supply_executive_summary

↓

vw_sales_projection_current

↓

vw_sales_insights

↓

DQBot
```

---

## 17.4 Inventory Dependency Map

```text
raw_inventory

↓

stg_inventory_clean

↓

inventory_supply_semantic_current

↓

Supply KPIs

↓

Inventory Rules

↓

Inventory Insights
```

---

## 17.5 Finance Dependency Map

```text
raw_ar_open_items

↓

stg_ar_open_items_clean

↓

finance_customer_risk_snapshot

↓

Finance KPIs

↓

Financial Rules

↓

Financial Insights
```

---

# 18. Refresh Strategy

## 18.1 Purpose

Garantizar que todas las capas permanezcan sincronizadas mediante un flujo de ejecución controlado.

---

## 18.2 Processing Sequence

```text
ERP

↓

RAW Refresh

↓

STG Refresh

↓

Business Refresh

↓

Semantic Refresh

↓

KPI Refresh

↓

Rule Evaluation

↓

Insight Generation

↓

Priority Engine

↓

REST APIs

↓

DQBot
```

---

## 18.3 MVP Schedule

Frecuencia objetivo:

- 05:00
- 15:00

Cada ejecución debe completar el pipeline antes de habilitar el consumo por APIs y DQBot.

---

## 18.4 Error Handling

Cada etapa deberá:

- validar entradas;
- registrar errores;
- detener dependencias críticas;
- permitir reintentos controlados;
- conservar trazabilidad completa.

---

## 18.5 Future Evolution

El pipeline evolucionará hacia:

- Integración API directa con ERP.
- Procesamiento incremental.
- Orquestación mediante n8n.
- Monitoreo automático.
- Alertas operacionales.
- Observabilidad completa.

---

# 19. Naming Standards

## 19.1 Purpose

El presente estándar define las convenciones oficiales de nomenclatura utilizadas en el modelo de datos de ERP Intelligence Foundation.

Su objetivo es garantizar:

- consistencia;
- mantenibilidad;
- legibilidad;
- escalabilidad;
- facilidad de incorporación de nuevos dominios;
- independencia respecto del ERP origen.

Todas las tablas, vistas, funciones y objetos futuros deberán respetar estas convenciones.

---

## 19.2 Naming Convention

| Object Type | Prefix | Example |
|-------------|--------|---------|
| Raw Tables | raw_ | raw_sales |
| Staging Tables | stg_ | stg_sales_clean |
| Business Tables | *(sin prefijo específico)* | open_sales_order_demand |
| Materialized Tables | *(nombre funcional)* | inventory_supply_semantic_current |
| Views | vw_ | vw_sales_insights |
| KPI Views | kpi_ | kpi_sales_current_month |
| Refresh Functions | refresh_ | refresh_sales_actuals |
| Configuration Tables | cfg_ *(recomendado futuro)* | cfg_rule_thresholds |
| Snapshot Tables | snapshot_ *(recomendado futuro)* | snapshot_executive_daily |

---

## 19.3 General Rules

- Utilizar únicamente inglés técnico.
- Utilizar `snake_case`.
- Evitar abreviaturas ambiguas.
- Evitar nombres dependientes del ERP.
- Nombrar según el significado de negocio.
- Mantener consistencia entre dominios.

Ejemplos correctos:

```text
inventory_supply_semantic_current

vw_sales_projection_current

refresh_inventory_supply_intelligence

finance_customer_risk_snapshot
```

---

## 19.4 Domain Prefixes

Cada dominio mantiene una taxonomía uniforme.

### Sales

```text
sales_

vw_sales_

kpi_sales_
```

### Inventory

```text
inventory_

vw_inventory_

kpi_inventory_
```

### Supply

```text
supply_

vw_supply_
```

### Accounts Receivable

```text
finance_

ar_

vw_ar_
```

### Configuration

```text
sales_settings

business_review_rules

rule_thresholds

client_weights

industry_weights
```

---

# 20. Data Governance

## 20.1 Purpose

La gobernanza de datos asegura que toda información utilizada por la plataforma sea:

- consistente;
- auditable;
- trazable;
- reproducible;
- explicable.

---

## 20.2 Governance Principles

### Single Source of Truth

Cada entidad debe poseer un único origen oficial.

Ejemplos:

- Ventas → `sales`
- Pipeline → `open_sales_order_demand`
- Supply → `inventory_supply_semantic_current`

---

### Layer Isolation

Cada capa posee una única responsabilidad.

No deben mezclarse reglas de negocio dentro de RAW o STG.

---

### Traceability

Todo KPI debe poder reconstruirse completamente.

Ejemplo:

```text
Insight

↓

Rule

↓

KPI

↓

Semantic View

↓

Business Table

↓

STG

↓

RAW

↓

ERP
```

---

### Explainability

DQBot nunca debe responder información cuya trazabilidad no pueda explicarse.

Cada Insight debe indicar:

- origen;
- regla aplicada;
- KPI utilizado;
- impacto calculado.

---

## 20.3 Versioning

Los cambios relevantes deberán documentarse mediante versiones controladas.

Cada modificación estructural deberá reflejarse en:

- database.md
- functional.md
- api.md
- kpi.md

---

# 21. Data Quality

## 21.1 Purpose

Garantizar que la información utilizada por el motor analítico sea consistente antes de generar KPIs o Insights.

---

## 21.2 Validation Levels

### RAW

Validaciones mínimas:

- archivo completo;
- columnas obligatorias;
- timestamp;
- client_id.

---

### STG

Validaciones estructurales:

- duplicados;
- formatos;
- claves;
- relaciones;
- tipos de datos.

---

### Business

Validaciones funcionales:

- revenue;
- costos;
- márgenes;
- relaciones cliente-artículo;
- integridad documental.

---

### Semantic

Validaciones analíticas:

- cobertura;
- concentraciones;
- supply;
- proyecciones;
- indicadores financieros.

---

### KPI

Cada KPI deberá validar:

- divisiones por cero;
- datos faltantes;
- períodos;
- monedas;
- consistencia temporal.

---

### Rules

Toda regla debe validar:

- disponibilidad de datos;
- umbrales;
- parámetros;
- configuraciones activas.

---

## 21.3 Current Quality Controls

Actualmente implementados:

- validación de costos promedio;
- diagnóstico de productos sin costo;
- consistencia BOM;
- validación de supply;
- validación de pipeline.

Pendientes de completar:

- validaciones financieras completas;
- validaciones automáticas de configuración;
- controles estadísticos de calidad.

---

# 22. Multi-Tenant Strategy

## 22.1 Objective

Permitir que múltiples organizaciones utilicen una única plataforma compartiendo la misma lógica estándar, manteniendo completamente aislados sus datos y configuraciones.

---

## 22.2 Current Strategy

La plataforma utiliza:

```text
client_id
```

como identificador principal de segregación.

Todos los objetos productivos deben soportar esta estrategia.

---

## 22.3 Configuration Isolation

Las configuraciones específicas deberán almacenarse independientemente de la lógica estándar.

Ejemplos:

- sales_settings
- business_review_rules
- client_weights *(planificado)*
- industry_weights *(planificado)*
- rule_thresholds *(planificado)*

---

## 22.4 Future Evolution

La arquitectura contempla:

- múltiples industrias;
- múltiples clientes;
- múltiples monedas;
- múltiples idiomas;
- múltiples ERP.

Sin modificar el motor analítico.

---

# 23. Current Coverage

## 23.1 Fully Implemented

### Master Data

- Item Master
- Cost Diagnostics

### Sales

- Sales Actuals
- Sales Pipeline
- Sales Projection
- Customer Concentration
- Product Concentration
- Executive Summary
- Sales Insights (V001–V005)

### Inventory

- Inventory Position
- Rotation
- Coverage
- Supply Availability
- BOM Capacity

### Supply

- Deliverable Revenue
- Revenue at Supply Risk
- Executive Supply Summary

---

## 23.2 Partially Implemented

### Accounts Receivable

Disponibles:

- estructura funcional;
- modelo de datos;
- pipeline previsto.

Pendiente:

- consolidación completa de KPIs;
- reglas C001–C005;
- insights financieros.

---

## 23.3 Planned

- Rule Threshold Configuration
- Client Weights
- Industry Weights
- Scenario Engine
- Predictive Analytics
- AI Configuration
- Historical Insight Repository
- Executive Priority Snapshots

---

# 24. Planned Components

## 24.1 Rule Configuration

Separar completamente:

- lógica;
- severidad;
- pesos;
- umbrales.

Permitirá modificar el comportamiento del producto sin cambios de código.

---

## 24.2 Scenario Engine

El modelo contempla incorporar escenarios determinísticos como:

### Base Scenario

Run-rate operativo.

### Supply Constraint Scenario

Proyección considerando limitaciones de abastecimiento.

### Liquidity Stress Scenario

Proyección financiera ajustada por riesgo de cobranza.

---

## 24.3 Predictive Analytics

Fases futuras:

- Forecast probabilístico.
- Machine Learning.
- Anomaly Detection.
- Demand Prediction.

---

## 24.4 AI Layer

Capas futuras:

- AI Context Builder
- Prompt Composer
- Response Validator
- Recommendation Engine
- Learning Feedback

Estas capacidades serán documentadas en `dqbot-architecture.md`.

---

# 25. Acceptance Criteria

El modelo de datos se considerará completo cuando cumpla los siguientes criterios:

- Todas las entidades estén documentadas.
- Todas las funciones posean especificación.
- Todas las vistas estén clasificadas por dominio.
- Todos los KPIs tengan trazabilidad.
- Todas las reglas documenten su heurística.
- Todos los insights indiquen origen y explicación.
- Exista consistencia total entre:
  - database.md
  - functional.md
  - api.md
  - kpi.md
  - operation.md
  - architecture.md
  - SOPs
  - dqbot-architecture.md

---

# Appendix A — Productive Object Catalog

Contendrá el inventario completo de:

- Tablas RAW
- Tablas STG
- Tablas Business
- Tablas Materializadas
- Vistas Semánticas
- KPIs
- Reglas
- Insights
- Objetos de Configuración

Clasificados por dominio y estado de implementación.

---

# Appendix B — Function Catalog

Para cada función:

- Nombre
- Dominio
- Objetivo
- Entradas
- Salidas
- Dependencias
- Orden de ejecución
- Consumidores

---

# Appendix C — Dependency Matrix

Matriz completa que relaciona:

- ERP Sources
- RAW
- STG
- Business
- Semantic
- KPIs
- Rules
- Insights
- APIs
- DQBot

Permitirá analizar el impacto de cualquier modificación estructural.

---

# Appendix D — Refresh Sequence

Secuencia oficial del procesamiento:

```text
ERP
↓

RAW Refresh

↓

STG Refresh

↓

Business Refresh

↓

Semantic Refresh

↓

KPI Refresh

↓

Rule Evaluation

↓

Insight Generation

↓

Priority Calculation

↓

REST APIs

↓

DQBot
```

Cada etapa deberá finalizar correctamente antes de habilitar la siguiente.

---

# Appendix E — Cross-Domain Reference Matrix

Mapa de dependencias entre dominios.

Ejemplos:

- Sales → Supply
- Sales → Accounts Receivable
- Inventory → Supply
- Supply → Executive KPIs
- Executive KPIs → Rules
- Rules → Insights
- Insights → DQBot

Este anexo permitirá identificar el impacto cruzado de cambios en cualquier dominio.

---

# Appendix F — Configuration Catalog

Inventario de objetos de configuración.

## Implementados

- sales_settings
- insight_execution_context
- business_review_rules

## Planificados

- rule_thresholds
- client_weights
- industry_weights
- severity_profiles
- scenario_configuration
- ai_configuration

Cada objeto deberá documentar:

- propósito;
- alcance;
- consumidor;
- frecuencia de actualización.

---

# Appendix G — Business Glossary

Este glosario centraliza la definición de los principales conceptos del producto.

Ejemplos:

- Sales Pipeline
- Deliverable Revenue
- Revenue at Supply Risk
- Inventory Coverage
- Supply Availability
- Customer Concentration
- Product Concentration
- DSO
- Collection Efficiency
- Business Rule
- Insight
- Executive Priority
- Semantic Layer
- Business Layer
- KPI Layer

Todas las definiciones deberán mantenerse alineadas con `functional.md` para asegurar una terminología consistente en toda la documentación.

---

# End of Document