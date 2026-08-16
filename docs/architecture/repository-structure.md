# Repository Structure Specification

**Document:** `repository-structure.md`  
**Version:** 2.0  
**Status:** Official Repository Standard  
**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Repository Architecture Specification

---

## Repository Scope

Applies To:

- `/docs`
- `/backend`
- `/frontend`

---

## Source of Truth

Este documento define la organización oficial del repositorio.

Toda reorganización del código deberá seguir las reglas aquí definidas.

---

## Depends On

- `functional.md`
- `technology-stack.md`
- `architecture.md`
- `AGENTS.md`

---

## Used By

- Backend
- Frontend
- DevOps
- DQBot
- Antigravity
- Claude Code
- Codex
- Cursor
- GitHub Copilot
- Equipos de Desarrollo

---

## Related Documents

- `project-governance.md`
- `development-guide.md`
- `coding-standards.md`

---

# 1. Purpose

Este documento define la estructura oficial del repositorio del proyecto **ERP Intelligence Platform**.

Su objetivo es:

- establecer una organización uniforme;
- facilitar la navegación del proyecto;
- permitir que agentes de IA trabajen sobre una misma estructura;
- evitar reorganizaciones inconsistentes;
- mantener trazabilidad entre documentación e implementación.

Este documento constituye la referencia oficial para toda reorganización futura del repositorio.

---

# 2. Design Principles

La organización del repositorio sigue los siguientes principios:

- Domain Driven Design
- API First
- Documentation First
- Modular Architecture
- Low Coupling
- High Cohesion
- Single Source of Truth
- Multi-tenant Ready
- AI-Friendly Repository
- Progressive Refactoring

---

# 3. Current Repository Status

Actualmente el proyecto posee aproximadamente un **70% de implementación funcional**.

La estructura existente es completamente válida y operacional.

**No se recomienda realizar una reorganización manual completa del proyecto.**

La migración deberá realizarse mediante agentes de desarrollo especializados, de forma incremental y validando cada cambio.

---

# 4. Current Repository Structure

```text
/
│
├── docs/
│
├── backend/
│   ├── routes/
│   ├── services/
│   │   └── dqbot/
│   ├── node_modules/
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   ├── src/
│   ├── public/
│   └── ...
│
├── AGENTS.md
├── CLAUDE.md
└── README.md
```

Esta estructura constituye el **Baseline Actual**.

No debe romperse durante la migración.

---

# 5. Migration Strategy

La evolución del repositorio será **progresiva**, nunca mediante una reorganización masiva.

Principios:

- Nunca romper un producto funcionando.
- Cambios pequeños.
- Validación continua.
- Compatibilidad temporal.
- Actualización documental obligatoria.

---

## Migration Rules

```text
Current Structure

↓

Create New Structure

↓

Move One Module

↓

Update Imports

↓

Run Tests

↓

Deploy

↓

Continue
```

Nunca mover múltiples dominios simultáneamente.

---

# 6. Target Repository Structure

```text
/
│
├── docs/
│
├── backend/
│
├── frontend/
│
├── AGENTS.md
├── repository-structure.md
├── project-governance.md
├── README.md
└── CLAUDE.md
```

---

# 7. Documentation Directory

```text
/docs
```

La carpeta **docs** constituye la **Single Source of Truth**.

---

## Core Documentation

```text
functional.md

database.md

kpi.md

api.md

rules-engine.md

dqbot-architecture.md

technology-stack.md

architecture.md

operation.md
```

---

## Functional Documentation

```text
sop_sales_intelligence.md

sop_inventory_supply_intelligence.md

sop_ar_intelligence.md
```

---

## Repository Governance

```text
repository-structure.md

project-governance.md

development-guide.md

deployment-guide.md

configuration-guide.md

testing-guide.md

security-guide.md

coding-standards.md

tenant-guide.md
```

---

# 8. Backend Structure

## Current State

Actualmente el backend posee una organización sencilla basada en:

```text
routes/

services/
```

Esta organización continuará siendo soportada durante toda la migración.

---

## Target Structure

```text
backend/

src/

├── api/
│
├── controllers/
│
├── domains/
│   ├── sales/
│   ├── inventory/
│   ├── supply/
│   ├── finance/
│   ├── executive/
│   ├── analytics/
│   ├── insights/
│   └── dqbot/
│
├── services/
│
├── rules/
│
├── insights/
│
├── priority/
│
├── repositories/
│
├── database/
│
├── middleware/
│
├── auth/
│
├── shared/
│
├── config/
│
└── utils/
```

---

## Backend Responsibilities

El backend implementa exclusivamente:

- REST APIs
- Rules Engine
- Insight Engine
- Priority Engine
- DQBot Services
- Seguridad
- Integraciones ERP
- Configuración
- Auditoría
- Procesamiento Analítico

Nunca implementa lógica visual.

---

# 9. Database Structure

```text
backend/database/

├── migrations/
├── functions/
├── views/
│
│   ├── sales/
│   ├── inventory/
│   ├── supply/
│   ├── finance/
│   └── executive/
│
├── policies/
├── triggers/
├── scripts/
└── seeds/
```

Cada vista SQL deberá encontrarse documentada en `database.md`.

---

# 10. Frontend Structure

## Current State

Actualmente conviven:

```text
app/

components/

services/

src/
```

Esta estructura continuará soportándose durante la transición.

---

## Target Structure

```text
frontend/

app/

components/

│
├── layout/
├── charts/
├── panels/
├── navigation/
├── common/
└── forms/

domains/

├── sales/
├── inventory/
├── supply/
├── finance/
├── executive/
└── dqbot/

services/

└── api/

hooks/

types/

providers/

context/

lib/

utils/

styles/
```

---

## Frontend Responsibilities

Implementa únicamente:

- Dashboard Ejecutivo
- DQBot UI
- Componentes
- Navegación
- Visualización
- Consumo de APIs

Nunca implementa:

- reglas;
- KPIs;
- lógica SQL;
- cálculos analíticos.

---

# 11. Domain Organization

Todos los dominios deberán utilizar la misma estructura.

Ejemplo:

```text
sales/

api/

components/

hooks/

services/

types/

tests/
```

La misma organización aplica para:

- inventory
- supply
- finance
- executive
- dqbot

---

# 12. Documentation ↔ Code Mapping

| Documento | Backend | Frontend |
|------------|----------|-----------|
| functional.md | Todos los dominios | Todos los dominios |
| database.md | database/, repositories/ | — |
| kpi.md | services/, domains/ | Dashboard |
| rules-engine.md | rules/, insights/ | — |
| api.md | api/, controllers/ | services/api/ |
| dqbot-architecture.md | domains/dqbot/ | domains/dqbot/ |
| technology-stack.md | infraestructura | configuración |
| SOPs | dominios | dominios |

---

# 13. Naming Conventions

## Documents

```text
lowercase-with-dashes.md
```

---

## APIs

```text
/api/<domain>/<resource>
```

---

## SQL Views

```text
vw_<domain>_<purpose>
```

---

## Services

```text
sales.service.ts

inventory.service.ts

dqbot.service.ts
```

---

## Controllers

```text
sales.controller.ts

inventory.controller.ts
```

---

## Components

```text
SalesDashboard.tsx

InventoryCard.tsx

ExecutiveSummary.tsx
```

---

# 14. Progressive Migration Plan

La reorganización será ejecutada por agentes de desarrollo.

---

## Phase 1

Crear estructura destino.

No mover archivos.

---

## Phase 2

Migrar DQBot.

```text
services/dqbot/

↓

domains/dqbot/
```

---

## Phase 3

Migrar Analytics.

```text
analytics.js

↓

domains/analytics/
```

---

## Phase 4

Migrar Sales.

---

## Phase 5

Migrar Inventory.

---

## Phase 6

Migrar Finance.

---

## Phase 7

Migrar Frontend Services.

---

## Phase 8

Eliminar estructura Legacy.

---

# 15. AI Agent Instructions

Los agentes pueden:

- crear archivos;
- mover archivos;
- actualizar imports;
- refactorizar módulos;
- generar código;
- actualizar documentación.

---

Los agentes NO deben:

- romper compatibilidad;
- eliminar APIs funcionando;
- modificar contratos REST sin actualizar `api.md`;
- modificar KPIs sin actualizar `kpi.md`;
- modificar reglas sin actualizar `rules-engine.md`;
- mover múltiples dominios simultáneamente.

---

# 16. Validation Checklist

Después de cada migración deberá verificarse:

- Proyecto compila.
- APIs responden.
- Dashboard funciona.
- DQBot funciona.
- Imports corregidos.
- Tests exitosos.
- Documentación sincronizada.

---

# 17. Acceptance Criteria

La reorganización del repositorio se considera completa cuando:

- Backend organizado por dominios.
- Frontend organizado por dominios.
- Documentación sincronizada.
- No existen dependencias circulares.
- Toda la trazabilidad Documentación → Código está disponible.
- Los agentes pueden navegar el repositorio sin ambigüedad.
- El producto mantiene compatibilidad funcional durante toda la migración.

---

# Appendix A — Repository Evolution

```text
Current Repository
        │
        ▼
Migration Plan
        │
        ▼
Domain Organization
        │
        ▼
Modular Architecture
        │
        ▼
Enterprise Repository
```

---

# Appendix B — Repository Principles

- Documentation First.
- Domain Driven Design.
- API First.
- Progressive Refactoring.
- AI-Friendly Repository.
- Single Source of Truth.
- Low Coupling.
- High Cohesion.
- Backward Compatibility.
- Continuous Validation.

---

# End of Document