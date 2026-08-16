# Handoff Protocol

**Document:** `handoff-protocol.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Agent Handoff Protocol

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

Este documento define el protocolo oficial para la transferencia de responsabilidad entre agentes del ecosistema AI Engineering.

Todo Runtime deberá implementar este protocolo.

Ninguna tarea podrá cambiar de responsable fuera del flujo definido en este documento.

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

### Matrices

- matrices/agent-capability-matrix.md
- matrices/repository-permission-matrix.md
- matrices/decision-authority-matrix.md

### Agents

Todos los documentos ubicados en:

```text
/docs/agents
```

---

## Used By

- Todos los Runtime Specifications
- Todos los agentes
- Review Workflow

---

## Related Documents

- communication-protocol.md
- review-workflow.md

---

# 1. Purpose

Definir el mecanismo oficial para transferir una tarea entre agentes preservando contexto, trazabilidad y responsabilidad.

---

# 2. Mission

Garantizar que ningún cambio de responsable provoque pérdida de información, ambigüedad o interrupción del flujo de trabajo.

---

# 3. Core Principles

Todo handoff deberá respetar:

- Documentation First
- Explicit Context
- Explicit Responsibility
- Traceability
- No Hidden Knowledge
- Single Owner
- Validation Before Transfer

---

# 4. Handoff Philosophy

Un handoff no consiste únicamente en entregar trabajo.

Consiste en transferir:

- responsabilidad;
- contexto;
- estado;
- riesgos;
- próximos pasos;
- documentación.

---

# 5. Handoff Lifecycle

```text
Task Ready

↓

Validate Current State

↓

Prepare Context

↓

Transfer Ownership

↓

Confirm Reception

↓

Continue Execution
```

---

# 6. Handoff Types

## Governance Handoff

Chief Architect ↔ Orchestrator

---

## Engineering Handoff

Orchestrator → Backend

Orchestrator → Frontend

Orchestrator → Database

Orchestrator → DQBot

---

## Validation Handoff

Engineering → QA

---

## Documentation Handoff

QA → Documentation

---

## Deployment Handoff

Documentation → DevOps

---

## Closure Handoff

DevOps → Orchestrator

---

# 7. Mandatory Handoff Package

Todo handoff deberá incluir:

- Task ID
- Estado actual
- Objetivo
- Cambios realizados
- Riesgos conocidos
- Documentación relacionada
- Archivos afectados
- Próxima acción esperada
- Criterios de aceptación pendientes

Nunca deberá transferirse una tarea sin este paquete mínimo.

---

# 8. Ownership Rules

Durante un handoff:

- existe un único responsable activo;
- la responsabilidad anterior finaliza únicamente cuando el receptor confirma la recepción;
- la responsabilidad nunca queda sin propietario.

---

# 9. Validation Before Handoff

Antes de transferir una tarea deberá verificarse:

- compilación (si aplica);
- documentación actualizada;
- pruebas ejecutadas (cuando corresponda);
- estado registrado;
- contexto completo.

---

# 10. Handoff Acceptance

El agente receptor deberá:

- validar el contexto recibido;
- confirmar comprensión;
- aceptar la responsabilidad;
- registrar la recepción.

Si la información es insuficiente, el handoff será rechazado.

---

# 11. Failed Handoff

Cuando un handoff falle:

```text
Reject

↓

Return to Previous Owner

↓

Complete Missing Information

↓

Retry Handoff
```

Nunca continuará una tarea con contexto incompleto.

---

# 12. Traceability

Cada handoff registrará:

- agente origen;
- agente destino;
- fecha;
- hora;
- estado;
- motivo;
- resultado.

---

# 13. Runtime Integration

Todos los Runtime deberán implementar este protocolo.

No podrán crear mecanismos alternativos para transferir responsabilidades.

---

# 14. Success Criteria

El protocolo se considera correctamente implementado cuando:

- nunca existen tareas sin responsable;
- todos los cambios de responsable son auditables;
- el contexto se preserva íntegramente;
- la documentación acompaña cada transferencia.

---

# 15. Next Document

El siguiente documento será:

```text
review-workflow.md
```

Este documento definirá el proceso oficial de revisión del ecosistema.

---

# Appendix A — Standard Handoff

```text
Validate

↓

Prepare Context

↓

Transfer

↓

Confirm

↓

Execute
```

---

# Appendix B — Handoff Principles

- Explicit Ownership
- Context Preservation
- Traceability
- Documentation First
- Validation Before Transfer
- Continuous Responsibility

---

# End of Document