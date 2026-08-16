# Event Catalog

**Document:** `event-catalog.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Event Catalog Specification

---

## Repository Scope

Applies To

- `/docs`
- `/backend`
- `/frontend`
- `/database`
- `/workflows`
- `/infrastructure`

---

## Source of Truth

Este documento define el catálogo oficial de eventos del ecosistema AI Engineering.

Todo evento producido por n8n, el Orchestrator, los Runtime o cualquier componente de la plataforma deberá corresponder a una definición contenida en este catálogo.

Los Runtime implementarán estos eventos, pero nunca crearán eventos incompatibles con esta especificación.

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
- process-orchestration-model.md
- communication-protocol.md
- handoff-protocol.md
- review-workflow.md

### Matrices

- agent-capability-matrix.md
- repository-permission-matrix.md
- decision-authority-matrix.md
- dependency-matrix.md

---

## Used By

- n8n Workflows
- Orchestrator Runtime
- Todos los Runtime Specifications
- Platform Configuration
- Monitoring
- Audit Logs

---

## Related Documents

- process-orchestration-model.md
- communication-protocol.md
- task-lifecycle.md

---

# 1. Purpose

Definir el lenguaje común de eventos utilizado por todos los componentes del ecosistema.

---

# 2. Mission

Garantizar que todos los procesos sean dirigidos por eventos estandarizados, independientes del origen de los datos y de la plataforma tecnológica utilizada.

---

# 3. Event Driven Architecture

Todo proceso del sistema comienza con un evento.

```text
External Source

↓

n8n

↓

Standard Event

↓

Orchestrator Runtime

↓

Task Lifecycle

↓

Agent Runtime

↓

Result Event

↓

Next Agent

↓

Completion
```

---

# 4. Event Principles

Todos los eventos deberán cumplir:

- Event Driven
- Stateless
- Immutable
- Traceable
- Idempotent
- Versioned
- Platform Independent
- Documentation First

---

# 5. Event Categories

Los eventos oficiales se clasifican en:

- External Events
- Task Events
- Runtime Events
- Validation Events
- Documentation Events
- Deployment Events
- Monitoring Events
- Error Events
- System Events

---

# 6. Event Structure

Todo evento deberá contener, como mínimo:

| Campo | Descripción |
|--------|-------------|
| Event ID | Identificador único |
| Event Name | Nombre oficial |
| Event Version | Versión |
| Timestamp | Fecha y hora |
| Source | Origen |
| Correlation ID | Relación con Task |
| Task ID | Identificador de tarea |
| Payload | Información asociada |
| Priority | Prioridad |
| Metadata | Información adicional |

---

# 7. External Events

Estos eventos provienen de sistemas externos.

| Event | Trigger |
|--------|----------|
| CSVUploaded | Nuevo CSV disponible |
| APIDataReceived | Datos recibidos desde API |
| ETLCompleted | Finalización de ETL |
| ScheduledJobTriggered | Ejecución programada |
| WebhookReceived | Recepción de Webhook |
| UserRequestReceived | Solicitud del usuario |
| FileImported | Archivo importado |

---

# 8. Task Events

Gestionados por el Orchestrator.

| Event |
|--------|
| TaskCreated |
| TaskClassified |
| TaskAssigned |
| TaskStarted |
| TaskPaused |
| TaskResumed |
| TaskCompleted |
| TaskClosed |
| TaskArchived |

---

# 9. Runtime Events

Emitidos por los Runtime.

| Event |
|--------|
| RuntimeStarted |
| RuntimeCompleted |
| RuntimeWaiting |
| RuntimeFailed |
| RuntimeRetry |
| RuntimeEscalated |

---

# 10. Validation Events

| Event |
|--------|
| ArchitectureApproved |
| QAStarted |
| QAApproved |
| QARejected |
| ValidationCompleted |

---

# 11. Documentation Events

| Event |
|--------|
| DocumentationUpdated |
| MetadataUpdated |
| DocumentationReviewed |

---

# 12. Deployment Events

| Event |
|--------|
| DeploymentRequested |
| DeploymentStarted |
| DeploymentCompleted |
| DeploymentFailed |
| RollbackExecuted |

---

# 13. Monitoring Events

| Event |
|--------|
| HealthCheckPassed |
| HealthCheckFailed |
| PerformanceAlert |
| ResourceThresholdExceeded |

---

# 14. Error Events

| Event |
|--------|
| ValidationError |
| RuntimeError |
| PermissionDenied |
| MissingDependency |
| TimeoutOccurred |
| UnexpectedFailure |

---

# 15. Event Lifecycle

Todo evento seguirá el siguiente ciclo:

```text
Generated

↓

Validated

↓

Published

↓

Consumed

↓

Processed

↓

Archived
```

---

# 16. Event Routing

El modelo oficial de enrutamiento será:

```text
External Source

↓

n8n

↓

Event Bus

↓

Orchestrator Runtime

↓

Task Lifecycle

↓

Agent Runtime

↓

Next Event
```

---

# 17. Event Payload Guidelines

El Payload deberá incluir únicamente la información necesaria para ejecutar la siguiente etapa.

No deberá contener:

- estado interno del agente;
- información duplicada;
- datos sensibles innecesarios.

---

# 18. Correlation Model

Todos los eventos relacionados con una misma tarea compartirán:

- Correlation ID
- Task ID
- Process ID

Esto permitirá reconstruir completamente cualquier proceso.

---

# 19. Versioning Policy

Todo cambio incompatible deberá incrementar la versión del evento.

Los consumidores deberán soportar versiones compatibles.

---

# 20. Runtime Integration

Los Runtime:

- consumirán únicamente eventos oficiales;
- producirán únicamente eventos definidos en este catálogo;
- nunca crearán eventos ad hoc.

---

# 21. n8n Integration

n8n actuará exclusivamente como:

- Event Producer
- Event Router
- Event Scheduler

No contendrá lógica de negocio.

Toda decisión será responsabilidad del Orchestrator.

---

# 22. Future Event Sources

El catálogo permite incorporar sin modificar los Runtime:

- SAP
- Odoo
- Dynamics
- Oracle ERP
- REST APIs
- GraphQL
- Kafka
- RabbitMQ
- Azure Service Bus
- AWS EventBridge
- SFTP
- FTP
- S3
- IoT Devices

Todos ellos deberán traducirse a eventos estándar.

---

# 23. Success Criteria

El catálogo se considera correctamente implementado cuando:

- todos los procesos comienzan por un evento;
- todos los Runtime consumen eventos estándar;
- n8n no contiene lógica de negocio;
- existe trazabilidad completa;
- los eventos son reutilizables independientemente del origen.

---

# 24. Next Phase

Con este documento queda formalmente completado el **Operating Model**.

La siguiente fase del proyecto será:

```text
Runtime Specifications

↓

orchestrator-runtime.md

↓

chief-architect-runtime.md

↓

database-runtime.md

↓

backend-runtime.md

↓

frontend-runtime.md

↓

dqbot-runtime.md

↓

qa-runtime.md

↓

documentation-runtime.md

↓

refactoring-runtime.md

↓

devops-runtime.md
```

---

# Appendix A — Complete Event Flow

```text
External Event

↓

n8n

↓

Standard Event

↓

Orchestrator

↓

Task

↓

Agent Runtime

↓

Validation

↓

Next Event

↓

Completion
```

---

# Appendix B — Event Principles

- Event Driven Architecture
- Stateless Execution
- Documentation First
- Platform Independence
- Traceability
- Idempotency
- Versioning
- Loose Coupling
- Single Source of Truth
- Governance by Design

---

# End of Document