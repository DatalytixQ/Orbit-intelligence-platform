# Repository Permission Matrix

**Document:** `repository-permission-matrix.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Repository Permission Matrix

---

## Repository Scope

Applies To:

- `/backend`
- `/frontend`
- `/docs`
- `/scripts`
- `/database`
- Infrastructure

---

## Source of Truth

Este documento define oficialmente los permisos de acceso al repositorio para todos los agentes del ecosistema AI Engineering.

Toda operación sobre archivos, carpetas o recursos deberá respetar esta matriz.

Ningún Runtime podrá ampliar permisos definidos aquí.

---

## Depends On

### Operating Model

- architecture-review.md
- ai-engineering-operating-model.md
- task-lifecycle.md
- matrices/agent-capability-matrix.md

### Agents

- Todos los documentos ubicados en `/docs/agents`

---

## Used By

- Runtime Specifications
- Communication Protocol
- Handoff Protocol
- Platform Configuration

---

## Related Documents

- decision-authority-matrix.md
- communication-protocol.md
- handoff-protocol.md

---

# 1. Purpose

Definir los permisos oficiales que posee cada agente sobre el repositorio.

Los permisos determinan dónde puede leer, crear, modificar, mover o aprobar cambios.

---

# 2. Mission

Garantizar que ningún agente actúe fuera de su ámbito autorizado.

Aplicar el principio de **Least Privilege**.

---

# 3. Permission Model

Cada permiso utiliza los siguientes códigos:

| Código | Significado |
|---------|-------------|
| R | Read |
| W | Write |
| C | Create |
| M | Move |
| D | Delete |
| A | Approve |
| - | No autorizado |

---

# 4. Permission Principles

Todo permiso deberá respetar:

- Least Privilege
- Explicit Authorization
- Traceability
- Documentation First
- Governance by Design

---

# 5. Repository Areas

Las áreas oficiales del repositorio son:

```text
/backend

/frontend

/docs

/database

/scripts

/infrastructure

/tests

/.github
```

---

# 6. Repository Permission Matrix

| Área | CA | OR | BE | FE | DB | DQ | DOC | QA | REF | DEV |
|------|:--:|:--:|:--:|:--:|:--:|:--:|:---:|:--:|:---:|:---:|
| /backend | R,A | R | R,W,C | R | R | R | R | R | R,W,M | R |
| /frontend | R,A | R | R | R,W,C | R | R | R | R | R,W,M | R |
| /database | R,A | R | R | - | R,W,C | R | R | R | R | R |
| /docs | R | R | R | R | R | R | R,W,C,M | R | R | R |
| /scripts | R | R | R,W | R | R | - | R | R | R | R,W,C |
| /tests | R | R | R,W | R,W | R,W | R | R | R,W,C | R | R |
| /.github | R,A | R | - | - | - | - | - | R | - | R,W,C |

---

# 7. Restricted Operations

Las siguientes operaciones requieren aprobación explícita:

- mover módulos principales;
- eliminar carpetas;
- modificar arquitectura;
- alterar pipelines;
- cambiar estructura documental;
- modificar Runtime comunes.

---

# 8. Shared Ownership

Algunas áreas tienen propiedad compartida.

Ejemplos:

- `/backend` → Backend + Refactoring
- `/docs` → Documentation + Chief Architect
- `/database` → Database + DevOps

---

# 9. Permission Escalation

Cuando un agente requiera permisos superiores:

```text
Agent

↓

Orchestrator

↓

Chief Architect

↓

Approval

↓

Execution
```

---

# 10. Validation Rules

Antes de aplicar cambios deberá verificarse:

- permisos válidos;
- documentación actualizada;
- trazabilidad;
- aprobación requerida;
- impacto arquitectónico.

---

# 11. Runtime Integration

Los Runtime deberán consultar esta matriz antes de modificar cualquier recurso.

No podrán otorgarse permisos adicionales mediante prompts.

---

# 12. Success Criteria

La matriz se considera correcta cuando:

- todos los recursos poseen propietario;
- no existen conflictos de escritura;
- las responsabilidades son explícitas;
- los Runtime reutilizan esta matriz sin modificaciones.

---

# 13. Next Documents

Después de esta matriz deberán desarrollarse:

```text
decision-authority-matrix.md

↓

communication-protocol.md

↓

handoff-protocol.md

↓

review-workflow.md
```

---

# Appendix A — Permission Principles

- Least Privilege
- Explicit Authorization
- Traceability
- Governance
- Separation of Duties
- Documentation First

---

# Appendix B — Permission Lifecycle

```text
Request

↓

Permission Validation

↓

Approval

↓

Execution

↓

Audit
```

---

# End of Document