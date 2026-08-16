# Rules Engine Specification

**Document:** `rules-engine.md`  
**Version:** 1.0  
**Status:** Productive Baseline  
**Owner:** ERP Intelligence Foundation

---

# 1. Purpose

El **Rules Engine** constituye el núcleo de inteligencia del producto.

Su responsabilidad es transformar KPIs y métricas operacionales en diagnósticos ejecutivos accionables mediante un conjunto de reglas heurísticas estandarizadas.

A diferencia de un motor de alertas tradicional, el Rules Engine:

- interpreta el estado del negocio;
- evalúa relaciones entre dominios;
- asigna severidad;
- prioriza impactos;
- genera Insights explicables;
- alimenta DQBot y Executive Dashboard.

No realiza cálculos de KPIs. Consume únicamente indicadores previamente consolidados.

---

# 2. Scope

El motor de reglas cubre los dominios funcionales del producto:

```text
Sales

Inventory

Supply

Accounts Receivable

Executive Health
```

Cada dominio posee un conjunto de reglas independientes, pero todas siguen el mismo modelo de evaluación.

---

# 3. Architectural Position

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

KPI Layer

↓

Rules Engine

↓

Insight Engine

↓

Priority Engine

↓

REST API

↓

DQBot
```

El Rules Engine nunca consume:

- tablas RAW;
- tablas STG;
- información del ERP.

Su única entrada válida son KPIs y vistas analíticas documentadas en `database.md`.

---

# 4. Objectives

El motor debe ser capaz de:

- Detectar desviaciones relevantes.
- Evaluar severidad.
- Priorizar riesgos.
- Recomendar acciones.
- Explicar cada diagnóstico.
- Mantener comportamiento consistente entre clientes.
- Permitir parametrización sin modificar código.

---

# 5. Rule Lifecycle

Cada regla sigue el siguiente ciclo:

```text
KPIs

↓

Threshold Evaluation

↓

Severity Calculation

↓

Business Impact

↓

Recommended Action

↓

Insight

↓

Priority Score
```

---

# 6. Rule Structure

Todas las reglas deben implementar la siguiente estructura lógica.

| Campo | Descripción |
|--------|-------------|
| Rule ID | Identificador único |
| Domain | Dominio funcional |
| Objective | Problema que detecta |
| Input KPIs | Indicadores utilizados |
| Evaluation Logic | Heurística de evaluación |
| Severity | LOW / MEDIUM / HIGH / CRITICAL |
| Severity Score | Valor numérico |
| Business Impact | Impacto cuantificado |
| Recommended Action | Acción sugerida |
| Detail Payload | Contexto adicional |
| Explainability | Explicación para el usuario |

---

# 7. Rule Classification

Las reglas se agrupan por dominio.

## Sales

```text
V001
V002
V003
V004
V005
```

---

## Inventory

```text
I001
I002
I003
I004
I005
```

---

## Accounts Receivable

```text
C001
C002
C003
C004
C005
```

---

## Executive

Reservado para reglas transversales que combinen múltiples dominios.

```text
E001...
```

Estado:

```text
Planned
```

---

# 8. Rule Inputs

Cada regla consume exclusivamente:

- KPIs oficiales.
- Vistas semánticas.
- Configuración del cliente.
- Configuración de industria.

Nunca debe consumir tablas operacionales directamente.

---

# 9. Rule Outputs

Cada evaluación genera:

```text
Severity

↓

Severity Score

↓

Impact Value

↓

Recommended Action

↓

Insight

↓

Priority Score
```

Este resultado constituye la entrada del Insight Engine.

---

# 10. Rule Configuration

El comportamiento del motor no debe depender de valores codificados.

Toda configuración debe almacenarse mediante tablas parametrizables.

Configuraciones previstas:

- Umbrales.
- Pesos.
- Tolerancias.
- Severidad.
- Reglas habilitadas.
- Configuración por cliente.
- Configuración por industria.

---

# 11. Severity Model

Todas las reglas utilizarán la misma clasificación estándar.

| Nivel | Score |
|--------|------:|
| OK | 0 |
| LOW | 1 |
| MEDIUM | 2 |
| HIGH | 3 |
| CRITICAL | 4 |

Este modelo será utilizado por:

- Dashboard Ejecutivo.
- Priority Engine.
- DQBot.
- APIs.

---

# 12. Explainability

Toda regla debe poder responder explícitamente:

- ¿Qué ocurrió?
- ¿Qué KPI provocó el resultado?
- ¿Cuál fue el umbral superado?
- ¿Cuál es el impacto esperado?
- ¿Qué acción se recomienda?

Este principio garantiza que el motor sea completamente explicable para usuarios ejecutivos.

---

# 13. Sales Rules (V-Series)

## 13.1 Overview

Las reglas del dominio **Sales** evalúan el desempeño comercial respecto a objetivos, tendencias, concentración y capacidad de generación de ingresos.

Estas reglas consumen exclusivamente KPIs y vistas analíticas documentadas en `database.md`.

---

# V001 — Forecast Achievement Risk

## Objective

Detectar riesgo de incumplimiento de la meta mensual.

---

### Business Question

> ¿Llegaremos a cumplir la meta de ventas del período?

---

### Input KPIs

```text
Projected Revenue Current

Monthly Target

Forecast Tolerance
```

---

### Main Sources

```text
vw_sales_projection_current

sales_settings

kpi_sales_forecast_monthly
```

---

### Evaluation Logic

```text
Projected Revenue

↓

Comparar contra

↓

Monthly Target

↓

Aplicar tolerancia

↓

Asignar severidad
```

Ejemplo heurístico:

```text
Projected Revenue < Monthly Target × 0.89

↓

HIGH
```

---

### Severity

| Condition | Severity |
|------------|----------|
| >=100% | OK |
| 99–95% | LOW |
| 94–90% | MEDIUM |
| <89% | HIGH |

---

### Business Impact

- Riesgo de incumplimiento comercial.
- Menor generación de ingresos.
- Posible desviación del presupuesto.

---

### Recommended Action

- Priorizar oportunidades cercanas al cierre.
- Revisar pipeline comprometido.
- Validar restricciones de supply.

---

# V002 — Forecast Deviation

## Objective

Comparar ventas reales contra forecast.

---

### Input KPIs

```text
Actual Sales

Forecast Monthly
```

---

### Evaluation

```text
Actual Sales

↓

Forecast

↓

Desviación %
```

---

### Severity

| Deviation | Severity |
|------------|----------|
| > -3% | OK |
| -3% | LOW |
| -7% | MEDIUM |
| < -10% | HIGH |

---

### Business Impact

Desviación respecto a la planificación comercial.

---

### Recommended Action

Analizar causas de la desviación.

---

# V003 — Commercial Trend

## Objective

Evaluar desaceleración de ventas respecto al período anterior.

---

### Input KPIs

```text
Current Month Sales

Previous Month Sales
```

---

### Evaluation

```text
MoM Growth

↓

Threshold

↓

Severity
```

---

### Severity

| MoM | Severity |
|------|----------|
| Positive | OK |
| -3% | LOW |
| -7% | MEDIUM |
| -10% | HIGH |

---

### Business Impact

Pérdida de ritmo comercial.

---

### Recommended Action

Analizar drivers comerciales y estacionalidad.

---

# V004 — Customer Concentration

## Objective

Detectar dependencia excesiva de clientes.

---

### Input KPIs

```text
Top10 Participation %
```

---

### Evaluation

```text
Top10 Sales

↓

Total Sales

↓

Participation %
```

---

### Severity

| Participation | Severity |
|---------------|----------|
| <40% | OK |
| 40–55% | LOW |
| 55–70% | MEDIUM |
| >70% | HIGH |

---

### Business Impact

Alto riesgo por concentración.

---

### Recommended Action

Diversificar cartera.

---

# V005 — Product Concentration

## Objective

Medir dependencia de pocos productos.

---

### Input KPIs

```text
Top Products Sales

Current Sales
```

---

### Evaluation

```text
Top Products

↓

Current Sales

↓

Participation %
```

---

### Severity

| Participation | Severity |
|---------------|----------|
| <40% | OK |
| 40–55% | LOW |
| 55–70% | MEDIUM |
| >70% | HIGH |

---

### Business Impact

Dependencia estructural del portafolio.

---

### Recommended Action

Evaluar diversificación y disponibilidad de inventario.

---

# 14. Rule Dependency Matrix

| Rule | KPIs | Views | Configuration |
|------|------|-------|---------------|
| V001 | Projected Revenue | vw_sales_projection_current | sales_settings |
| V002 | Forecast | kpi_sales_forecast_monthly | sales_settings |
| V003 | Monthly Sales | kpi_sales_current_month / previous_month | Global Thresholds |
| V004 | Customer Concentration | vw_sales_customer_concentration | Industry Thresholds |
| V005 | Product Concentration | vw_sales_top_products_current | Industry Thresholds |

---

# 15. Explainability Model

Cada regla del dominio Sales debe generar una explicación estructurada.

Ejemplo para V001:

**Pregunta ejecutiva**

> ¿Por qué aparece este Insight?

**Respuesta**

- La proyección del mes es inferior a la meta configurada.
- El umbral de tolerancia fue superado.
- Existe riesgo de incumplimiento comercial.
- Se recomienda acelerar oportunidades próximas al cierre y revisar restricciones de supply.

Esta estructura será reutilizada por:

- Executive Dashboard
- REST API
- DQBot
- Executive Reports

---

# 16. Inventory & Supply Rules (I-Series)

## 16.1 Overview

Las reglas del dominio **Inventory & Supply** tienen como objetivo evaluar la capacidad operacional de la empresa para sostener la demanda comercial utilizando el inventario disponible, la rotación, el abastecimiento y la capacidad de producción.

Estas reglas consumen exclusivamente objetos pertenecientes a la capa semántica y de KPIs documentados en `database.md`.

---

# I001 — Critical Inventory Coverage

## Objective

Detectar productos cuyo inventario disponible representa un riesgo inmediato para la continuidad operacional.

---

### Business Question

> ¿Qué productos pueden provocar quiebres de stock en el corto plazo?

---

### Input KPIs

```text
Stock Available

Average Monthly Demand

Coverage Months
```

---

### Source Objects

```text
vw_inventory_position_semantic

vw_inventory_coverage_semantic
```

---

### Evaluation Logic

```text
Coverage Months

↓

Compare Threshold

↓

Assign Severity
```

---

### Suggested Thresholds

| Coverage | Severity |
|-----------|----------|
| ≥ 3 months | OK |
| 2 – 3 months | LOW |
| 1 – 2 months | MEDIUM |
| < 1 month | HIGH |

---

### Business Impact

- Riesgo de quiebre de stock.
- Ventas potencialmente perdidas.
- Mayor presión sobre compras.

---

### Recommended Action

- Revisar órdenes de compra.
- Priorizar abastecimiento.
- Validar consumo esperado.

---

# I002 — Low Inventory Rotation

## Objective

Detectar inventario con baja utilización.

---

### Business Question

> ¿Qué inventario está inmovilizando capital?

---

### Input KPIs

```text
Monthly Consumption

Inventory Rotation

Coverage Months
```

---

### Source Objects

```text
vw_inventory_rotation_semantic

vw_inventory_coverage_semantic
```

---

### Evaluation Logic

```text
Coverage

AND

Low Rotation

↓

Inventory Immobilization
```

---

### Suggested Thresholds

| Rotation | Severity |
|-----------|----------|
| Normal | OK |
| Slightly Low | LOW |
| Low | MEDIUM |
| Very Low | HIGH |

---

### Business Impact

- Capital inmovilizado.
- Baja rotación.
- Sobre stock.

---

### Recommended Action

- Revisar política de compras.
- Evaluar promociones.
- Analizar obsolescencia.

---

# I003 — Supply Capacity Risk

## Objective

Determinar el impacto del abastecimiento sobre el pipeline comercial.

---

### Business Question

> ¿Qué porcentaje del pipeline puede entregarse?

---

### Input KPIs

```text
Deliverable Revenue

Revenue at Supply Risk

Supply Coverage

Pipeline Revenue
```

---

### Source Objects

```text
inventory_supply_semantic_current

vw_sales_pipeline_vs_supply

vw_sales_pipeline_supply_executive_summary
```

---

### Evaluation Logic

```text
Pipeline

↓

Supply Capacity

↓

Deliverable Revenue

↓

Revenue at Risk

↓

Severity
```

---

### Suggested Thresholds

| Revenue at Risk | Severity |
|-----------------|----------|
| 0% | OK |
| <10% | LOW |
| 10–25% | MEDIUM |
| >25% | HIGH |

---

### Business Impact

- Incumplimiento de entregas.
- Pérdida de ingresos.
- Riesgo reputacional.

---

### Recommended Action

- Priorizar abastecimiento.
- Reprogramar pedidos.
- Validar disponibilidad por cliente.

---

# I004 — BOM Capacity Constraint

## Objective

Identificar limitaciones productivas derivadas de componentes críticos.

---

### Business Question

> ¿La capacidad de producción soporta la demanda actual?

---

### Input KPIs

```text
Theoretical BOM Capacity

Supply Available

Component Availability
```

---

### Source Objects

```text
inventory_bom_capacity_current

inventory_supply_semantic_current
```

---

### Evaluation Logic

```text
Component Availability

↓

Assembly Capacity

↓

Demand

↓

Severity
```

---

### Suggested Thresholds

| Capacity | Severity |
|----------|----------|
| Meets Demand | OK |
| Slight Constraint | LOW |
| Moderate Constraint | MEDIUM |
| Critical Constraint | HIGH |

---

### Business Impact

- Limitación de producción.
- Retrasos en fabricación.
- Afectación del pipeline.

---

### Recommended Action

- Priorizar componentes críticos.
- Ajustar planificación.
- Revisar compras.

---

# I005 — Inventory Data Quality

## Objective

Detectar problemas de calidad de datos que impactan el cálculo de KPIs.

---

### Business Question

> ¿Los indicadores pueden calcularse con información confiable?

---

### Input KPIs

```text
Missing Average Cost

Missing Master Data

Inactive Items

Invalid BOM
```

---

### Source Objects

```text
vw_item_master_cost_quality_alerts

vw_sales_item_cost_diagnostics

stg_items_master_clean
```

---

### Evaluation Logic

```text
Quality Alerts

↓

Impact Analysis

↓

Severity
```

---

### Suggested Thresholds

| Affected Revenue | Severity |
|------------------|----------|
| None | OK |
| Low | LOW |
| Medium | MEDIUM |
| High | HIGH |

---

### Business Impact

- KPIs distorsionados.
- Márgenes incorrectos.
- Decisiones ejecutivas afectadas.

---

### Recommended Action

- Corregir maestros.
- Validar costos.
- Ejecutar controles de calidad.

---

# 17. Inventory & Supply Rule Dependency Matrix

| Rule | KPIs | Views | Configuration |
|------|------|-------|---------------|
| I001 | Coverage Months | vw_inventory_coverage_semantic | Global Thresholds |
| I002 | Rotation Rate | vw_inventory_rotation_semantic | Industry Thresholds |
| I003 | Revenue at Risk | vw_sales_pipeline_vs_supply | Client Thresholds |
| I004 | BOM Capacity | inventory_bom_capacity_current | Supply Configuration |
| I005 | Data Quality KPIs | vw_item_master_cost_quality_alerts | Quality Policies |

---

# 18. Cross-Domain Relationships

Las reglas de Inventory & Supply no operan de forma aislada.

Su evaluación alimenta directamente otros dominios:

```text
Inventory

↓

Supply

↓

Sales Projection

↓

Executive KPIs

↓

Rules Engine

↓

Insight Engine

↓

Priority Engine
```

Ejemplos:

- Una cobertura crítica (**I001**) incrementa el riesgo evaluado por **V001** (Forecast Achievement Risk).
- Una restricción de capacidad (**I004**) modifica la proyección de ingresos entregables.
- Problemas de calidad (**I005**) reducen la confiabilidad de KPIs de ventas e inventario.

---

# 19. Explainability Model

Cada regla del dominio Inventory & Supply debe generar una explicación estructurada.

Ejemplo para **I003**:

**Pregunta ejecutiva**

> ¿Por qué existe riesgo de supply?

**Respuesta**

- El pipeline comercial supera la capacidad actual de abastecimiento.
- Un porcentaje del revenue no puede ser entregado con el inventario y abastecimiento disponible.
- La proyección de ingresos se verá afectada si no se ejecutan acciones correctivas.
- Se recomienda priorizar abastecimiento, revisar órdenes abiertas y ajustar la planificación comercial.

Esta estructura será reutilizada por:

- Executive Dashboard
- REST API
- DQBot
- Executive Reports

---

# 20. Accounts Receivable Rules (C-Series)

## 20.1 Overview

Las reglas del dominio **Accounts Receivable (AR)** evalúan la salud financiera del proceso de cobranza y su impacto sobre la liquidez del negocio.

A diferencia de las reglas comerciales, estas reglas buscan anticipar riesgos de flujo de caja, deterioro de cartera y concentración financiera.

Este dominio se encuentra **parcialmente implementado**. La arquitectura, el modelo de datos y las reglas quedan definidos en este documento para guiar el desarrollo posterior.

---

# C001 — Overdue Receivables Risk

## Objective

Detectar crecimiento anormal de documentos vencidos.

---

### Business Question

> ¿Está aumentando el saldo vencido de clientes?

---

### Input KPIs

```text
Open Balance

Overdue Balance

Overdue %

Current Balance
```

---

### Planned Source Objects

```text
finance_ar_snapshot_daily

vw_ar_aging_summary
```

---

### Evaluation Logic

```text
Overdue Balance

↓

Open Balance

↓

Overdue %

↓

Severity
```

---

### Suggested Thresholds

| Overdue % | Severity |
|------------|----------|
| <15% | OK |
| 15–25% | LOW |
| 25–40% | MEDIUM |
| >40% | HIGH |

---

### Business Impact

- Deterioro del flujo de caja.
- Incremento del riesgo financiero.
- Mayor necesidad de capital de trabajo.

---

### Recommended Action

- Priorizar gestión de cobranza.
- Revisar clientes críticos.
- Escalar documentos vencidos.

---

# C002 — DSO Deterioration

## Objective

Detectar deterioro del Days Sales Outstanding.

---

### Business Question

> ¿Está aumentando el tiempo promedio de cobranza?

---

### Input KPIs

```text
Current DSO

Previous DSO

Collection Efficiency
```

---

### Planned Sources

```text
vw_ar_dso

vw_collection_efficiency
```

---

### Evaluation Logic

```text
Current DSO

↓

Previous DSO

↓

Variation

↓

Severity
```

---

### Suggested Thresholds

| DSO Variation | Severity |
|---------------|----------|
| Stable | OK |
| +5% | LOW |
| +10% | MEDIUM |
| +20% | HIGH |

---

### Business Impact

- Menor liquidez.
- Mayor financiamiento operativo.
- Riesgo de incobrabilidad.

---

### Recommended Action

- Revisar políticas de crédito.
- Intensificar seguimiento.
- Analizar clientes con mayor atraso.

---

# C003 — Customer Credit Risk

## Objective

Detectar clientes con riesgo financiero elevado.

---

### Business Question

> ¿Qué clientes representan el mayor riesgo de cobranza?

---

### Planned Inputs

```text
Risk Score

Open Balance

Historical Delays

Credit Limit
```

---

### Planned Sources

```text
finance_customer_risk_snapshot
```

---

### Severity

| Risk Score | Severity |
|------------|----------|
| Bajo | OK |
| Medio | LOW |
| Alto | MEDIUM |
| Muy Alto | HIGH |

---

### Business Impact

- Riesgo de incobrabilidad.
- Incremento de provisiones.
- Exposición financiera.

---

### Recommended Action

- Revisar condiciones comerciales.
- Ajustar límites de crédito.
- Intensificar monitoreo.

---

# C004 — Collection Efficiency

## Objective

Evaluar la eficiencia del proceso de cobranza.

---

### Business Question

> ¿Qué porcentaje de la cartera se está recuperando oportunamente?

---

### Planned Inputs

```text
Collection Efficiency %

Collected Amount

Expected Collections
```

---

### Planned Sources

```text
vw_collection_efficiency
```

---

### Suggested Thresholds

| Efficiency | Severity |
|-------------|----------|
| >95% | OK |
| 90–95% | LOW |
| 80–90% | MEDIUM |
| <80% | HIGH |

---

### Business Impact

- Menor disponibilidad de caja.
- Incremento del riesgo financiero.

---

### Recommended Action

- Optimizar gestión de cobranzas.
- Revisar procedimientos de seguimiento.

---

# C005 — Customer Concentration Exposure

## Objective

Evaluar el riesgo financiero por concentración de cuentas por cobrar.

---

### Business Question

> ¿Existe dependencia financiera de pocos clientes?

---

### Planned Inputs

```text
Top Customers AR

Total AR

Customer Participation
```

---

### Planned Sources

```text
finance_customer_risk_snapshot

vw_ar_customer_exposure
```

---

### Suggested Thresholds

| Participation | Severity |
|---------------|----------|
| <30% | OK |
| 30–45% | LOW |
| 45–60% | MEDIUM |
| >60% | HIGH |

---

### Business Impact

- Riesgo elevado ante incumplimiento de pocos clientes.
- Exposición financiera estructural.

---

### Recommended Action

- Diversificar cartera.
- Revisar políticas comerciales.
- Monitorear clientes estratégicos.

---

# 21. Accounts Receivable Rule Dependency Matrix

| Rule | Planned KPIs | Planned Views | Configuration |
|------|--------------|---------------|---------------|
| C001 | Overdue % | vw_ar_aging_summary | Global Thresholds |
| C002 | DSO | vw_ar_dso | Client Thresholds |
| C003 | Customer Risk | finance_customer_risk_snapshot | Risk Policies |
| C004 | Collection Efficiency | vw_collection_efficiency | Collection Policies |
| C005 | Customer Exposure | vw_ar_customer_exposure | Industry Thresholds |

---

# 22. Client & Industry Configuration Model

Todas las reglas del producto deberán poder parametrizarse sin modificar código.

El motor soporta tres niveles de configuración:

```text
Global

↓

Industry

↓

Client
```

La evaluación siempre utilizará la configuración más específica disponible.

---

## Configuration Hierarchy

```text
Default Product

↓

Industry Profile

↓

Client Profile
```

---

## Supported Configuration Parameters

Cada regla podrá parametrizar:

- Umbrales de evaluación.
- Pesos de severidad.
- Factor de impacto.
- Activación o desactivación.
- Acciones recomendadas.
- Prioridad ejecutiva.

---

## Planned Configuration Tables

### Rule Thresholds

Contendrá los valores de referencia por dominio y regla.

Ejemplos:

```text
rule_id

industry_id

warning_threshold

critical_threshold

weight
```

---

### Client Rule Configuration

Permitirá sobrescribir la configuración estándar para un cliente específico.

Ejemplos:

```text
client_id

rule_id

severity_weight

enabled

custom_threshold

custom_action
```

---

## Evaluation Priority

```text
Client Configuration

↓

Industry Configuration

↓

Global Configuration
```

---

## Design Principles

- Sin lógica hardcodeada.
- Todas las reglas parametrizables.
- Cambios sin despliegues de software.
- Auditoría completa de configuraciones.
- Compatibilidad con futuras interfaces administrativas.

---

# 23. Current Implementation Status

| Domain | Status |
|----------|--------|
| Sales Rules | Complete |
| Inventory Rules | Complete |
| Supply Rules | Complete |
| Accounts Receivable Rules | Architecture Defined / Pending Full Implementation |
| Executive Rules | Planned |

---
# 24. Executive Rules (E-Series)

## 24.1 Overview

Las **Executive Rules** representan el nivel más alto del motor de inteligencia.

A diferencia de las reglas de dominio (Sales, Inventory, Supply o AR), las Executive Rules combinan múltiples dominios para evaluar el estado integral del negocio.

Estas reglas no generan nuevos KPIs; consumen únicamente resultados provenientes de:

- KPI Layer
- Rules Engine
- Insight Engine

Su salida constituye la base del **Executive Dashboard**, **Priority Engine** y **DQBot**.

---

# E001 — Business Health

## Objective

Evaluar el estado general de la organización considerando simultáneamente:

- Ventas
- Inventario
- Supply
- Cobranzas

---

### Business Question

> ¿Cuál es la salud general del negocio?

---

### Inputs

```text
Sales Score

Inventory Score

Supply Score

AR Score
```

---

### Evaluation Logic

La salud del negocio se calcula a través de un promedio ponderado de los scores de cada dominio (cada uno valuado de 0 a 100):

```text
Business Health Score = 
  (Sales Score * 0.40) + 
  (Inventory Score * 0.20) + 
  (Supply Score * 0.20) + 
  (AR Score * 0.20)
```

---

### Output

El puntaje final determina el estado de salud y la prioridad de intervención ejecutiva:

```text
Healthy (80 - 100)
Operación normal.

Attention (60 - 79)
Rendimiento subóptimo en uno o más dominios.

At Risk (40 - 59)
Problemas operativos. Requiere intervención gerencial.

Critical (0 - 39)
Falla inminente o actual. Acción inmediata requerida.
```

---

# E002 — Cross-Domain Critical Risk

## Objective

Detectar situaciones donde múltiples dominios presentan problemas simultáneamente.

---

### Evaluation Logic

La regla evalúa la concurrencia de alertas críticas provenientes de los motores de reglas de cada dominio individual.

```text
Critical Alert Trigger = 
  IF (Sales Risk Score > 80) AND (Supply Risk Score > 80)
  OR
  IF (AR Customer Risk > 80) AND (Sales Risk Score > 80)
  OR
  IF (Inventory Rotation < 1) AND (Supply Cover < 30)
```

---

### Business Impact

Genera un **Cross-Domain Executive Alert**. Este evento interrumpe el dashboard normal para reportar un problema sistémico que requiere atención inmediata e intervención interdisciplinaria (ej. Ventas + Finanzas).

---

# E003 — Strategic Priority Detection

## Objective

Identificar automáticamente la prioridad ejecutiva más importante del momento.

---

### Evaluation Logic

La regla evalúa todos los Insights activos generados por el Priority Engine y calcula un puntaje ponderado de prioridad basado en impacto financiero, urgencia temporal y riesgo estructural:

```text
Priority Score = 
  (Estimated Financial Impact Score * 0.50) + 
  (Time Urgency Score * 0.30) + 
  (Structural Risk Score * 0.20)
```

El Insight activo con el `Priority Score` más alto se selecciona automáticamente.

---

### Output

Genera un **Top Executive Priority**. Este output instruye a DQBot y al Dashboard sobre cuál es el enfoque número uno que la gerencia debe abordar en el momento actual, presentando el insight priorizado y la acción sugerida.

---

# E004 — Operational Stability

## Objective

Determinar si la operación mantiene un comportamiento estable.

---

### Inputs

```text
Sales Trend

Inventory Stability

Supply Coverage

Collection Stability
```

---

### Output

```text
Stable

Minor Variations

Unstable

Critical
```

---

# 25. Priority Engine

## Purpose

El Priority Engine ordena los Insights generados por el Rules Engine para presentar primero aquellos con mayor impacto sobre el negocio.

No genera nuevas reglas.

Su responsabilidad consiste únicamente en priorizar.

---

## Processing Flow

```text
Rules

↓

Insights

↓

Priority Score

↓

Executive Queue

↓

Dashboard

DQBot

API
```

---

## Priority Score Components

Cada Insight puede ponderarse mediante:

| Factor | Description |
|---------|-------------|
| Severity Score | Severidad de la regla |
| Business Impact | Impacto económico |
| Domain Weight | Peso estratégico del dominio |
| Client Weight | Peso específico del cliente |
| Industry Weight | Peso específico de la industria |
| Trend Factor | Persistencia o recurrencia |
| Confidence | Calidad de la información |

---

## Suggested Formula

```text
Priority Score =

Severity

×

Impact Weight

×

Domain Weight

×

Client Weight

×

Industry Weight

×

Confidence
```

La fórmula exacta deberá permanecer parametrizable.

---

# 26. Insight Generation Pipeline

## Processing Sequence

```text
KPIs

↓

Rules

↓

Severity

↓

Business Impact

↓

Recommended Action

↓

Insight

↓

Priority

↓

Executive Dashboard

↓

REST API

↓

DQBot
```

---

## Insight Structure

Cada Insight debe contener como mínimo:

| Field | Description |
|--------|-------------|
| Rule ID | Regla que lo originó |
| Domain | Dominio funcional |
| Severity | Nivel de severidad |
| Severity Score | Valor numérico |
| Business Impact | Impacto cuantificado |
| Recommended Action | Acción sugerida |
| Detail Payload | Evidencia |
| Generated At | Fecha de generación |

---

# 27. Explainable Intelligence

Uno de los principios fundamentales del producto es la **explicabilidad**.

Todo Insight debe responder cinco preguntas:

1. ¿Qué ocurrió?
2. ¿Por qué ocurrió?
3. ¿Qué indicadores provocaron el resultado?
4. ¿Cuál es el impacto esperado?
5. ¿Qué acción debería ejecutarse?

---

## Explainability Payload

Ejemplo:

```json
{
  "rule_id": "V001",
  "why": "Projected revenue is below monthly target.",
  "trigger_kpi": "projected_revenue_current",
  "threshold": "89%",
  "impact": "Revenue gap",
  "recommended_action": "Prioritize opportunities close to closing."
}
```

---

# 28. DQBot Integration

DQBot nunca ejecuta reglas directamente.

Su flujo será:

```text
User Question

↓

Intent Detection

↓

Context Builder

↓

Insights

↓

Priority Queue

↓

Natural Language Generation
```

DQBot consume únicamente:

- Executive Summaries
- Insights
- Priority Queue
- Configuración del cliente
- Configuración de industria

---

# 29. Rule Traceability

Cada regla debe mantener trazabilidad completa.

```text
Rule

↓

KPI

↓

View

↓

Business Object

↓

API Endpoint

↓

Dashboard Widget

↓

DQBot Response
```

Esto garantiza auditoría completa y facilita el mantenimiento del producto.

---

# 30. Governance Principles

El motor de reglas debe cumplir los siguientes principios:

- Sin lógica hardcodeada específica por cliente.
- Configuración desacoplada del código.
- Versionamiento de reglas.
- Auditoría de cambios.
- Compatibilidad entre versiones.
- Explicabilidad obligatoria.
- Reutilización entre clientes.

---

# 31. Development Roadmap

## MVP

- Sales Rules
- Inventory Rules
- Supply Rules
- Priority Engine básico

---

## Next Release

- AR Rules completas
- Executive Rules
- Administración de reglas
- Versionado de configuraciones

---

## Future Evolution

- Simulación de escenarios.
- Machine Learning Assisted Rules.
- Auto-calibración de umbrales.
- Optimización basada en comportamiento histórico.
- Explainable AI avanzada.

---

# 32. Acceptance Criteria

El Rules Engine se considera completo cuando:

- Todas las reglas están documentadas.
- Existe trazabilidad Rule → KPI → View → API.
- Todas las reglas son parametrizables.
- La configuración soporta niveles Global, Industria y Cliente.
- La severidad utiliza un modelo unificado.
- El Priority Engine ordena los Insights de forma consistente.
- DQBot consume exclusivamente información generada por el motor.
- Los documentos `functional.md`, `database.md`, `kpi.md`, `api.md` y `rules-engine.md` permanecen sincronizados.

---

# Appendix A — Rule Coverage Matrix

| Domain | Rule Prefix | Status |
|---------|-------------|--------|
| Sales | Vxxx | Complete |
| Inventory | Ixxx | Complete |
| Supply | Ixxx | Complete |
| Accounts Receivable | Cxxx | Architecture Defined |
| Executive | Exxx | Planned |

---

# Appendix B — Engine Architecture

```text
ERP
        │
        ▼
RAW
        │
        ▼
STG
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
Rules Engine
        │
        ▼
Insight Engine
        │
        ▼
Priority Engine
        │
        ▼
REST API
        │
        ├────────► Executive Dashboard
        │
        ├────────► DQBot
        │
        └────────► External Integrations
```

---

# Appendix C — Related Documentation

Este documento depende directamente de:

- `functional.md`
- `database.md`
- `kpi.md`
- `api.md`

Y complementa:

- `architecture.md`
- `operation.md`
- `technology-stack.md`
- `dqbot-architecture.md`
- `sop_sales_intelligence.md`
- `sop_inventory_supply_intelligence.md`
- `sop_ar_intelligence.md`

---

# End of Document