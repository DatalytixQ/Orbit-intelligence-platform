# Agent Capability Matrix

**Document:** `agent-capability-matrix.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Agent Capability Matrix

---

## Repository Scope

Applies To:

- `/docs`
- `/backend`
- `/frontend`

---

## Source of Truth

Este documento define oficialmente las capacidades de todos los agentes del ecosistema AI Engineering.

Toda asignación de responsabilidades, delegación de tareas, generación de Runtime Specifications y configuración de plataformas deberá respetar esta matriz.

La Agent Capability Matrix constituye la referencia oficial para determinar qué agente puede ejecutar, aprobar, validar, documentar o desplegar una determinada actividad.

---

## Depends On

### Core

- README.md
- documentation-index.md
- AGENTS.md

### Operating Model

- architecture-review.md
- ai-engineering-operating-model.md
- task-lifecycle.md

### Agent Specifications

- chief-architect-agent.md
- orchestrator-agent.md
- backend-agent.md
- frontend-agent.md
- database-agent.md
- dqbot-agent.md
- documentation-agent.md
- qa-agent.md
- refactoring-agent.md
- devops-agent.md

---

## Used By

- Todos los Runtime Specifications
- Todos los Prompts
- Todos los agentes
- Communication Protocol
- Handoff Protocol
- Decision Authority Matrix

---

## Related Documents

- repository-permission-matrix.md
- decision-authority-matrix.md
- communication-protocol.md
- handoff-protocol.md

---

# 1. Purpose

Definir las capacidades oficiales de cada agente del ecosistema.

Esta matriz elimina ambigüedades sobre responsabilidades y constituye la base para la coordinación entre agentes.

---

# 2. Mission

Garantizar que cada capacidad tenga un responsable claramente identificado y que ningún agente actúe fuera de su ámbito de competencia.

---

# 3. Core Principles

Toda capacidad deberá respetar:

- Single Responsibility
- Separation of Concerns
- Least Privilege
- Documentation First
- Traceability
- Governance by Design
- Explicit Delegation

---

# 4. Capability Model

Cada capacidad se clasifica mediante los siguientes roles:

| Código | Significado |
|--------|-------------|
| **A** | Accountable (aprueba y asume responsabilidad final) |
| **R** | Responsible (ejecuta) |
| **V** | Validator (valida el resultado) |
| **C** | Consulted (debe ser consultado) |
| **I** | Informed (debe ser informado) |

---

# 5. Agent Categories

## Governance

- Chief Architect
- Orchestrator

---

## Engineering

- Backend
- Frontend
- Database
- DQBot

---

## Quality & Operations

- Documentation
- QA
- Refactoring
- DevOps

---

# 6. Capability Matrix

| Capability | CA | OR | BE | FE | DB | DQ | DOC | QA | REF | DEV |
|------------|:--:|:--:|:--:|:--:|:--:|:--:|:---:|:--:|:---:|:---:|
| Arquitectura | A | C | I | I | I | I | I | I | C | I |
| Planificación | A | R | C | C | C | C | I | I | I | I |
| Backend | I | C | R | I | C | I | I | V | C | I |
| Frontend | I | C | I | R | I | I | I | V | C | I |
| Base de Datos | A | C | C | I | R | I | I | V | I | C |
| DQBot | A | C | C | C | I | R | I | V | I | I |
| Refactoring | C | C | C | C | C | I | I | V | R | I |
| Documentación | I | I | C | C | C | C | R | C | C | C |
| QA | I | C | I | I | I | I | C | R | I | I |
| Despliegue | A | C | I | I | C | I | I | V | I | R |

---

# 7. Delegation Rules

Los agentes podrán delegar únicamente actividades compatibles con esta matriz.

La delegación nunca transfiere la responsabilidad final (Accountability).

---

# 8. Escalation Rules

Las siguientes situaciones deberán escalarse obligatoriamente al Chief Architect:

- cambios arquitectónicos;
- incorporación de nuevas tecnologías;
- modificación del modelo operativo;
- cambios de gobernanza.

---

# 9. Collaboration Rules

Cuando una tarea requiera varias capacidades:

1. El Orchestrator coordina.
2. Cada agente ejecuta únicamente su ámbito.
3. QA valida.
4. Documentation sincroniza.
5. DevOps despliega.

---

# 10. Shared Responsibilities

Algunas capacidades son compartidas.

Ejemplos:

- Backend + Database
- Backend + Frontend
- Documentation + QA
- Refactoring + Backend
- DevOps + Database

Estas colaboraciones deberán seguir el Communication Protocol.

---

# 11. Capability Validation

Toda modificación de capacidades deberá:

- actualizar esta matriz;
- actualizar las especificaciones de los agentes afectados;
- actualizar la Decision Authority Matrix;
- actualizar los Runtime correspondientes.

---

# 12. Runtime Integration

Los Runtime no podrán redefinir capacidades.

Únicamente implementarán las capacidades descritas en este documento.

---

# 13. Success Criteria

La matriz se considera correcta cuando:

- todas las capacidades tienen un responsable;
- no existen capacidades huérfanas;
- no existen conflictos de autoridad;
- las delegaciones son explícitas;
- los Runtime reutilizan esta matriz sin modificaciones.

---

# 14. Next Documents

Después de esta matriz deberán desarrollarse:

```text
repository-permission-matrix.md

↓

decision-authority-matrix.md

↓

communication-protocol.md

↓

handoff-protocol.md

↓

review-workflow.md
```

---

# Appendix A — Capability Layers

```text
Governance

↓

Engineering

↓

Quality

↓

Operations
```

---

# Appendix B — Capability Principles

- Explicit Responsibility
- Explicit Delegation
- Explicit Validation
- Traceability
- Least Privilege
- Governance by Design
- Platform Independence

---

# End of Document