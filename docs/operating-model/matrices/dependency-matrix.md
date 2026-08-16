# Dependency Matrix

**Document:** `dependency-matrix.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Dependency Matrix

---

## Repository Scope

Applies To:

- `/docs`
- `/backend`
- `/frontend`
- `/database`
- `/infrastructure`
- `/workflows`

---

## Source of Truth

Este documento define las dependencias oficiales entre documentos, agentes, procesos y componentes del ecosistema AI Engineering.

Todo Runtime deberá consultar esta matriz antes de ejecutar tareas con impacto transversal.

---

## Depends On

- architecture-review.md
- ai-engineering-operating-model.md
- task-lifecycle.md
- process-orchestration-model.md
- agent-capability-matrix.md
- repository-permission-matrix.md
- decision-authority-matrix.md
- communication-protocol.md
- handoff-protocol.md
- review-workflow.md

---

## Used By

- Orchestrator Runtime
- Todos los Runtime Specifications
- Communication Protocol
- Handoff Protocol
- Platform Configuration
- n8n Workflows

---

## Related Documents

- process-orchestration-model.md
- task-lifecycle.md
- repository-permission-matrix.md
- decision-authority-matrix.md

---

# 1. Purpose

Definir de forma explícita las dependencias entre agentes, documentos, procesos y componentes del sistema.

---

# 2. Mission

Garantizar que todo cambio pueda evaluar correctamente su impacto antes de ser ejecutado.

---

# 3. Core Principles

Toda dependencia deberá respetar:

- Traceability
- Impact Awareness
- Documentation First
- No Hidden Dependencies
- Single Source of Truth
- Progressive Validation
- Governance by Design

---

# 4. Dependency Types

Las dependencias se clasifican como:

| Tipo | Descripción |
|------|-------------|
| Document | Depende de documentación oficial |
| Agent | Depende de otro agente |
| Process | Depende de un flujo operativo |
| Repository | Depende de una zona del repositorio |
| Platform | Depende de infraestructura o tooling |
| Data | Depende de datos o modelos |

---

# 5. Agent Dependency Matrix

| Agent | Depends On |
|------|------------|
| Chief Architect | Architecture, Governance, Operating Model |
| Orchestrator | Task Lifecycle, Process Orchestration, Matrices |
| Backend | API, Database, Rules Engine, Backend Scope |
| Frontend | API, Functional, UI Scope |
| Database | Database, KPI, Rules Engine, Data Layers |
| DQBot | API, KPI, Rules Engine, DQBot Architecture |
| Documentation | All Docs, Metadata Standard |
| QA | Functional, API, Database, Frontend, Backend |
| Refactoring | Repository Structure, Migration Plan |
| DevOps | Technology Stack, Operation, Infrastructure |

---

# 6. Process Dependency Matrix

| Process | Required Dependencies |
|--------|------------------------|
| CSV Ingestion | n8n, Orchestrator, Database, Backend, QA |
| API Ingestion | n8n, Orchestrator, Database, Backend, QA |
| ETL Sync | n8n, Orchestrator, Database, QA |
| KPI Refresh | Database, Rules Engine, Backend, QA |
| Dashboard Update | Backend, Frontend, QA |
| DQBot Update | Backend, DQBot, QA, Documentation |
| Deployment | QA, Documentation, DevOps |
| Refactoring | Chief Architect, Refactoring, QA, Documentation |

---

# 7. Documentation Dependency Matrix

| Document | Depends On |
|---------|------------|
| ai-engineering-operating-model.md | architecture-review.md |
| task-lifecycle.md | ai-engineering-operating-model.md |
| process-orchestration-model.md | task-lifecycle.md |
| communication-protocol.md | task-lifecycle.md |
| handoff-protocol.md | communication-protocol.md |
| review-workflow.md | handoff-protocol.md |
| agent-capability-matrix.md | Agent Specifications |
| repository-permission-matrix.md | Agent Capability Matrix |
| decision-authority-matrix.md | Agent Capability Matrix |
| dependency-matrix.md | All Operating Model Documents |

---

# 8. Data Flow Dependencies

```text
ERP Source

↓

CSV / API / ETL

↓

n8n

↓

Orchestrator

↓

Database Agent

↓

Backend Agent

↓

Frontend / DQBot

↓

User
```

---

# 9. Impact Analysis Rules

Antes de ejecutar una tarea, el Orchestrator deberá identificar:

- documentos afectados;
- agentes involucrados;
- repositorios afectados;
- procesos impactados;
- riesgos operativos;
- validaciones requeridas.

---

# 10. Dependency Validation

Toda tarea deberá validar:

- dependencias disponibles;
- permisos correctos;
- autoridad definida;
- documentación existente;
- flujo operativo compatible.

---

# 11. Runtime Integration

Los Runtime deberán consultar esta matriz antes de:

- modificar código;
- mover archivos;
- alterar APIs;
- cambiar datos;
- actualizar flujos n8n;
- desplegar cambios.

---

# 12. Success Criteria

La matriz se considera correcta cuando:

- no existen dependencias implícitas;
- los impactos son trazables;
- los agentes conocen sus dependencias;
- los procesos pueden ejecutarse sin ambigüedad;
- los Runtime pueden reutilizar la matriz sin redefinirla.

---

# Appendix A — Dependency Flow

```text
Task

↓

Dependency Analysis

↓

Impact Analysis

↓

Execution

↓

Validation

↓

Documentation
```

---

# Appendix B — Dependency Principles

- Explicit Dependencies
- Traceability
- No Hidden Coupling
- Impact Awareness
- Documentation First
- Governance by Design

---

# End of Document