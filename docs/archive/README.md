# ERP Intelligence Platform

Enterprise Executive Decision Intelligence Platform

**Version:** 2.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Overview

ERP Intelligence Platform es una plataforma de **Executive Decision Intelligence** diseñada para transformar información operacional proveniente de uno o múltiples ERP en conocimiento ejecutivo de alto valor mediante la integración de:

- Business Data;
- Semantic Models;
- KPI Calculation;
- Configurable Business Rules;
- Heuristic Reasoning;
- Executive Dashboards;
- Conversational Intelligence.

La plataforma no reemplaza al ERP.

Su propósito es interpretar la información operacional, contextualizarla mediante reglas de negocio y modelos semánticos, generar indicadores ejecutivos y proporcionar capacidades analíticas y conversacionales para la toma de decisiones.

---

# Product Mission

The purpose of ERP Intelligence Platform is to transform ERP operational information into Executive Decision Intelligence by combining:

- Business Data;
- Semantic Models;
- KPI Calculation;
- Configurable Business Rules;
- Heuristic Reasoning;
- Executive Dashboards;
- Conversational Intelligence.

La plataforma deberá entregar información explicable, consistente y alineada con las reglas de negocio definidas por la organización.

---

# Product Vision

ERP Intelligence Platform evoluciona el concepto tradicional de Business Intelligence mediante una arquitectura compuesta por:

```text
ERP

↓

Data Acquisition

↓

Semantic Layer

↓

Business Rules Engine

↓

KPI Engine

↓

Executive Intelligence

↓

Conversational Analyst (DQBot)
```

Cada nivel agrega contexto y valor a la información hasta convertir datos operacionales en inteligencia ejecutiva.

---

# Documentation Philosophy

El proyecto adopta el principio de:

## Documentation First

Toda implementación deberá estar respaldada por documentación oficial.

La documentación constituye la **Single Source of Truth** del proyecto.

Los agentes, desarrolladores y herramientas automatizadas deberán consultar primero la documentación antes de modificar cualquier componente.

---

# Engineering Principles

Toda evolución del producto deberá respetar los siguientes principios:

- Documentation First
- Architecture First
- API First
- Semantic First
- Explainable Intelligence
- Event Driven
- Domain Driven Design
- Progressive Evolution
- Continuous Validation
- Product Observability

---

# Repository Overview

```text
/

docs/
backend/
frontend/
```

---

# Repository Structure

## docs/

Contiene toda la documentación oficial del proyecto.

```text
docs/

├── agents/
│   ├── platform/
│   ├── prompts/
│   ├── runtime/
│   └── specifications/
│
├── architecture/
│
├── business/
│
├── operating-model/
│   ├── matrices/
│   └── standards/
│
├── sop/
│
├── AGENTS.md
├── documentation-index.md
└── README.md
```

---

## backend/

Implementa:

- REST APIs;
- Rules Engine;
- KPI Engine;
- Insight Engine;
- Priority Engine;
- Semantic Services;
- Integraciones;
- Seguridad;
- Persistencia;
- Servicios del producto.

Nunca implementa lógica de presentación.

---

## frontend/

Implementa:

- Executive Dashboards;
- DQBot;
- Componentes;
- Visualizaciones;
- Navegación;
- UX/UI;
- Responsive Design;
- Integración con Backend.

Nunca implementa lógica de negocio.

---

# External Services

La plataforma utiliza recursos externos al repositorio.

Actualmente:

```text
Supabase

↓

Database

↓

Tables

Views

Materialized Views

RPC

Policies

Authentication

Storage
```

Supabase forma parte integral del producto y deberá ser considerado durante cualquier proceso de análisis o evolución.

---

# Documentation Hierarchy

Toda documentación deberá consultarse siguiendo el siguiente orden.

```text
README.md

↓

documentation-index.md

↓

AGENTS.md

↓

Business Documentation

↓

Architecture

↓

Operating Model

↓

Runtime Specifications

↓

Agent Specifications

↓

SOP
```

Este orden constituye el flujo oficial de comprensión del proyecto para desarrolladores, agentes y herramientas automatizadas.

---

# Repository Governance

Toda modificación deberá respetar:

- AGENTS.md;
- Operating Model;
- Runtime Specifications;
- Agent Specifications;
- Repository Governance;
- Business Documentation.

Ningún componente podrá modificarse sin mantener sincronizada la documentación correspondiente.

---