# Technology Stack Specification

**Document:** `technology-stack.md`  
**Version:** 1.0  
**Status:** Architecture Baseline  
**Owner:** ERP Intelligence Platform

---

# 1. Purpose

Este documento define el stack tecnológico oficial del producto ERP Intelligence Platform.

Su objetivo es establecer una arquitectura moderna, escalable, desacoplada y preparada para soportar múltiples clientes (multi-tenant), inteligencia de negocio, automatización y capacidades de IA.

No describe procesos funcionales; únicamente las tecnologías, componentes y principios arquitectónicos que soportan la plataforma.

---

# 2. Design Principles

La arquitectura tecnológica se basa en los siguientes principios:

- API First.
- Cloud Native.
- Modular.
- Event Driven cuando aplique.
- Multi-tenant.
- Configuration over Code.
- Open Standards.
- Low Vendor Lock-in.
- Explainable AI.
- Escalabilidad horizontal.
- Seguridad por diseño (Security by Design).

---

# 3. High-Level Technology Architecture

```text
                Users
                  │
                  ▼
         Next.js Web Application
                  │
                  ▼
           API Gateway / REST
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
 Rules Engine   DQBot API   Business APIs
     │            │            │
     └────────────┼────────────┘
                  ▼
          PostgreSQL (Supabase)
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
   Storage      Auth       Realtime
                  │
                  ▼
          n8n Automation Layer
                  │
                  ▼
         ERP / External Systems
```

---

# 4. Architectural Layers

| Layer | Responsibility |
|---------|----------------|
| Presentation | Web UI (Next.js) |
| API Layer | REST APIs |
| Business Layer | Domain Services |
| Rules Layer | Business Rules |
| Intelligence Layer | Insights + Priority Engine |
| Data Layer | PostgreSQL |
| Integration Layer | n8n |
| Infrastructure | Cloud Services |

---

# 5. Core Technology Stack

| Component | Technology | Status |
|-----------|------------|--------|
| Frontend | Next.js | Selected |
| Language | TypeScript | Selected |
| Backend | Next.js API Routes / Route Handlers | Selected |
| Database | PostgreSQL (Supabase) | Selected |
| Authentication | Supabase Auth | Selected |
| Storage | Supabase Storage | Selected |
| Automation | n8n | Selected |
| AI Provider | OpenAI API (abstracción para múltiples proveedores) | Selected |
| ORM | Prisma (recomendado) | Proposed |
| Cache / Queue | Redis | Proposed |
| Vector Store | pgvector (Supabase) | Planned |
| Observability | OpenTelemetry | Proposed |

---

# 6. Technology Selection Criteria

La selección del stack responde a los siguientes objetivos:

- Reducir complejidad operativa.
- Minimizar costos de infraestructura.
- Facilitar desarrollo rápido.
- Escalar desde PYMEs hasta grandes empresas.
- Favorecer componentes ampliamente adoptados.
- Evitar tecnologías propietarias cuando existan alternativas maduras.

---

# 7. Frontend Architecture

## 7.1 Technology

La capa de presentación está basada en **Next.js** utilizando TypeScript como lenguaje estándar.

La aplicación implementa una arquitectura modular orientada a componentes y dominios funcionales.

---

## Responsibilities

El frontend es responsable de:

- Autenticación de usuarios.
- Navegación.
- Dashboards ejecutivos.
- Visualización de KPIs.
- Visualización de Insights.
- Conversación con DQBot.
- Administración de configuraciones.
- Reportes.

Toda la lógica de negocio permanece en el backend.

---

## Suggested Folder Structure

```text
src/

├── app/
├── components/
├── domains/
│   ├── sales/
│   ├── inventory/
│   ├── supply/
│   ├── finance/
│   └── executive/
├── services/
├── hooks/
├── lib/
├── utils/
├── types/
└── styles/
```

---

## UI Principles

- Responsive.
- Mobile First.
- Component Driven.
- Lazy Loading.
- Reusable Components.
- Domain-oriented organization.

---

# 8. Backend Architecture

## Technology

El backend se implementa inicialmente mediante **Next.js Route Handlers / API Routes**, permitiendo evolucionar posteriormente hacia servicios independientes si el crecimiento del producto lo requiere.

---

## Responsibilities

El backend concentra:

- REST APIs.
- Reglas de negocio.
- Integración con Supabase.
- Integración con OpenAI.
- Integración con n8n.
- Seguridad.
- Multi-tenant.
- Auditoría.

---

## Suggested Modular Structure

```text
/api

↓

Controllers

↓

Application Services

↓

Rules Engine

↓

Repositories

↓

Supabase
```

---

## Service Separation

Los módulos recomendados son:

```text
Sales Service

Inventory Service

Supply Service

Finance Service

Analytics Service

DQBot Service

Rules Service

Configuration Service
```

Cada módulo debe ser independiente y reutilizable.

---

# 9. Database Layer

## Primary Database

La plataforma utiliza **PostgreSQL administrado por Supabase** como base de datos principal.

---

## Responsibilities

La base de datos almacena:

- Datos del ERP.
- Capa Business.
- Capa Semántica.
- KPIs.
- Reglas.
- Configuración.
- Insights.
- Auditoría.

---

## Supported Features

```text
PostgreSQL

↓

Views

↓

Materialized Views

↓

Functions

↓

Triggers

↓

RLS

↓

Extensions
```

---

## Recommended Extensions

| Extension | Purpose | Status |
|-----------|----------|--------|
| pgvector | Búsqueda vectorial / RAG | Planned |
| pgcrypto | Seguridad | Recommended |
| uuid-ossp | Identificadores | Recommended |
| pg_stat_statements | Performance | Recommended |

---

# 10. Authentication & Authorization

## Authentication

La autenticación será gestionada mediante **Supabase Auth**.

---

## Supported Providers

- Email/Password.
- Magic Link.
- OAuth (Microsoft, Google, GitHub, etc.).
- SSO (fase futura).

---

## Authorization Model

Se recomienda un modelo **RBAC (Role-Based Access Control)**.

| Role | Responsibilities |
|------|------------------|
| Administrator | Administración completa |
| Executive | Visualización ejecutiva |
| Manager | Gestión de dominio |
| Analyst | Consulta analítica |
| Integration | Cuenta de servicio |

---

## Multi-Tenant Security

Cada consulta debe validar:

```text
Authenticated User

↓

Tenant

↓

Role

↓

Permissions

↓

Requested Resource
```

La separación entre clientes debe implementarse mediante **Row Level Security (RLS)** y políticas por `client_id`.

---

# 11. Storage Layer

## Technology

Se utilizará **Supabase Storage** para todos los archivos generados o consumidos por la plataforma.

---

## Supported Content

- Importaciones CSV.
- Exportaciones Excel.
- Reportes PDF.
- Archivos temporales.
- Documentación.
- Base documental para RAG (futuro).

---

## Organization

```text
/client-id/

├── imports/
├── exports/
├── reports/
├── documents/
├── images/
└── backups/
```

---

# 12. Caching & Queue Layer

## Current Strategy

Durante el MVP la plataforma puede operar sin una capa de caché dedicada.

---

## Recommended Evolution

Para entornos con mayor carga se recomienda incorporar **Redis**.

---

## Redis Responsibilities

- Caché de KPIs.
- Caché de Executive Summary.
- Caché de respuestas frecuentes.
- Contexto temporal de DQBot.
- Rate Limiting.
- Distribución de sesiones.

---

## Queue Processing

Redis también soportará colas para:

- Refresh de KPIs.
- Generación de Insights.
- Procesamiento de reportes.
- Exportaciones masivas.
- Automatizaciones iniciadas por n8n.

---

# 13. Integration Layer

## 13.1 Purpose

La capa de integración desacopla la plataforma ERP Intelligence de los sistemas externos.

Su objetivo es garantizar que la incorporación de nuevos ERPs, APIs o servicios no requiera modificar la lógica del producto.

---

# 14. Integration Platform

## Technology

La plataforma adopta **n8n** como motor principal de integración y automatización.

---

## Responsibilities

n8n será responsable de:

- Extracción de datos desde ERPs.
- Orquestación de procesos ETL.
- Sincronización programada.
- Integración con APIs externas.
- Automatizaciones.
- Notificaciones.
- Workflows empresariales.

---

## Integration Flow

```text
ERP

↓

n8n

↓

RAW Layer

↓

STG Layer

↓

Business Layer

↓

Semantic Layer

↓

KPIs

↓

Rules

↓

Insights
```

---

## Supported Connectors

Inicialmente:

- REST APIs
- Webhooks
- PostgreSQL
- SQL Server
- Oracle
- SAP (API)
- NetSuite
- Microsoft 365
- Google Workspace
- SMTP
- SFTP

Arquitectura preparada para incorporar nuevos conectores sin modificar el producto.

---

# 15. Artificial Intelligence Layer

## Purpose

La IA constituye una capacidad transversal del producto.

Su responsabilidad es interpretar información ya procesada, nunca reemplazar la lógica de negocio.

---

## AI Responsibilities

- Generación de respuestas conversacionales.
- Explicación de KPIs.
- Explicación de Insights.
- Recomendaciones.
- Resúmenes ejecutivos.
- Análisis contextual.
- Soporte documental (RAG).

---

## Model Abstraction

La plataforma no dependerá de un único proveedor.

```text
DQBot

↓

LLM Adapter

↓

OpenAI

Anthropic

Azure OpenAI

Google Gemini

Future Providers
```

El uso de un adaptador permite cambiar de proveedor sin modificar la lógica del producto.

---

## Prompt Governance

Todos los prompts deberán:

- versionarse;
- documentarse;
- auditarse;
- reutilizarse;
- desacoplarse del código fuente.

---

# 16. Vector Search & Knowledge Base

## Current Status

Planificado.

---

## Technology

Se recomienda utilizar **pgvector** sobre PostgreSQL para mantener la simplicidad de la arquitectura.

---

## Supported Knowledge Sources

- SOPs.
- Documentación funcional.
- Arquitectura.
- Manuales.
- FAQs.
- Documentación técnica.
- Políticas corporativas.

---

## Future Flow

```text
Question

↓

Intent

↓

REST APIs

+

Vector Search

↓

Prompt Builder

↓

LLM

↓

Response
```

---

# 17. Observability

## Purpose

Toda la plataforma debe ser observable.

---

## Recommended Standard

OpenTelemetry.

---

## Monitoring Areas

### Application

- Requests.
- Latency.
- Errors.
- Availability.

---

### Database

- Query performance.
- Slow queries.
- Locks.
- Connections.

---

### APIs

- Response time.
- Success rate.
- Error rate.
- Throughput.

---

### DQBot

- Tokens.
- Latency.
- API calls.
- Confidence.
- Prompt version.

---

### Workflows

- n8n executions.
- Failed workflows.
- Retry count.
- Execution time.

---

# 18. Logging Strategy

Todos los componentes deberán registrar eventos estructurados.

---

## Minimum Log Fields

```text
Timestamp

Service

Tenant

User

Correlation ID

Endpoint

Execution Time

Status

Severity
```

---

## Log Categories

| Category | Description |
|-----------|-------------|
| Audit | Acciones del usuario |
| Business | Eventos funcionales |
| Technical | Errores y excepciones |
| Security | Autenticación y autorización |
| AI | Ejecuciones de DQBot |

---

# 19. Infrastructure

## Deployment Model

Arquitectura Cloud Native.

---

## Logical Components

```text
Frontend

↓

Backend

↓

Database

↓

Storage

↓

Automation

↓

AI

↓

Monitoring
```

---

## Recommended Environments

```text
Development

↓

Testing

↓

Staging

↓

Production
```

Cada ambiente debe mantener configuraciones independientes.

---

# 20. Scalability Strategy

La arquitectura debe escalar horizontalmente.

---

## Stateless Services

Todos los servicios deberán ser stateless.

El estado persistente permanecerá únicamente en:

- PostgreSQL.
- Redis.
- Storage.

---

## Independent Scaling

Los siguientes componentes podrán escalar de forma independiente:

- Frontend.
- Backend APIs.
- DQBot.
- n8n Workers.
- Redis.
- PostgreSQL Read Replicas.

---

## Future Evolution

Cuando el volumen de clientes lo justifique, podrán desacoplarse como microservicios:

```text
Sales API

Inventory API

Finance API

Rules Engine

DQBot

Analytics API

Notification Service
```

Sin modificar los contratos REST existentes.

---

# 21. Security Architecture

## Purpose

Proteger datos, usuarios, tenants, APIs e integraciones.

## Core Principles

- Authentication required.
- RBAC.
- Tenant isolation.
- Row Level Security.
- Least privilege.
- Auditability.
- Secrets management.

## Recommended Controls

```text
Supabase Auth
↓
JWT
↓
RBAC
↓
RLS by client_id
↓
API Authorization
```

---

# 22. Secrets Management

Las credenciales nunca deben almacenarse en código.

Deben gestionarse mediante:

- Environment variables.
- Secret manager del proveedor cloud.
- n8n credentials vault.
- Rotación periódica.

---

# 23. Backup & Recovery

## Database

- Backups automáticos.
- Point-in-time recovery.
- Snapshots antes de cambios críticos.

## Storage

- Versionado de archivos críticos.
- Backups de reportes y documentos.

## Recovery Objectives

```text
RPO: definido por cliente
RTO: definido por criticidad
```

---

# 24. Deployment Strategy

## Recommended Environments

```text
Development
Testing
Staging
Production
```

## Deployment Principles

- CI/CD.
- Validación automática.
- Migraciones controladas.
- Rollback plan.
- Separación de secretos por ambiente.

---

# 25. CI/CD

Pipeline recomendado:

```text
Code Commit
↓
Lint
↓
Tests
↓
Build
↓
Security Scan
↓
Deploy Staging
↓
Validation
↓
Deploy Production
```

---

# 26. Testing Strategy

## Test Types

- Unit tests.
- API tests.
- Integration tests.
- Database migration tests.
- E2E tests.
- Security tests.
- DQBot response validation.

---

# 27. Recommended Additions

Para robustecer el stack:

```text
Redis
OpenTelemetry
pgvector
RLS
CI/CD
Automated backups
Structured logging
Prompt versioning
```

---

# 28. Acceptance Criteria

El stack tecnológico se considera completo cuando:

- Soporta frontend, backend, datos, IA e integración.
- Implementa autenticación y autorización.
- Soporta multi-tenant.
- Tiene observabilidad.
- Tiene estrategia de backup.
- Soporta automatización.
- Permite evolución hacia RAG y AI Analysts.

---

# 29. Technology Roadmap

## 29.1 Evolution Strategy

La plataforma ha sido diseñada para evolucionar progresivamente sin requerir rediseños arquitectónicos.

Cada etapa incorpora nuevas capacidades reutilizando los componentes existentes.

---

## Phase 1 — Foundation (MVP)

Objetivo: disponer de una plataforma funcional para los primeros clientes.

### Incluye

- Next.js
- TypeScript
- PostgreSQL (Supabase)
- Supabase Auth
- Supabase Storage
- REST APIs
- Rules Engine
- Insight Engine
- Priority Engine
- DQBot
- n8n
- Dashboards Ejecutivos

Estado:

```text
Production Ready
```

---

## Phase 2 — Enterprise

Objetivo: soportar clientes medianos y grandes.

### Incorporaciones

- Redis
- Queue Processing
- OpenTelemetry
- Grafana
- Prometheus
- Read Replicas PostgreSQL
- Scheduler centralizado
- Background Workers
- Rate Limiting
- API Gateway

Estado:

```text
Recommended
```

---

## Phase 3 — AI Platform

Objetivo: convertir DQBot en un Business Copilot.

### Incorporaciones

- pgvector
- Knowledge Base
- RAG
- Prompt Versioning
- Context Memory
- Semantic Search
- AI Recommendations
- AI Generated Reports

Estado:

```text
Planned
```

---

## Phase 4 — Enterprise Intelligence Platform

Objetivo: convertir el producto en una plataforma integral de inteligencia empresarial.

### Incorporaciones

- Event Streaming
- Data Lake
- Real-Time Analytics
- Predictive Models
- Scenario Simulation
- AI Agents
- Workflow Intelligence
- Executive Digital Twin

Estado:

```text
Future
```

---

# 30. Recommended Cloud Architecture

## Logical Architecture

```text
Internet
        │
        ▼
 CDN / WAF
        │
        ▼
 Next.js Application
        │
        ▼
 REST API
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
DQBot Rules   Analytics
 │       │        │
 └───────┼────────┘
         ▼
 PostgreSQL (Supabase)
         │
 ┌───────┼───────────┐
 ▼       ▼           ▼
Storage Auth      Realtime
         │
         ▼
 Redis (Future)
         │
         ▼
 n8n
         │
         ▼
 ERP / External Systems
```

---

# 31. Technology Decision Matrix

| Capability | Selected Technology | Justification |
|------------|---------------------|---------------|
| Frontend | Next.js | Ecosistema moderno, SSR, App Router |
| Language | TypeScript | Tipado y mantenibilidad |
| Backend | Next.js Route Handlers | Simplicidad para MVP y crecimiento |
| Database | PostgreSQL | Robusto y ampliamente adoptado |
| Managed DB | Supabase | Reduce operación y acelera desarrollo |
| Authentication | Supabase Auth | Integración nativa con PostgreSQL |
| Storage | Supabase Storage | Gestión unificada de archivos |
| Automation | n8n | Low-code, extensible y autoalojable |
| ORM | Prisma | Productividad y migraciones |
| Cache | Redis | Alto rendimiento y colas |
| Vector Search | pgvector | Integración directa con PostgreSQL |
| AI | OpenAI Adapter | Abstracción para múltiples proveedores |
| Monitoring | OpenTelemetry | Estándar abierto de observabilidad |

---

# 32. Technology Governance

## Architectural Principles

Toda nueva tecnología incorporada deberá cumplir:

- Estándares abiertos.
- Bajo acoplamiento.
- Documentación oficial.
- Comunidad activa.
- Escalabilidad demostrada.
- Compatibilidad con la arquitectura existente.
- Soporte para despliegues cloud.

---

## Technology Evaluation Criteria

Antes de incorporar una nueva tecnología se evaluará:

- Madurez.
- Curva de aprendizaje.
- Coste operativo.
- Coste de licenciamiento.
- Escalabilidad.
- Compatibilidad con PostgreSQL.
- Compatibilidad con TypeScript.
- Compatibilidad con Docker.
- Compatibilidad con CI/CD.

---

# 33. Non-Functional Targets

## Performance

| Component | Target |
|-----------|--------|
| API Response | < 500 ms |
| Executive Dashboard | < 2 s |
| DQBot Standard Query | < 5 s |
| KPI Refresh | < 5 min |
| Insight Generation | < 2 min |

---

## Availability

| Environment | Target |
|-------------|--------|
| Production | 99.9% |
| Staging | 99.5% |
| Development | Best Effort |

---

## Scalability

La arquitectura deberá soportar crecimiento mediante:

- Escalado horizontal del frontend.
- Escalado horizontal de APIs.
- Workers independientes para n8n.
- Réplicas de lectura en PostgreSQL.
- Redis distribuido.
- Balanceadores de carga.

---

# 34. Documentation Dependencies

Este documento complementa y da soporte técnico a:

## Core Documents

- `functional.md`
- `database.md`
- `kpi.md`
- `api.md`
- `rules-engine.md`
- `dqbot-architecture.md`

---

## Supporting Documents

- `architecture.md`
- `operation.md`

---

## Domain Documents

- `sop_sales_intelligence.md`
- `sop_inventory_supply_intelligence.md`
- `sop_ar_intelligence.md`

---

# 35. Current Technology Coverage

| Área | Estado |
|------|--------|
| Frontend | Completo |
| Backend | Completo |
| APIs | Completo |
| Base de Datos | Completo |
| Seguridad | Completo |
| Multi-tenant | Completo |
| Integraciones | Completo |
| Automatización | Completo |
| Observabilidad | Completo |
| IA | Completo |
| RAG | Definido |
| Roadmap | Completo |

---

# Appendix A — End-to-End Technology Stack

```text
Users
        │
        ▼
Next.js
        │
        ▼
REST API
        │
 ┌──────┼──────────────┐
 ▼      ▼              ▼
Rules  DQBot      Analytics
        │
        ▼
PostgreSQL (Supabase)
        │
 ┌──────┼──────────────┐
 ▼      ▼              ▼
Storage Auth      Realtime
        │
        ▼
Redis (Future)
        │
        ▼
n8n
        │
        ▼
ERP Systems
        │
        ▼
Insights
        │
        ▼
Executive Dashboard
```

---

# Appendix B — Strategic Technology Vision

La visión tecnológica de la plataforma es construir una solución que:

- Escale desde un MVP hasta una plataforma Enterprise.
- Mantenga una arquitectura modular y desacoplada.
- Permita incorporar nuevos dominios funcionales sin rediseños.
- Integre capacidades de IA de forma controlada y explicable.
- Minimice la dependencia de proveedores específicos.
- Priorice tecnologías maduras y ampliamente adoptadas.

---

# End of Document