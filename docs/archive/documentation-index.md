# Documentation Index

**Document:** `documentation-index.md`

**Version:** 2.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Purpose

Este documento constituye el índice oficial de documentación de **ERP Intelligence Platform**.

Su objetivo es definir:

- qué documentos existen;
- qué rol cumple cada documento;
- en qué orden deben consultarse;
- qué documentos son obligatorios para agentes, desarrolladores y herramientas automatizadas;
- cómo Antigravity debe comprender el producto antes de modificarlo.

---

# Product Mission

ERP Intelligence Platform transforma información operacional proveniente de ERP en **Executive Decision Intelligence** mediante:

- Business Data;
- Semantic Models;
- KPI Calculation;
- Configurable Business Rules;
- Heuristic Reasoning;
- Executive Dashboards;
- Conversational Intelligence.

La plataforma no reemplaza al ERP.

Interpreta, contextualiza y convierte datos operacionales en inteligencia ejecutiva accionable.

---

# Documentation Principles

Toda documentación del proyecto deberá respetar:

- Documentation First;
- Architecture First;
- Semantic First;
- API First;
- Runtime Governance;
- Traceability;
- Continuous Validation;
- Product Evolution.

---

# Canonical Reading Order

Todo agente, desarrollador o herramienta automatizada deberá consultar la documentación en este orden:

```text
README.md

↓

documentation-index.md

↓

AGENTS.md

↓

business/

↓

architecture/

↓

operating-model/

↓

agents/runtime/

↓

agents/specifications/

↓

agents/prompts/

↓

agents/platform/

↓

sop/
```

---

# Root Documentation

## README.md

Documento principal de entrada al proyecto.

Define:

- misión del producto;
- visión general;
- estructura del repositorio;
- principios de ingeniería;
- rol de Antigravity;
- estrategia de evolución del producto.

---

## documentation-index.md

Índice oficial de documentación.

Define:

- mapa documental;
- orden de lectura;
- categorías documentales;
- documentos obligatorios;
- relación entre producto, agentes y Runtime.

---

## AGENTS.md

Contrato operativo para agentes y herramientas automatizadas.

Define:

- reglas generales de trabajo;
- estructura del repositorio;
- restricciones;
- modo inicial read-only;
- Product Discovery;
- relación con Supabase;
- criterios antes de modificar archivos.

---

# Documentation Map

```text
docs/

├── README.md
├── documentation-index.md
├── AGENTS.md
│
├── business/
│
├── architecture/
│
├── operating-model/
│   ├── matrices/
│   └── standards/
│
├── agents/
│   ├── specifications/
│   ├── runtime/
│   ├── prompts/
│   └── platform/
│
└── sop/
```

---

# Business Documentation

La carpeta `business/` contiene la definición funcional del producto y constituye la referencia oficial para comprender el comportamiento esperado de la plataforma.

Toda implementación deberá alinearse con estos documentos.

---

## functional.md

Describe:

- funcionalidades del producto;
- módulos funcionales;
- procesos de negocio;
- flujos operacionales;
- comportamiento esperado.

Debe consultarse antes de implementar cualquier funcionalidad.

---

## database.md

Describe:

- modelo lógico;
- entidades de negocio;
- relaciones;
- conceptos funcionales;
- integración con la Semantic Layer.

No reemplaza la documentación técnica de Supabase.

---

## api.md

Describe:

- contratos funcionales;
- endpoints;
- consumo esperado;
- integraciones;
- flujos de información.

Debe mantenerse sincronizado con el Backend.

---

## kpi.md

Describe:

- indicadores;
- fórmulas;
- dimensiones;
- agregaciones;
- reglas de cálculo.

Todo KPI implementado deberá existir previamente en este documento.

---

## rules-engine.md

Define:

- reglas heurísticas;
- reglas configurables;
- prioridades;
- interpretación del negocio;
- criterios utilizados por DQBot.

Constituye la base del razonamiento del producto.

---

# Architecture Documentation

La carpeta `architecture/` define la arquitectura oficial de ERP Intelligence Platform.

Toda decisión técnica deberá alinearse con estos documentos.

---

## project-governance.md

Define:

- gobierno del proyecto;
- principios;
- responsabilidades;
- criterios de evolución.

---

## repository-structure.md

Define:

- organización del repositorio;
- convenciones;
- estructura física del proyecto;
- responsabilidades de cada directorio.

---

## technology-stack.md

Describe:

- tecnologías utilizadas;
- versiones;
- dependencias;
- lineamientos tecnológicos.

---

## migration-plan.md

Documenta:

- estrategia de evolución;
- migraciones;
- compatibilidad;
- transición tecnológica.

---

## infrastructure.md

Describe:

- infraestructura lógica;
- servicios externos;
- Supabase;
- despliegues;
- conectividad.

---

# Operating Model

El Operating Model define cómo trabajan los agentes de Antigravity.

No describe el producto.

Describe el funcionamiento del equipo autónomo de ingeniería.

---

## Core Documents

Incluye:

- ai-engineering-operating-model.md
- task-lifecycle.md
- process-orchestration-model.md
- communication-protocol.md
- handoff-protocol.md
- review-workflow.md
- event-catalog.md

Estos documentos definen:

- ciclo de vida de tareas;
- coordinación;
- eventos;
- comunicación;
- revisiones;
- aprobaciones.

---

## Matrices

La carpeta `operating-model/matrices/` contiene las matrices oficiales del proyecto.

Incluye:

- Agent Capability Matrix;
- Repository Permission Matrix;
- Dependency Matrix;
- Decision Authority Matrix.

Estas matrices determinan qué puede hacer cada Runtime y cada agente.

---

# Agents

La carpeta `agents/` define el comportamiento del ecosistema Antigravity.

---

## specifications/

Contiene la especificación funcional de cada agente.

Ejemplos:

- Orchestrator
- Chief Architect
- Backend
- Frontend
- Database
- DQBot
- QA
- Documentation
- Refactoring
- DevOps

Las especificaciones describen responsabilidades, capacidades y límites.

---

## runtime/

Contiene la especificación operacional de cada Runtime.

Define:

- comportamiento;
- eventos;
- estados;
- validaciones;
- criterios de aceptación;
- integración con el Operating Model.

Los Runtime constituyen la implementación lógica de los agentes.

---

## prompts/

Contiene los prompts oficiales utilizados por los agentes.

Los prompts implementan el comportamiento definido por las especificaciones y Runtime.

Nunca reemplazan la documentación.

---

## platform/

Contiene la documentación relacionada con la plataforma Antigravity.

Describe:

- Runtime Engine;
- Product Discovery;
- Product Graph;
- Product Analyzer;
- Planning Engine;
- integración con n8n;
- evolución futura de la plataforma.

---

# SOP

La carpeta `sop/` contiene procedimientos operacionales estándar.

Incluye procesos repetitivos como:

- despliegues;
- mantenimiento;
- revisiones;
- respaldo;
- recuperación;
- operación de la plataforma.

Todos los procedimientos deberán mantenerse sincronizados con el Operating Model.

---

# Product Discovery

La Product Discovery constituye la primera fase operacional de Antigravity.

Antes de ejecutar cualquier modificación sobre el producto, los agentes deberán construir una comprensión completa del sistema.

---

## Discovery Objectives

Antigravity deberá descubrir automáticamente:

- estructura del repositorio;
- módulos Backend;
- módulos Frontend;
- documentación;
- estructura de Supabase;
- APIs;
- Semantic Layer;
- KPI Engine;
- Rules Engine;
- Dashboards;
- DQBot;
- integraciones;
- dependencias.

Durante esta fase el Workspace permanecerá en modo:

```text
READ ONLY
```

---

## Product Discovery Workflow

```text
Workspace

↓

Repository Scan

↓

Documentation Scan

↓

Supabase Scan

↓

Product Inventory

↓

Knowledge Graph

↓

Product Analysis

↓

UI Analysis

↓

Health Score

↓

Planning Engine

↓

Task Generation
```

---

# Product Knowledge Graph

Antigravity deberá construir un grafo unificado del producto.

Ejemplo:

```text
Executive Dashboard

↓

React Component

↓

REST API

↓

Backend Service

↓

Repository

↓

Supabase View

↓

Business Rule

↓

KPI

↓

Semantic Definition

↓

Documentation
```

Este grafo constituye el contexto utilizado por todos los agentes durante la ejecución de tareas.

---

# Product Analysis

Una vez construido el Product Graph, Antigravity deberá identificar automáticamente:

## Backend

- módulos incompletos;
- endpoints sin utilizar;
- servicios huérfanos;
- deuda técnica;
- inconsistencias.

---

## Frontend

- dashboards incompletos;
- componentes duplicados;
- rutas sin implementar;
- problemas de navegación;
- inconsistencias visuales.

---

## Database

- tablas sin utilizar;
- vistas no consumidas;
- RPC sin uso;
- índices faltantes;
- oportunidades de optimización.

---

## Business Layer

- KPIs faltantes;
- reglas sin implementar;
- Semantic Layer incompleta;
- inconsistencias funcionales.

---

## Documentation

- documentos faltantes;
- referencias rotas;
- inconsistencias;
- documentación desactualizada.

---

# UI / UX Analysis

Antigravity deberá analizar automáticamente:

- Layout;
- Responsive Design;
- Typography;
- Color System;
- Component Consistency;
- Navigation;
- Accessibility;
- Visual Hierarchy;
- Loading States;
- Empty States;
- Dashboard Consistency.

---

# Product Health Score

Toda ejecución del Product Analyzer deberá generar un indicador consolidado del estado del producto.

Ejemplo:

```text
Backend....................96%

Frontend...................74%

Supabase...................98%

Documentation..............84%

Semantic Layer.............93%

Rules Engine...............95%

KPI Engine.................91%

DQBot......................78%

UI / UX....................69%

Responsive.................63%

Accessibility..............58%

Performance................89%

Testing....................46%
```

Este indicador constituye la referencia oficial para medir la evolución del producto.

---

# Planning Engine

El Planning Engine transforma automáticamente los hallazgos del Product Analyzer en un plan de ejecución.

Responsabilidades:

- priorizar;
- agrupar dependencias;
- generar tareas;
- ordenar ejecución;
- minimizar riesgos;
- maximizar impacto.

El Orchestrator Runtime ejecutará únicamente tareas generadas por el Planning Engine.

---

# Specialized Agents

Una vez generado el plan, las tareas serán distribuidas a:

- Orchestrator Runtime;
- Chief Architect Runtime;
- Backend Runtime;
- Frontend Runtime;
- Database Runtime;
- DQBot Runtime;
- QA Runtime;
- Documentation Runtime;
- Refactoring Runtime;
- DevOps Runtime.

Todos los agentes deberán utilizar el mismo contexto generado durante la fase de Product Discovery.

---

# Documentation Governance

Toda modificación realizada sobre el producto deberá:

- actualizar la documentación correspondiente;
- mantener sincronizados README.md, AGENTS.md y documentation-index.md;
- respetar el Operating Model;
- respetar las Runtime Specifications;
- preservar la trazabilidad.

---

# Continuous Product Evolution

ERP Intelligence Platform adopta un modelo de evolución continua.

```text
Product Discovery

↓

Knowledge Graph

↓

Product Analyzer

↓

Planning Engine

↓

Orchestrator Runtime

↓

Specialized Agents

↓

QA

↓

Documentation

↓

Product Health Score

↓

Replanning

↓

Continuous Improvement
```

Este ciclo constituye el mecanismo oficial para evolucionar el producto hasta alcanzar y mantener un estado **Production Ready**.

---

# End of Document