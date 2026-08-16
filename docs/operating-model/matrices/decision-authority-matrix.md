# Decision Authority Matrix

**Document:** `decision-authority-matrix.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Decision Authority Matrix

---

## Repository Scope

Applies To:

- `/docs`
- `/backend`
- `/frontend`
- `/database`
- `/infrastructure`

---

## Source of Truth

Este documento define la autoridad oficial para la toma de decisiones dentro del ecosistema AI Engineering.

Toda decisión deberá respetar la matriz definida en este documento.

Ningún Runtime, Prompt o configuración de plataforma podrá modificar la autoridad aquí establecida.

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
- matrices/agent-capability-matrix.md
- matrices/repository-permission-matrix.md

### Agent Specifications

- Todos los documentos ubicados en `/docs/agents`

---

## Used By

- Todos los Runtime Specifications
- Communication Protocol
- Handoff Protocol
- Review Workflow
- Platform Configuration

---

## Related Documents

- communication-protocol.md
- handoff-protocol.md
- review-workflow.md

---

# 1. Purpose

Definir quién posee la autoridad para aprobar, rechazar o escalar cada tipo de decisión del proyecto.

---

# 2. Mission

Garantizar que todas las decisiones importantes tengan una autoridad claramente definida, evitando conflictos y decisiones implícitas.

---

# 3. Core Principles

Toda decisión deberá respetar:

- Governance by Design
- Explicit Authority
- Traceability
- Separation of Duties
- Human Oversight for Critical Decisions
- Least Privilege

---

# 4. Decision Categories

Las decisiones se clasifican en:

- Arquitectura
- Planificación
- Desarrollo Backend
- Desarrollo Frontend
- Base de Datos
- IA / DQBot
- Documentación
- Calidad
- Refactoring
- Infraestructura
- Seguridad
- Despliegue
- Emergencias

---

# 5. Decision Roles

| Código | Significado |
|---------|-------------|
| A | Accountable (autoridad final) |
| R | Responsible (ejecuta) |
| V | Validator (valida) |
| C | Consulted (consultado) |
| I | Informed (informado) |

---

# 6. Decision Authority Matrix

| Tipo de decisión | CA | OR | BE | FE | DB | DQ | DOC | QA | REF | DEV |
|------------------|:--:|:--:|:--:|:--:|:--:|:--:|:---:|:--:|:---:|:---:|
| Arquitectura | A | C | I | I | I | I | I | I | C | I |
| Planificación | C | A,R | C | C | C | C | I | I | I | I |
| Backend | I | C | A,R | I | C | I | I | V | C | I |
| Frontend | I | C | I | A,R | I | I | I | V | C | I |
| Base de Datos | C | C | C | I | A,R | I | I | V | I | C |
| DQBot | C | C | C | C | I | A,R | I | V | I | I |
| Documentación | I | I | C | C | C | C | A,R | C | C | I |
| QA | I | C | I | I | I | I | C | A,R | I | I |
| Refactoring | C | C | C | C | C | I | I | V | A,R | I |
| DevOps | C | C | I | I | C | I | I | V | I | A,R |

---

# 7. Escalation Rules

Las siguientes decisiones deberán escalar obligatoriamente al Chief Architect:

- cambios de arquitectura;
- incorporación de tecnologías;
- modificación del Operating Model;
- cambios estructurales del repositorio;
- nuevas categorías de agentes.

---

# 8. Shared Decisions

Cuando una decisión involucre varios dominios:

1. El Orchestrator coordina.
2. El responsable técnico ejecuta.
3. QA valida.
4. Documentation registra.
5. DevOps implementa si corresponde.

---

# 9. Conflict Resolution

Si existen conflictos entre agentes:

```text
Agent

↓

Orchestrator

↓

Chief Architect

↓

Decision

↓

Execution
```

Toda resolución deberá documentarse.

---

# 10. Runtime Integration

Los Runtime deberán consultar esta matriz antes de ejecutar decisiones que excedan su autoridad.

No podrán asumir autoridad adicional.

---

# 11. Success Criteria

La matriz se considera correcta cuando:

- todas las decisiones tienen una autoridad definida;
- no existen conflictos de responsabilidad;
- los mecanismos de escalación son claros;
- los Runtime reutilizan esta matriz sin modificaciones.

---

# 12. Next Documents

Después de esta matriz deberán desarrollarse:

```text
communication-protocol.md

↓

handoff-protocol.md

↓

review-workflow.md

↓

dependency-matrix.md
```

---

# Appendix A — Decision Flow

```text
Need Decision

↓

Identify Category

↓

Validate Authority

↓

Approve

↓

Execute

↓

Document
```

---

# Appendix B — Governance Principles

- Explicit Authority
- Traceability
- Accountability
- Separation of Duties
- Governance by Design
- Continuous Validation

---

# End of Document