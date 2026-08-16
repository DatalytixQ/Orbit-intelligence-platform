# QA Runtime

**Document:** `qa-runtime.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Runtime Specification

---

## Runtime Role

QA Runtime constituye la implementación operacional del **QA Agent** dentro del ecosistema AI Engineering.

Mientras `qa-agent.md` define las responsabilidades, capacidades y límites del agente, este documento define su comportamiento durante la ejecución de tareas, validaciones y procesos de aseguramiento de calidad.

El QA Runtime implementa el Operating Model y nunca redefine sus reglas.

---

## Repository Scope

Applies To

- `/backend`
- `/frontend`
- `/database`
- `/docs`
- `/tests`
- `/workflows`

Puede interactuar indirectamente con:

- Unit Tests
- Integration Tests
- End-to-End Tests
- API Testing
- UI Testing
- Performance Testing
- Security Testing
- Observability Platform

---

## Source of Truth

Este documento constituye la especificación oficial del comportamiento operativo del QA Runtime.

Toda validación funcional, técnica, arquitectónica y documental deberá seguir las reglas definidas en este Runtime.

Los Prompts y la Platform Layer implementarán este comportamiento, pero nunca modificarán sus reglas.

---

## Depends On

### Core Documentation

- README.md
- documentation-index.md
- AGENTS.md

---

### Business Documentation

- business/functional.md
- business/api.md
- business/database.md
- business/kpi.md
- business/rules-engine.md

---

### Architecture

- architecture/project-governance.md
- architecture/repository-structure.md
- architecture/technology-stack.md
- architecture/migration-plan.md

---

### Operating Model

- operating-model/architecture-review.md
- operating-model/ai-engineering-operating-model.md
- operating-model/task-lifecycle.md
- operating-model/process-orchestration-model.md
- operating-model/event-catalog.md
- operating-model/communication-protocol.md
- operating-model/handoff-protocol.md
- operating-model/review-workflow.md

---

### Matrices

- operating-model/matrices/agent-capability-matrix.md
- operating-model/matrices/repository-permission-matrix.md
- operating-model/matrices/decision-authority-matrix.md
- operating-model/matrices/dependency-matrix.md

---

### Agent Specification

- agents/specifications/qa-agent.md

---

### Runtime Dependencies

- agents/runtime/orchestrator-runtime.md
- agents/runtime/database-runtime.md
- agents/runtime/backend-runtime.md
- agents/runtime/frontend-runtime.md
- agents/runtime/dqbot-runtime.md

---

## Used By

Este Runtime es utilizado por:

- Orchestrator Runtime
- Documentation Runtime
- DevOps Runtime
- Todos los Runtime especializados

---

## Related Documents

- operating-model/review-workflow.md
- operating-model/task-lifecycle.md
- operating-model/event-catalog.md
- agents/runtime/backend-runtime.md
- agents/runtime/frontend-runtime.md

---

# 1. Purpose

Definir el comportamiento operativo del QA Runtime durante la validación de entregables, procesos, componentes y documentación.

El QA Runtime constituye la autoridad responsable de verificar que toda implementación cumpla los criterios funcionales, técnicos, arquitectónicos y documentales definidos por el proyecto.

---

# 2. Mission

Garantizar que ningún cambio avance hacia producción sin haber sido validado de forma objetiva, reproducible y trazable.

El QA Runtime será responsable de:

- validar funcionalidades;
- validar APIs;
- validar modelos de datos;
- validar componentes UI;
- validar procesos conversacionales;
- validar documentación;
- generar evidencia;
- emitir resultados de aprobación o rechazo.

Nunca implementará funcionalidades ni modificará código.

---

# 3. Runtime Contract

## Inputs

El Runtime puede recibir:

- Tasks asignadas por el Orchestrator Runtime.
- Eventos RuntimeCompleted.
- Solicitudes de revisión.
- Casos de prueba.
- Evidencias de ejecución.
- Resultados de compilación.
- Resultados de despliegue.
- Documentación actualizada.

---

## Outputs

El Runtime podrá producir:

- QAStarted
- TestExecutionCompleted
- ValidationPassed
- ValidationFailed
- QualityReportGenerated
- ApprovalGranted
- ApprovalRejected
- RuntimeCompleted
- RuntimeFailed

---

## Guarantees

El QA Runtime garantiza:

- validaciones reproducibles;
- evidencia verificable;
- trazabilidad completa;
- cumplimiento del Operating Model;
- independencia respecto de la implementación;
- criterios objetivos de aceptación.

---

## Limitations

Este Runtime nunca deberá:

- modificar código;
- modificar documentación;
- modificar infraestructura;
- alterar reglas de negocio;
- aprobar cambios sin evidencia;
- omitir validaciones obligatorias.

---

# 4. Startup Conditions

Antes de iniciar cualquier ejecución deberá verificar:

## Documentación

- documentación disponible;
- criterios de aceptación definidos;
- casos de prueba disponibles.

---

## Runtime Dependencies

Debe validar disponibilidad de:

- Orchestrator Runtime;
- Backend Runtime;
- Frontend Runtime;
- Database Runtime;
- DQBot Runtime;
- Event Catalog;
- Task Lifecycle.

---

## Infraestructura

Debe verificar:

- entorno de pruebas disponible;
- herramientas de testing;
- acceso a reportes;
- observabilidad habilitada.

---

## Seguridad

Debe validar:

- permisos suficientes;
- acceso a evidencia;
- credenciales de prueba.

---

## Contexto

Debe disponer de:

- Task ID;
- Event ID;
- Correlation ID;
- Process ID;
- Test Plan;
- Runtime Context.

---

# 5. Supported Events

## Consumed Events

- TaskAssigned
- RuntimeCompleted
- DeploymentCompleted
- BackendReady
- FrontendReady
- DQBotReady
- RuntimeRetry
- RuntimeEscalated

---

## Produced Events

- QAStarted
- TestExecutionCompleted
- ValidationPassed
- ValidationFailed
- ApprovalGranted
- ApprovalRejected
- RuntimeCompleted
- RuntimeFailed

---

# 6. Business Process Participation

Este Runtime participa en los siguientes procesos oficiales definidos en:

`process-orchestration-model.md`

---

## Functional Validation

Responsabilidades:

- validar funcionalidades;
- verificar reglas de negocio;
- comprobar escenarios funcionales;
- validar criterios de aceptación.

---

## Technical Validation

Responsabilidades:

- validar APIs;
- validar base de datos;
- validar Frontend;
- validar integraciones;
- validar Runtime especializados.

---

## Regression Testing

Responsabilidades:

- ejecutar pruebas de regresión;
- detectar impactos;
- validar compatibilidad;
- garantizar estabilidad.

---

## Quality Assurance

Responsabilidades:

- generar evidencia;
- consolidar resultados;
- emitir aprobación o rechazo;
- mantener trazabilidad completa.

---

# 7. Execution Pipeline

Todo proceso ejecutado por el QA Runtime deberá seguir el siguiente flujo operacional.

```text
Task Assigned

↓

Validate Runtime Context

↓

Validate Dependencies

↓

Load Documentation Context

↓

Validate Repository Permissions

↓

Receive RuntimeCompleted Event

↓

Identify Validation Scope

↓

Load Acceptance Criteria

↓

Prepare Test Environment

↓

Execute Validation Plan

↓

Execute Unit Tests

↓

Execute Integration Tests

↓

Execute End-to-End Tests

↓

Execute Documentation Validation

↓

Execute Architecture Validation

↓

Consolidate Results

↓

Generate Quality Report

↓

Notify Orchestrator

↓

Emit Validation Result

↓

Await Next Task
```

Ninguna etapa podrá omitirse salvo autorización explícita del Orchestrator Runtime y únicamente cuando el Task Lifecycle lo permita.

---

# 8. Document Consultation Order

Antes de ejecutar cualquier validación deberá consultar la documentación oficial en el siguiente orden.

## Nivel 1 — Core

```text
README.md

↓

documentation-index.md

↓

AGENTS.md
```

---

## Nivel 2 — Business

```text
business/functional.md

↓

business/api.md

↓

business/database.md

↓

business/kpi.md

↓

business/rules-engine.md
```

---

## Nivel 3 — Architecture

```text
architecture/project-governance.md

↓

architecture/repository-structure.md

↓

architecture/technology-stack.md

↓

architecture/migration-plan.md
```

---

## Nivel 4 — Operating Model

```text
architecture-review.md

↓

ai-engineering-operating-model.md

↓

task-lifecycle.md

↓

process-orchestration-model.md

↓

event-catalog.md

↓

communication-protocol.md

↓

handoff-protocol.md

↓

review-workflow.md
```

---

## Nivel 5 — Matrices

```text
agent-capability-matrix.md

↓

repository-permission-matrix.md

↓

decision-authority-matrix.md

↓

dependency-matrix.md
```

---

## Nivel 6 — Agent Specification

```text
agents/specifications/qa-agent.md
```

---

## Nivel 7 — Runtime Specifications

```text
orchestrator-runtime.md

↓

database-runtime.md

↓

backend-runtime.md

↓

frontend-runtime.md

↓

dqbot-runtime.md
```

---

# 9. Decision Points

Durante la ejecución el QA Runtime únicamente podrá tomar decisiones relacionadas con la validación y aseguramiento de calidad.

---

## Validation Scope

Determinar:

- validación funcional;
- validación técnica;
- validación documental;
- validación arquitectónica;
- validación de seguridad;
- validación de rendimiento.

---

## Test Strategy

Seleccionar:

- pruebas unitarias;
- pruebas de integración;
- pruebas end-to-end;
- pruebas de regresión;
- pruebas manuales;
- pruebas automatizadas.

---

## Acceptance Evaluation

Determinar:

- criterios cumplidos;
- criterios incumplidos;
- observaciones;
- riesgos;
- necesidad de nueva revisión.

---

## Defect Classification

Clasificar:

- defecto crítico;
- defecto mayor;
- defecto menor;
- observación;
- mejora recomendada.

---

## Approval Decision

Determinar:

- aprobación;
- aprobación con observaciones;
- rechazo;
- revalidación requerida.

---

## Escalation Decision

Escalar cuando:

- exista incumplimiento arquitectónico;
- existan defectos críticos;
- la documentación sea inconsistente;
- los criterios de aceptación sean ambiguos;
- exista conflicto entre resultados de validación.

---

# 10. Interaction With Other Agents

## Orchestrator Runtime

Responsabilidades compartidas:

- recepción de tareas;
- coordinación de validaciones;
- actualización de estados;
- cierre del proceso.

Eventos intercambiados:

```text
TaskAssigned

↓

ValidationPassed / ValidationFailed

↓

RuntimeCompleted
```

---

## Database Runtime

Valida:

- integridad de datos;
- consistencia del modelo;
- resultados de migraciones;
- actualización de la Semantic Layer.

---

## Backend Runtime

Valida:

- contratos API;
- reglas de negocio;
- respuestas;
- eventos;
- rendimiento.

---

## Frontend Runtime

Valida:

- componentes;
- navegación;
- accesibilidad;
- experiencia de usuario;
- dashboards.

---

## DQBot Runtime

Valida:

- precisión de respuestas;
- trazabilidad;
- recuperación de conocimiento;
- calidad conversacional;
- evidencia documental.

---

## Documentation Runtime

Entrega:

- observaciones documentales;
- inconsistencias detectadas;
- solicitudes de actualización.

Recibe:

- documentación actualizada;
- evidencias;
- historial de cambios.

---

## DevOps Runtime

Coordina:

- ambientes de prueba;
- pipelines de validación;
- evidencia de despliegue;
- métricas de calidad.

---

# 11. Validation Rules

Antes de finalizar cualquier validación deberán ejecutarse todas las verificaciones definidas.

---

## Functional Validation

Verificar:

- cumplimiento funcional;
- reglas de negocio;
- escenarios de uso;
- criterios de aceptación.

---

## Technical Validation

Verificar:

- APIs;
- servicios;
- integraciones;
- persistencia;
- eventos.

---

## Documentation Validation

Verificar:

- documentación actualizada;
- consistencia;
- referencias;
- cobertura.

---

## Architecture Validation

Verificar:

- cumplimiento del Operating Model;
- arquitectura definida;
- separación de responsabilidades;
- contratos.

---

## Security Validation

Verificar:

- autenticación;
- autorización;
- protección de datos;
- controles de acceso.

---

## Performance Validation

Verificar:

- tiempos de respuesta;
- consumo de recursos;
- escalabilidad;
- estabilidad.

---

## Regression Validation

Verificar:

- ausencia de regresiones;
- compatibilidad;
- estabilidad funcional.

---

## Evidence Validation

Confirmar que toda validación dispone de:

- evidencia;
- resultados;
- trazabilidad;
- responsable;
- fecha de ejecución.

---

## Event Validation

Confirmar emisión correcta de:

```text
QAStarted

↓

TestExecutionCompleted

↓

ValidationPassed / ValidationFailed

↓

RuntimeCompleted
```

---

# 12. Error Handling

Toda excepción seguirá el modelo operativo oficial.

---

## Error Detection

```text
Detect

↓

Classify

↓

Record
```

---

## Error Classification

Clasificar como:

- Test Failure
- Validation Error
- Documentation Error
- Architecture Error
- Security Error
- Performance Error
- Environment Error
- Runtime Error

---

## Recovery Flow

```text
Error

↓

Collect Evidence

↓

Generate Findings

↓

Notify Orchestrator

↓

Await Resolution
```

---

## Retry Policy

Únicamente podrán reintentarse automáticamente:

- fallos temporales del entorno;
- timeout;
- indisponibilidad temporal de servicios;
- errores transitorios de infraestructura.

Nunca:

- incumplimientos funcionales;
- defectos críticos;
- incumplimientos arquitectónicos;
- documentación inconsistente.

---

## Critical Failure

```text
Critical Failure

↓

Stop Validation

↓

Emit ValidationFailed

↓

Notify Orchestrator

↓

Escalate

↓

Await Resolution
```

---

# 13. Escalation Rules

El QA Runtime deberá escalar inmediatamente al Orchestrator Runtime cuando detecte situaciones que excedan su ámbito de responsabilidad o representen un riesgo para la calidad del sistema.

---

## Architecture Escalation

Escalar al Chief Architect Runtime cuando:

- exista incumplimiento de la arquitectura definida;
- se detecten dependencias no autorizadas;
- se incumplan principios del Operating Model;
- existan cambios estructurales no documentados;
- una implementación contradiga la arquitectura aprobada.

Flujo:

```text
Architecture Issue Detected

↓

Pause Validation

↓

Generate ArchitectureReviewRequested

↓

Notify Orchestrator

↓

Chief Architect Review

↓

Resume Validation
```

---

## Functional Escalation

Escalar cuando:

- existan defectos críticos;
- los criterios de aceptación sean ambiguos;
- exista comportamiento funcional inconsistente;
- no sea posible validar un requisito.

---

## Documentation Escalation

Escalar cuando:

- falte documentación obligatoria;
- exista inconsistencia entre implementación y documentación;
- falten casos de uso;
- existan referencias rotas.

---

## Security Escalation

Escalar cuando:

- se detecten vulnerabilidades críticas;
- fallen controles de autenticación;
- fallen controles de autorización;
- exista exposición de información sensible.

---

## Performance Escalation

Escalar cuando:

- los tiempos superen los SLA definidos;
- exista degradación significativa;
- existan problemas de escalabilidad;
- el rendimiento comprometa la operación.

---

## Runtime Escalation Workflow

```text
Detect Issue

↓

Collect Evidence

↓

Determine Severity

↓

Notify Orchestrator

↓

Generate Escalation Event

↓

Await Resolution

↓

Resume Validation
```

---

# 14. Observability

Toda validación deberá ser completamente trazable.

---

## Mandatory Logging

Registrar obligatoriamente:

- Runtime ID;
- Task ID;
- Event ID;
- Correlation ID;
- Validation ID;
- Test Suite ID;
- Environment ID;
- Timestamp Inicio;
- Timestamp Fin.

---

## Functional Metrics

Registrar:

- casos ejecutados;
- casos aprobados;
- casos rechazados;
- casos omitidos;
- cobertura funcional.

---

## Technical Metrics

Registrar:

- APIs validadas;
- endpoints evaluados;
- componentes revisados;
- integraciones verificadas.

---

## Quality Metrics

Registrar:

- defectos críticos;
- defectos mayores;
- defectos menores;
- observaciones;
- recomendaciones.

---

## Performance Metrics

Registrar:

- tiempo de ejecución;
- consumo de recursos;
- tiempos de respuesta;
- estabilidad del entorno.

---

## Documentation Metrics

Registrar:

- documentos revisados;
- inconsistencias;
- cobertura documental;
- actualizaciones requeridas.

---

## Audit Trail

Toda validación deberá reconstruirse completamente.

```text
Task Assigned

↓

Validation Scope

↓

Test Execution

↓

Evidence Collection

↓

Result Consolidation

↓

Approval Decision

↓

RuntimeCompleted
```

---

# 15. Security Considerations

La seguridad constituye un requisito obligatorio del QA Runtime.

---

## Test Environment

Toda validación deberá ejecutarse en ambientes autorizados.

Nunca sobre producción salvo autorización explícita.

---

## Authentication

Toda ejecución deberá validar:

- identidad;
- permisos;
- credenciales de prueba;
- contexto de ejecución.

---

## Authorization

El Runtime únicamente podrá acceder a:

- ambientes autorizados;
- datos autorizados;
- evidencia autorizada;
- reportes autorizados.

---

## Sensitive Information

Nunca deberá:

- almacenar secretos;
- registrar credenciales;
- exponer datos sensibles;
- compartir evidencia restringida.

---

## Compliance

Toda validación deberá cumplir:

- políticas corporativas;
- gobierno de datos;
- auditoría;
- seguridad definida por arquitectura.

---

# 16. Performance Guidelines

El QA Runtime deberá priorizar reproducibilidad y eficiencia.

---

## Test Execution

Optimizar:

- paralelización;
- reutilización de ambientes;
- automatización;
- ejecución incremental.

---

## Resource Usage

Reducir:

- tiempos muertos;
- pruebas redundantes;
- consumo innecesario;
- duplicación de evidencia.

---

## Scalability

El Runtime deberá soportar:

- múltiples proyectos;
- múltiples empresas;
- múltiples ambientes;
- múltiples pipelines;
- ejecución paralela.

---

## Availability

Priorizar:

- disponibilidad del entorno;
- recuperación rápida;
- estabilidad;
- continuidad operacional.

---

# 17. Completion Criteria

El Runtime únicamente podrá finalizar cuando todas las condiciones siguientes se cumplan.

---

## Validation Execution

Confirmar:

- pruebas ejecutadas;
- evidencia generada;
- resultados consolidados.

---

## Reporting

Confirmar:

- informe generado;
- hallazgos clasificados;
- riesgos identificados.

---

## Notifications

Confirmar:

- Orchestrator actualizado;
- Documentation Runtime notificado cuando corresponda;
- eventos emitidos.

---

## Events

Confirmar emisión de:

```text
QAStarted

↓

TestExecutionCompleted

↓

ApprovalGranted / ApprovalRejected

↓

RuntimeCompleted
```

---

## Documentation

Confirmar que toda evidencia quedó correctamente registrada.

---

## Final State

Estados finales permitidos:

```text
Completed
```

o

```text
Completed With Observations
```

Nunca:

```text
Unknown
```

ni

```text
Partially Completed
```

sin autorización explícita del Orchestrator Runtime.

---

# 18. Acceptance Criteria

El QA Runtime se considerará correctamente implementado cuando cumpla todos los siguientes criterios.

---

## Functional Criteria

Debe ser capaz de:

- validar funcionalidades del sistema;
- validar APIs y contratos;
- validar componentes Frontend;
- validar procesos del Backend;
- validar el modelo de datos;
- validar DQBot;
- validar documentación;
- generar evidencia objetiva y reproducible.

---

## Operating Model Compliance

Debe cumplir estrictamente:

- Task Lifecycle;
- Process Orchestration Model;
- Event Catalog;
- Communication Protocol;
- Handoff Protocol;
- Review Workflow.

Nunca podrá redefinir estos procesos.

---

## Validation Compliance

Debe garantizar:

- independencia de la implementación;
- objetividad;
- repetibilidad;
- trazabilidad;
- cobertura suficiente;
- evidencia verificable.

---

## Runtime Compliance

Debe operar únicamente:

- mediante tareas;
- mediante eventos;
- coordinado por el Orchestrator Runtime.

Nunca iniciará procesos por iniciativa propia.

---

## Documentation Compliance

Toda validación deberá:

- generar evidencia;
- registrar observaciones;
- mantener trazabilidad;
- sincronizar hallazgos con Documentation Runtime cuando corresponda.

---

## Security Compliance

Debe respetar:

- Repository Permission Matrix;
- Decision Authority Matrix;
- políticas de acceso;
- segregación de ambientes;
- principio de mínimo privilegio.

---

## Performance Compliance

Debe cumplir objetivos de:

- ejecución eficiente;
- automatización;
- alta cobertura;
- mínima repetición;
- generación rápida de evidencia.

---

## Event Compliance

Todos los eventos emitidos deberán existir en:

```text
operating-model/event-catalog.md
```

Nunca podrá emitir eventos no documentados.

---

# 19. Runtime State Machine

El comportamiento interno del QA Runtime seguirá el siguiente modelo.

```text
Idle

↓

Task Assigned

↓

Initializing

↓

Loading Context

↓

Loading Test Plan

↓

Executing Validation

↓

Collecting Evidence

↓

Analyzing Results

↓

Generating Report

↓

Approval Decision

↓

Publishing Results

↓

Completed

↓

Idle
```

---

## Error State

Cuando ocurra un error:

```text
Current State

↓

Validation Error

↓

Collect Evidence

↓

Notify Orchestrator

↓

Await Decision

↓

Resume

o

↓

Abort
```

---

## Retry State

Cuando el error sea recuperable:

```text
Failure

↓

Retry Requested

↓

Reinitialize Validation

↓

Execute Pending Tests

↓

Continue
```

---

# 20. Runtime Integration

Este Runtime forma parte del ecosistema definido por el Operating Model.

Su posición dentro del flujo oficial es:

```text
External Event

↓

n8n

↓

Orchestrator Runtime

↓

Chief Architect Runtime (si aplica)

↓

Database Runtime

↓

Backend Runtime

↓

Frontend Runtime

↓

DQBot Runtime

↓

QA Runtime

↓

Documentation Runtime

↓

DevOps Runtime

↓

Task Closed
```

---

## Integration Responsibilities

El QA Runtime será responsable de:

- validar entregables;
- consolidar evidencia;
- verificar cumplimiento;
- aprobar o rechazar cambios;
- emitir reportes de calidad.

No será responsable de:

- implementar funcionalidades;
- modificar documentación;
- realizar despliegues;
- tomar decisiones arquitectónicas.

---

# 21. Future Evolution

Este Runtime deberá evolucionar sin romper compatibilidad con el Operating Model.

Deberá soportar futuras capacidades como:

- pruebas impulsadas por IA;
- generación automática de casos de prueba;
- validación continua;
- contract testing;
- mutation testing;
- chaos engineering;
- performance profiling;
- security scanning automatizado;
- quality gates inteligentes.

La evolución tecnológica nunca deberá modificar el comportamiento definido por este Runtime.

---

# Appendix A — Complete Runtime Flow

```text
RuntimeCompleted Event

↓

Orchestrator Runtime

↓

QA Runtime

↓

Load Test Plan

↓

Execute Validation

↓

Collect Evidence

↓

Analyze Results

↓

Generate Quality Report

↓

ApprovalGranted / ApprovalRejected

↓

Notify Documentation Runtime

↓

RuntimeCompleted

↓

Task Lifecycle Continues
```

---

# Appendix B — QA Runtime Principles

Todo comportamiento del QA Runtime deberá respetar permanentemente los siguientes principios.

## Quality First

La calidad constituye un requisito obligatorio, no una etapa opcional.

---

## Evidence Before Approval

Ningún cambio podrá aprobarse sin evidencia objetiva y verificable.

---

## Independent Validation

La validación deberá ser independiente de quien implementó el cambio.

---

## Documentation First

Toda validación deberá contrastarse contra la documentación oficial.

---

## Event Driven

El Runtime nunca inicia procesos.

Siempre responde a:

- tareas;
- eventos;
- solicitudes de revisión.

---

## Traceability

Toda validación deberá reconstruirse mediante:

- Event ID;
- Task ID;
- Correlation ID;
- Validation ID;
- Test Suite ID;
- Audit Trail.

---

## Deterministic Validation

Las mismas condiciones deberán producir los mismos resultados.

---

## Platform Independence

El Runtime no dependerá de herramientas específicas.

Podrá implementarse mediante:

- Playwright;
- Cypress;
- Selenium;
- Postman;
- Newman;
- JMeter;
- k6;
- herramientas futuras compatibles.

La tecnología implementa el Runtime; el Runtime no depende de la tecnología.

---

## Governance by Design

Toda validación deberá respetar:

- arquitectura;
- Operating Model;
- matrices;
- permisos;
- autoridad.

---

## Continuous Improvement

Toda validación deberá generar información útil para:

- mejorar la arquitectura;
- mejorar la documentación;
- mejorar los procesos;
- mejorar los agentes;
- mejorar el producto.

---

## Risk-Based Validation

La profundidad de las validaciones deberá ser proporcional al riesgo del cambio, priorizando siempre los componentes críticos del negocio.

---

# End of Document