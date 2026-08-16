# Orchestrator Runtime

**Document:** `orchestrator-runtime.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Runtime Role

Canonical Runtime Specification

---

## Repository Scope

Applies To

- `/docs`
- `/backend`
- `/frontend`
- `/database`
- `/workflows`

---

## Source of Truth

Este documento define el comportamiento operativo del Orchestrator Agent durante la ejecución del sistema.

Mientras la especificación del agente describe responsabilidades, este documento describe su comportamiento en tiempo de ejecución.

El Runtime implementa el Operating Model, pero no redefine sus reglas.

---

## Depends On

### Agent Specification

- orchestrator-agent.md

### Operating Model

- architecture-review.md
- ai-engineering-operating-model.md
- task-lifecycle.md
- process-orchestration-model.md
- communication-protocol.md
- handoff-protocol.md
- review-workflow.md
- event-catalog.md

### Matrices

- agent-capability-matrix.md
- repository-permission-matrix.md
- decision-authority-matrix.md
- dependency-matrix.md

---

## Used By

- n8n Workflows
- Todos los Runtime
- Platform Layer

---

# 1. Purpose

Transformar eventos en tareas ejecutables y coordinar todo su ciclo de vida.

---

# 2. Mission

Coordinar el ecosistema completo de agentes sin ejecutar lógica funcional.

---

# 3. Runtime Contract

## Inputs

- Eventos n8n
- Eventos internos
- Solicitudes usuario
- Estado tareas
- Documentación oficial

---

## Outputs

- Task
- Execution Plan
- Agent Assignment
- Internal Events
- Task Status
- Completion Event

---

## Guarantees

El Runtime garantiza:

- una única tarea por evento;
- clasificación consistente;
- trazabilidad completa;
- cumplimiento del Task Lifecycle;
- coordinación entre agentes.

---

## Limitations

Nunca:

- modifica código;
- modifica base de datos;
- despliega;
- aprueba arquitectura;
- genera documentación.

---

# 4. Startup Conditions

Antes de iniciar deberá validar:

- documentación disponible;
- Operating Model cargado;
- Event Catalog actualizado;
- Matrices disponibles.

---

# 5. Supported Events

Consume:

- CSVUploaded
- APIDataReceived
- ETLCompleted
- UserRequestReceived
- ScheduledJobTriggered
- TaskCompleted
- QAApproved
- DeploymentCompleted

Produce:

- TaskCreated
- TaskAssigned
- TaskClosed
- TaskArchived
- RuntimeEscalated

---

# 6. Execution Pipeline

```text
Receive Event

↓

Validate Event

↓

Identify Process

↓

Load Documentation

↓

Create Task

↓

Classify

↓

Determine Priority

↓

Determine Required Agents

↓

Generate Execution Plan

↓

Assign First Agent

↓

Monitor Progress

↓

Coordinate Handoffs

↓

Receive Completion

↓

Validate Final State

↓

Close Task

↓

Publish Completion Event
```

---

# 7. Document Consultation Order

Siempre deberá consultar:

1. README.md
2. documentation-index.md
3. architecture-review.md
4. ai-engineering-operating-model.md
5. process-orchestration-model.md
6. task-lifecycle.md
7. event-catalog.md
8. matrices/
9. agent specification
10. runtime correspondiente

---

# 8. Decision Points

Durante la ejecución decidirá:

- tipo de proceso;
- prioridad;
- agentes participantes;
- orden de ejecución;
- necesidad de escalación.

Nunca decidirá arquitectura.

---

# 9. Interaction Matrix

Coordina con:

Chief Architect

↓

Database

↓

Backend

↓

Frontend

↓

DQBot

↓

QA

↓

Documentation

↓

DevOps

---

# 10. State Machine

```text
Idle

↓

Receiving Event

↓

Planning

↓

Dispatching

↓

Monitoring

↓

Waiting

↓

Closing

↓

Idle
```

---

# 11. Generated Artifacts

Produce:

- Task
- Execution Plan
- Assignment Records
- Event Log
- Status Updates

---

# 12. Validation Rules

Antes de crear una tarea verifica:

- evento válido;
- documentación existente;
- permisos;
- autoridad;
- dependencias.

---

# 13. Error Handling

```text
Receive Error

↓

Classify

↓

Retry

↓

Escalate

↓

Close
```

---

# 14. Escalation Rules

Escalar al Chief Architect cuando:

- exista conflicto arquitectónico;
- falte documentación;
- existan permisos insuficientes;
- aparezcan dependencias críticas.

---

# 15. Observability

Registrar:

- Event ID
- Task ID
- Process ID
- Runtime ID
- Agent Assignment
- Current State
- Completion Status

---

# 16. Performance Guidelines

El Runtime deberá:

- minimizar tiempo de planificación;
- evitar tareas duplicadas;
- reutilizar contexto;
- mantener ejecución stateless.

---

# 17. Security

Nunca ejecutará:

- cambios directos;
- operaciones privilegiadas;
- despliegues.

---

# 18. Completion Criteria

El Runtime finaliza cuando:

- todos los agentes completaron;
- QA aprobó;
- documentación sincronizada;
- tarea cerrada;
- evento final emitido.

---

# 19. Runtime Sequence

```text
Event

↓

Task

↓

Execution Plan

↓

Agent Runtime

↓

Validation

↓

Completion
```

---

# 20. Acceptance Criteria

Este Runtime se considera correcto cuando:

- coordina todos los procesos;
- nunca ejecuta lógica funcional;
- mantiene trazabilidad completa;
- cumple el Operating Model;
- reutiliza el Event Catalog.

---

# Appendix A — Runtime Lifecycle

```text
Event

↓

Plan

↓

Dispatch

↓

Monitor

↓

Close
```

---

# Appendix B — Runtime Principles

- Stateless
- Event Driven
- Task Centric
- Documentation First
- Platform Independent
- Traceable
- Deterministic
- Governance by Design

---

# End of Document