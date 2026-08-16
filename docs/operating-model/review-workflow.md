# Review Workflow

**Document:** `review-workflow.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Review Workflow Specification

---

## Repository Scope

Applies To:

- `/backend`
- `/frontend`
- `/database`
- `/docs`
- `/infrastructure`

---

## Source of Truth

Este documento define el flujo oficial de revisión para todas las tareas ejecutadas dentro del ecosistema AI Engineering.

Toda implementación, modificación documental, cambio arquitectónico o despliegue deberá seguir este flujo.

Los Runtime implementarán este proceso, pero no podrán modificarlo.

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
- communication-protocol.md
- handoff-protocol.md

### Matrices

- matrices/agent-capability-matrix.md
- matrices/repository-permission-matrix.md
- matrices/decision-authority-matrix.md

### Agent Specifications

- Todos los documentos de `/docs/agents`

---

## Used By

- Todos los Runtime Specifications
- Todos los agentes
- Todos los Prompts

---

## Related Documents

- communication-protocol.md
- handoff-protocol.md

---

# 1. Purpose

Definir un flujo único y repetible para revisar, validar y aprobar cualquier trabajo realizado por los agentes.

---

# 2. Mission

Garantizar que toda tarea sea revisada con criterios homogéneos antes de considerarse finalizada.

---

# 3. Core Principles

Toda revisión deberá respetar:

- Documentation First
- Architecture Before Implementation
- Quality by Design
- Traceability
- Independent Validation
- Continuous Improvement
- Explicit Approval

---

# 4. Review Philosophy

Una revisión no busca únicamente detectar errores.

Su objetivo es verificar que la solución:

- cumple los requisitos;
- respeta la arquitectura;
- mantiene la calidad;
- preserva la documentación;
- puede evolucionar.

---

# 5. Review Workflow

```text
Task Completed

↓

Self Validation

↓

Architecture Review (si aplica)

↓

Technical Review

↓

QA Review

↓

Documentation Review

↓

Operational Review

↓

Final Approval

↓

Task Closed
```

---

# 6. Review Categories

## Architecture Review

Responsable:

Chief Architect

---

## Technical Review

Responsable:

Agente especialista correspondiente.

---

## Database Review

Responsable:

Database Agent

---

## Documentation Review

Responsable:

Documentation Agent

---

## QA Review

Responsable:

QA Agent

---

## Operational Review

Responsable:

DevOps Agent

---

# 7. Review Checklist

Toda revisión verificará:

- cumplimiento funcional;
- cumplimiento arquitectónico;
- calidad del código;
- documentación actualizada;
- pruebas ejecutadas;
- permisos respetados;
- impacto conocido;
- criterios de aceptación cumplidos.

---

# 8. Review Outcomes

Cada revisión podrá finalizar como:

```text
Approved

Approved with Observations

Rejected

Requires Architecture Review
```

---

# 9. Rejection Workflow

```text
Rejected

↓

Return to Previous Owner

↓

Corrections

↓

New Review

↓

Approval
```

---

# 10. Approval Gates

Son obligatorios para:

- cambios arquitectónicos;
- migraciones;
- despliegues;
- cambios en documentación estructural;
- modificaciones del Operating Model.

---

# 11. Review Evidence

Cada revisión deberá registrar:

- revisor;
- fecha;
- resultado;
- observaciones;
- acciones requeridas;
- evidencia.

---

# 12. Runtime Integration

Los Runtime utilizarán este flujo sin redefinir etapas.

---

# 13. Success Criteria

El Review Workflow se considera correctamente implementado cuando:

- todas las tareas son revisadas;
- existe trazabilidad completa;
- ningún cambio llega a producción sin validación;
- todas las aprobaciones quedan registradas.

---

# 14. Next Document

El siguiente documento será:

```text
matrices/dependency-matrix.md
```

---

# Appendix A — Review Lifecycle

```text
Execute

↓

Review

↓

Validate

↓

Approve

↓

Close
```

---

# Appendix B — Review Principles

- Independent Validation
- Documentation First
- Architecture First
- Quality by Design
- Traceability
- Continuous Improvement

---

# End of Document