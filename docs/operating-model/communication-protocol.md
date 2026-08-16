# Communication Protocol

**Document:** `communication-protocol.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Agent Communication Protocol

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

Este documento define el protocolo oficial de comunicación entre todos los agentes del ecosistema AI Engineering.

Toda colaboración, intercambio de información, coordinación de tareas y sincronización de estados deberá respetar este protocolo.

Los Runtime Specifications implementarán este protocolo, pero nunca podrán modificarlo.

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
- matrices/decision-authority-matrix.md

### Agent Specifications

- Todos los documentos ubicados en `/docs/agents`

---

## Used By

- Todos los Runtime Specifications
- Todos los Prompts
- Todos los agentes

---

## Related Documents

- handoff-protocol.md
- review-workflow.md

---

# 1. Purpose

Definir un protocolo único de comunicación para garantizar que todos los agentes colaboren de forma consistente, trazable y desacoplada.

---

# 2. Mission

Garantizar que cualquier interacción entre agentes:

- preserve el contexto;
- mantenga la trazabilidad;
- respete la autoridad definida;
- facilite la auditoría.

---

# 3. Communication Principles

Toda comunicación deberá respetar:

- Documentation First
- Single Source of Truth
- Explicit Context
- Explicit Responsibility
- Explicit Outcome
- Traceability
- Stateless Collaboration
- No Hidden Knowledge

---

# 4. Communication Model

Los agentes nunca colaboran mediante conocimiento implícito.

Toda comunicación deberá apoyarse en:

- documentos;
- tareas;
- estados;
- eventos;
- resultados.

---

# 5. Communication Types

## Request

Solicitud de ejecución.

---

## Response

Resultado de una solicitud.

---

## Delegation

Transferencia de ejecución.

---

## Review

Solicitud de revisión.

---

## Validation

Resultado de una validación.

---

## Approval

Autorización formal.

---

## Notification

Información sin necesidad de respuesta.

---

## Escalation

Solicitud de decisión superior.

---

# 6. Communication Flow

```text
Request

↓

Context Validation

↓

Execution

↓

Validation

↓

Response

↓

Documentation

↓

Close
```

---

# 7. Mandatory Context

Toda comunicación deberá incluir:

- Task ID
- Tipo de tarea
- Estado actual
- Agente origen
- Agente destino
- Objetivo
- Resultado esperado
- Documentación relacionada

Nunca deberán enviarse solicitudes sin contexto.

---

# 8. Event Model

Eventos oficiales del sistema:

```text
TaskCreated

TaskClassified

ArchitectureApproved

TaskAssigned

ImplementationStarted

ImplementationCompleted

QAStarted

QAApproved

DocumentationUpdated

DeploymentStarted

DeploymentCompleted

TaskClosed

TaskArchived
```

---

# 9. Collaboration Rules

Los agentes deberán:

- consultar documentación antes de actuar;
- evitar duplicar trabajo;
- respetar la autoridad definida;
- registrar decisiones relevantes.

---

# 10. Escalation Rules

Las siguientes situaciones requieren escalación:

- conflicto de autoridad;
- conflicto de arquitectura;
- permisos insuficientes;
- ambigüedad documental;
- impacto transversal.

---

# 11. Error Handling

Cuando ocurra un error:

```text
Detect

↓

Classify

↓

Notify

↓

Escalate

↓

Resolve

↓

Document

↓

Resume
```

---

# 12. Runtime Integration

Los Runtime deberán implementar este protocolo como mecanismo estándar de interacción.

No podrán crear canales alternativos de comunicación.

---

# 13. Success Criteria

El protocolo se considera correctamente implementado cuando:

- todas las comunicaciones son trazables;
- ningún agente depende de conocimiento implícito;
- las decisiones quedan registradas;
- los eventos representan el estado real de las tareas.

---

# 14. Next Documents

Después de este documento deberán desarrollarse:

```text
handoff-protocol.md

↓

review-workflow.md

↓

dependency-matrix.md
```

---

# Appendix A — Communication Lifecycle

```text
Need

↓

Request

↓

Execution

↓

Validation

↓

Documentation

↓

Completion
```

---

# Appendix B — Communication Principles

- Explicit Context
- Explicit Responsibility
- Traceability
- Stateless Collaboration
- Documentation First
- Platform Independence
- Governance by Design

---

# End of Document