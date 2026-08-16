# Task Lifecycle

**Document:** `task-lifecycle.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Task Lifecycle Specification

---

## Repository Scope

Applies To:

- `/backend`
- `/frontend`
- `/docs`

---

## Source of Truth

Este documento define el ciclo de vida oficial de cualquier tarea ejecutada dentro del ecosistema AI Engineering de ERP Intelligence Platform.

Todo Runtime deberá implementar este flujo.

Ningún agente podrá modificar el ciclo de vida definido en este documento.

---

## Depends On

### Core

- README.md
- documentation-index.md
- AGENTS.md

### Operating Model

- architecture-review.md
- ai-engineering-operating-model.md

### Governance

- project-governance.md

### Agents

Todos los documentos ubicados en:

```text
/docs/agents
```

---

## Used By

- Todos los Runtime Specifications
- Todos los Prompts
- Todos los Agentes

---

## Related Documents

- communication-protocol.md
- handoff-protocol.md
- repository-permission-matrix.md
- decision-authority-matrix.md
- agent-capability-matrix.md

---

# 1. Purpose

Definir un ciclo de vida único, repetible y auditable para cualquier tarea ejecutada por el ecosistema de agentes.

El objetivo es garantizar que todas las tareas recorran las mismas etapas independientemente del agente responsable.

---

# 2. Mission

Estandarizar la ejecución de tareas para asegurar:

- trazabilidad;
- consistencia;
- calidad;
- gobernanza;
- escalabilidad.

---

# 3. Core Principles

Toda tarea deberá respetar:

- Documentation First
- Architecture Before Implementation
- Single Source of Truth
- Traceability
- Progressive Validation
- Human Approval for Critical Changes
- Continuous Improvement

---

# 4. Task Philosophy

Las tareas constituyen la unidad central del sistema.

Los agentes no poseen un flujo propio.

Los agentes participan en distintas etapas del ciclo de vida de una tarea.

---

# 5. Task States

Toda tarea deberá atravesar los siguientes estados:

```text
Created

↓

Classified

↓

Architecture Review

↓

Planned

↓

Assigned

↓

Executing

↓

Implementation Completed

↓

QA Validation

↓

Documentation Updated

↓

Ready for Deployment

↓

Deployment

↓

Operational Validation

↓

Completed

↓

Archived
```

Ningún estado podrá omitirse sin autorización explícita.

---

# 6. State Definitions

## Created

La tarea ha sido registrada.

---

## Classified

El Orchestrator determina:

- tipo;
- prioridad;
- dominio;
- impacto.

---

## Architecture Review

El Chief Architect evalúa:

- impacto arquitectónico;
- dependencias;
- riesgos.

---

## Planned

Se define:

- estrategia;
- agentes participantes;
- entregables.

---

## Assigned

La tarea es asignada al agente responsable.

---

## Executing

El agente implementa el trabajo.

---

## Implementation Completed

El desarrollo finaliza.

---

## QA Validation

QA verifica:

- funcionalidad;
- arquitectura;
- documentación.

---

## Documentation Updated

Documentation Agent sincroniza la documentación.

---

## Ready for Deployment

DevOps prepara el despliegue.

---

## Deployment

La solución es publicada.

---

## Operational Validation

Se verifica:

- operación;
- monitoreo;
- estabilidad.

---

## Completed

La tarea queda oficialmente finalizada.

---

## Archived

La tarea pasa al historial.

---

# 7. Task Categories

Las tareas podrán clasificarse como:

- Feature
- Enhancement
- Bug
- Hotfix
- Refactoring
- Documentation
- Infrastructure
- Migration
- Security
- Research

---

# 8. Priority Levels

Toda tarea tendrá una prioridad:

```text
Critical

High

Medium

Low
```

---

# 9. Approval Gates

Las siguientes etapas requieren aprobación:

- Architecture Review
- QA Validation
- Production Deployment

---

# 10. Validation Gates

Toda tarea deberá superar:

- Validación Arquitectónica
- Validación Funcional
- Validación Documental
- Validación QA
- Validación Operacional

---

# 11. Handoff Rules

Cada transición entre estados constituye un handoff oficial.

Todo handoff deberá:

- conservar contexto;
- mantener trazabilidad;
- registrar responsable;
- registrar fecha.

---

# 12. Failure Handling

Si una tarea falla:

```text
Current State

↓

Issue Detected

↓

Rollback State

↓

Correction

↓

Resume Lifecycle
```

Nunca se omitirán estados para acelerar el proceso.

---

# 13. Metrics

Toda tarea registrará:

- fecha creación;
- fecha inicio;
- fecha término;
- agente responsable;
- duración;
- prioridad;
- estado;
- aprobaciones.

---

# 14. Runtime Responsibilities

Los Runtime únicamente implementarán este ciclo.

Nunca deberán redefinir estados.

---

# 15. Success Criteria

El Task Lifecycle se considera correctamente implementado cuando:

- todas las tareas siguen el mismo flujo;
- los estados son auditables;
- existe trazabilidad completa;
- los handoffs son consistentes;
- los Runtime reutilizan este modelo sin modificaciones.

---

# 16. Next Documents

Después de este documento deberán generarse:

```text
agent-capability-matrix.md

↓

repository-permission-matrix.md

↓

decision-authority-matrix.md

↓

communication-protocol.md

↓

handoff-protocol.md
```

---

# Appendix A — Complete Lifecycle

```text
Created

↓

Classified

↓

Architecture Review

↓

Planned

↓

Assigned

↓

Executing

↓

Implementation Completed

↓

QA Validation

↓

Documentation Updated

↓

Ready for Deployment

↓

Deployment

↓

Operational Validation

↓

Completed

↓

Archived
```

---

# Appendix B — Lifecycle Principles

- Traceability
- Governance
- Documentation First
- Progressive Validation
- Architecture Before Implementation
- Human Oversight
- Repeatability
- Continuous Improvement

---

# End of Document