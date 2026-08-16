# Refactoring Runtime

**Document:** `refactoring-runtime.md`

**Version:** 1.0

**Status:** Production Baseline

**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Runtime Specification

---

## Runtime Role

Refactoring Runtime constituye la implementación operacional del **Refactoring Agent** dentro del ecosistema AI Engineering.

Mientras `refactoring-agent.md` define las responsabilidades, capacidades y límites del agente, este documento define el comportamiento operativo durante la ejecución de tareas de refactorización, modernización y mejora continua del código fuente.

El Refactoring Runtime implementa el Operating Model y nunca redefine sus reglas.

---

## Repository Scope

Applies To

- `/backend`
- `/frontend`
- `/database`
- `/shared`
- `/tests`
- `/docs`
- `/scripts`

Puede interactuar indirectamente con:

- Source Code
- Architecture Documentation
- Static Analysis
- Linters
- Unit Tests
- Integration Tests
- Dependency Management
- Code Metrics

---

## Source of Truth

Este documento constituye la especificación oficial del comportamiento operativo del Refactoring Runtime.

Toda refactorización deberá ejecutarse respetando la arquitectura aprobada, la documentación oficial y el Operating Model.

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
- business/rules-engine.md

---

### Architecture

- architecture/project-governance.md
- architecture/repository-structure.md
- architecture/technology-stack.md
- architecture/migration-plan.md
- architecture/coding-standards.md

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

- agents/specifications/refactoring-agent.md

---

### Runtime Dependencies

- agents/runtime/orchestrator-runtime.md
- agents/runtime/chief-architect-runtime.md
- agents/runtime/qa-runtime.md
- agents/runtime/documentation-runtime.md

---

## Used By

Este Runtime es utilizado por:

- Orchestrator Runtime
- QA Runtime
- Documentation Runtime
- DevOps Runtime
- Todos los Runtime especializados cuando requieren modernización de código.

---

## Related Documents

- architecture/coding-standards.md
- architecture/project-governance.md
- operating-model/review-workflow.md
- agents/specifications/refactoring-agent.md

---

# 1. Purpose

Definir el comportamiento operativo del Refactoring Runtime durante la mejora continua del código fuente.

El Refactoring Runtime constituye la autoridad responsable de incrementar la mantenibilidad, legibilidad, modularidad y calidad técnica del software sin alterar el comportamiento funcional aprobado.

---

# 2. Mission

Garantizar que toda refactorización sea:

- segura;
- trazable;
- incremental;
- reversible;
- verificable;
- documentada;
- compatible con la arquitectura.

El Refactoring Runtime será responsable de:

- eliminar deuda técnica;
- mejorar estructura del código;
- simplificar componentes;
- reducir acoplamiento;
- mejorar cohesión;
- eliminar duplicación;
- mantener compatibilidad funcional.

Nunca modificará el comportamiento funcional aprobado sin autorización arquitectónica.

---

# 3. Runtime Contract

## Inputs

El Runtime puede recibir:

- Tasks asignadas por el Orchestrator Runtime.
- Resultados del QA Runtime.
- Hallazgos de análisis estático.
- Reportes de deuda técnica.
- Solicitudes de modernización.
- Cambios arquitectónicos aprobados.
- Resultados de métricas de calidad.

---

## Outputs

El Runtime podrá producir:

- RefactoringStarted
- TechnicalDebtReduced
- CodeStructureImproved
- RefactoringCompleted
- RefactoringReviewRequested
- RuntimeCompleted
- RuntimeFailed

---

## Guarantees

El Refactoring Runtime garantiza:

- preservación del comportamiento funcional;
- reducción controlada de deuda técnica;
- cumplimiento de estándares de codificación;
- compatibilidad con la arquitectura;
- trazabilidad completa;
- evidencia de los cambios realizados.

---

## Limitations

Este Runtime nunca deberá:

- modificar reglas de negocio;
- alterar contratos públicos sin aprobación;
- introducir funcionalidades nuevas;
- desplegar cambios;
- aprobar arquitectura;
- omitir validaciones posteriores a la refactorización.

---

# 4. Startup Conditions

Antes de iniciar cualquier ejecución deberá verificar:

## Documentación

- estándares de codificación disponibles;
- arquitectura vigente;
- documentación consistente;
- criterios de refactorización definidos.

---

## Runtime Dependencies

Debe validar disponibilidad de:

- Orchestrator Runtime;
- QA Runtime;
- Documentation Runtime;
- Event Catalog;
- Task Lifecycle;
- Review Workflow.

---

## Infraestructura

Debe verificar:

- acceso al repositorio;
- herramientas de análisis estático;
- herramientas de refactorización;
- entorno de pruebas.

---

## Seguridad

Debe validar:

- permisos suficientes;
- acceso autorizado;
- políticas de modificación del código.

---

## Contexto

Debe disponer de:

- Task ID;
- Event ID;
- Correlation ID;
- Repository Context;
- Runtime Context.

---

# 5. Supported Events

## Consumed Events

- TaskAssigned
- TechnicalDebtDetected
- ArchitectureApproved
- QACompleted
- RuntimeRetry
- RuntimeEscalated

---

## Produced Events

- RefactoringStarted
- CodeStructureImproved
- TechnicalDebtReduced
- RefactoringReviewRequested
- RuntimeCompleted
- RuntimeFailed

---

# 6. Business Process Participation

Este Runtime participa en los siguientes procesos oficiales definidos en:

`process-orchestration-model.md`

---

## Code Quality Improvement

Responsabilidades:

- reducir deuda técnica;
- mejorar mantenibilidad;
- eliminar duplicación;
- simplificar estructuras.

---

## Architecture Alignment

Responsabilidades:

- mantener alineación arquitectónica;
- reducir acoplamiento;
- mejorar modularidad;
- preservar principios de diseño.

---

## Continuous Improvement

Responsabilidades:

- modernizar componentes;
- optimizar estructura;
- mejorar legibilidad;
- facilitar evolución futura.

---

## Technical Standardization

Responsabilidades:

- aplicar estándares;
- uniformar patrones;
- eliminar inconsistencias;
- mantener calidad técnica.

---

# 7. Execution Pipeline

Todo proceso ejecutado por el Refactoring Runtime deberá seguir el siguiente flujo operacional.

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

Receive Refactoring Request

↓

Identify Scope

↓

Load Architecture Constraints

↓

Analyze Current Implementation

↓

Run Static Analysis

↓

Identify Technical Debt

↓

Plan Refactoring

↓

Execute Incremental Refactoring

↓

Execute Automated Validation

↓

Run Unit Tests

↓

Run Integration Tests

↓

Validate Coding Standards

↓

Generate Refactoring Report

↓

Notify QA Runtime

↓

Emit RefactoringCompleted

↓

Await Next Task
```

Ninguna etapa podrá omitirse salvo autorización explícita del Orchestrator Runtime y únicamente cuando el Task Lifecycle lo permita.

---

# 8. Document Consultation Order

Antes de ejecutar cualquier refactorización deberá consultar la documentación oficial en el siguiente orden.

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

business/rules-engine.md
```

---

## Nivel 3 — Architecture

```text
architecture/project-governance.md

↓

architecture/repository-structure.md

↓

architecture/coding-standards.md

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
agents/specifications/refactoring-agent.md
```

---

## Nivel 7 — Runtime Specifications

```text
orchestrator-runtime.md

↓

chief-architect-runtime.md

↓

qa-runtime.md

↓

documentation-runtime.md
```

---

# 9. Decision Points

Durante la ejecución el Refactoring Runtime únicamente podrá tomar decisiones relacionadas con la calidad técnica del software.

---

## Scope Identification

Determinar:

- componente afectado;
- módulo afectado;
- alcance de la refactorización;
- impacto esperado.

---

## Refactoring Strategy

Determinar:

- extracción de componentes;
- extracción de servicios;
- simplificación;
- reorganización;
- modularización;
- eliminación de duplicación.

---

## Technical Debt Evaluation

Evaluar:

- duplicación;
- complejidad;
- acoplamiento;
- cohesión;
- mantenibilidad;
- legibilidad.

---

## Dependency Strategy

Determinar:

- dependencias innecesarias;
- dependencias circulares;
- simplificación;
- desacoplamiento.

---

## Validation Strategy

Seleccionar:

- pruebas unitarias;
- pruebas de integración;
- análisis estático;
- validación arquitectónica;
- revisión manual.

---

## Escalation Decision

Escalar cuando:

- la refactorización implique cambios funcionales;
- cambie la arquitectura;
- cambien contratos públicos;
- exista riesgo para la estabilidad;
- sea necesaria una decisión arquitectónica.

---

# 10. Interaction With Other Agents

## Orchestrator Runtime

Responsabilidades compartidas:

- recepción de tareas;
- coordinación;
- seguimiento;
- cierre.

Eventos intercambiados:

```text
TaskAssigned

↓

RefactoringCompleted

↓

RuntimeCompleted
```

---

## Chief Architect Runtime

Solicita revisión cuando:

- cambie la arquitectura;
- se propongan nuevos patrones;
- exista impacto transversal;
- cambien principios de diseño.

---

## QA Runtime

Entrega:

- código refactorizado;
- evidencia;
- reporte técnico.

Recibe:

- resultados de validación;
- defectos;
- observaciones.

---

## Documentation Runtime

Solicita actualización cuando:

- cambien estructuras;
- cambien patrones;
- cambien convenciones;
- cambie la arquitectura documentada.

---

## Backend Runtime

Coordina cuando:

- existan cambios estructurales;
- cambien servicios internos;
- mejore organización del código.

---

## Frontend Runtime

Coordina cuando:

- existan cambios en componentes;
- cambien patrones UI;
- cambie organización del proyecto.

---

## DevOps Runtime

Coordina:

- validación de pipelines;
- calidad del código;
- métricas;
- automatización.

---

# 11. Validation Rules

Antes de finalizar cualquier refactorización deberán ejecutarse todas las validaciones.

---

## Functional Validation

Verificar:

- comportamiento preservado;
- contratos intactos;
- resultados equivalentes.

---

## Static Analysis Validation

Verificar:

- complejidad;
- duplicación;
- calidad;
- estándares.

---

## Architecture Validation

Verificar:

- cumplimiento arquitectónico;
- separación de responsabilidades;
- modularidad;
- desacoplamiento.

---

## Coding Standards Validation

Verificar:

- nomenclatura;
- estilo;
- organización;
- convenciones.

---

## Test Validation

Verificar:

- pruebas unitarias;
- pruebas de integración;
- regresión;
- cobertura.

---

## Documentation Validation

Confirmar necesidad de actualización documental cuando corresponda.

---

## Event Validation

Confirmar emisión correcta de:

```text
RefactoringStarted

↓

TechnicalDebtReduced

↓

RefactoringCompleted

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

- Refactoring Error
- Architecture Error
- Dependency Error
- Validation Error
- Static Analysis Error
- Test Failure
- Runtime Error

---

## Recovery Flow

```text
Error

↓

Rollback Changes

↓

Restore Previous State

↓

Notify Orchestrator

↓

Await Resolution
```

---

## Retry Policy

Únicamente podrán reintentarse automáticamente:

- conflictos temporales;
- timeout;
- bloqueos del repositorio;
- errores transitorios del entorno.

Nunca:

- cambios funcionales inesperados;
- incumplimientos arquitectónicos;
- pérdida de cobertura;
- regresiones detectadas.

---

## Critical Failure

```text
Critical Failure

↓

Stop Refactoring

↓

Emit RuntimeFailed

↓

Notify Orchestrator

↓

Escalate

↓

Await Resolution
```

---

# 13. Escalation Rules

El Refactoring Runtime deberá escalar inmediatamente al Orchestrator Runtime cuando detecte situaciones que excedan su autoridad técnica.

---

## Architecture Escalation

Escalar al Chief Architect Runtime cuando:

- la refactorización implique cambios arquitectónicos;
- cambien patrones estructurales;
- cambien límites entre módulos;
- se introduzcan nuevas dependencias estratégicas;
- exista impacto transversal sobre múltiples Runtime.

```text
Architecture Impact Detected

↓

Pause Refactoring

↓

Generate ArchitectureReviewRequested

↓

Notify Orchestrator

↓

Chief Architect Review

↓

Resume or Reject
```

---

## Functional Escalation

Escalar cuando:

- una refactorización modifique el comportamiento funcional;
- exista riesgo de regresión;
- cambien contratos públicos;
- cambien reglas de negocio;
- existan efectos colaterales no previstos.

---

## Technical Debt Escalation

Escalar cuando:

- la deuda técnica no pueda resolverse localmente;
- sea necesaria una reestructuración mayor;
- exista deuda arquitectónica;
- existan dependencias obsoletas críticas.

---

## Dependency Escalation

Escalar cuando:

- aparezcan dependencias circulares;
- una librería deba reemplazarse;
- exista incompatibilidad de versiones;
- se afecten múltiples módulos.

---

## Documentation Escalation

Escalar cuando:

- la documentación no refleje la implementación;
- falten estándares de codificación;
- existan inconsistencias entre documentos;
- sea necesario modificar principios de arquitectura.

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

Resume Refactoring
```

---

# 14. Observability

Toda refactorización deberá ser completamente trazable.

---

## Mandatory Logging

Registrar obligatoriamente:

- Runtime ID;
- Task ID;
- Event ID;
- Correlation ID;
- Repository ID;
- Module ID;
- Commit ID;
- Branch;
- Timestamp Inicio;
- Timestamp Fin.

---

## Refactoring Metrics

Registrar:

- archivos modificados;
- componentes reorganizados;
- líneas simplificadas;
- duplicaciones eliminadas;
- complejidad reducida.

---

## Technical Quality Metrics

Registrar:

- complejidad ciclomática;
- Maintainability Index;
- Code Smells;
- Technical Debt;
- cobertura de pruebas.

---

## Dependency Metrics

Registrar:

- dependencias eliminadas;
- dependencias agregadas;
- dependencias actualizadas;
- dependencias desacopladas.

---

## Performance Metrics

Registrar:

- tiempo de compilación;
- tiempo de pruebas;
- impacto en rendimiento;
- utilización de recursos.

---

## Audit Trail

Toda refactorización deberá reconstruirse completamente.

```text
Task Assigned

↓

Static Analysis

↓

Technical Debt Analysis

↓

Refactoring Plan

↓

Incremental Changes

↓

Validation

↓

QA Review

↓

RuntimeCompleted
```

---

# 15. Security Considerations

Toda refactorización deberá preservar la seguridad existente.

---

## Security Preservation

Nunca deberá:

- eliminar controles de seguridad;
- debilitar autenticación;
- debilitar autorización;
- eliminar auditoría;
- eliminar validaciones.

---

## Repository Access

Toda modificación deberá respetar:

- Repository Permission Matrix;
- Decision Authority Matrix;
- políticas de acceso;
- principio de mínimo privilegio.

---

## Sensitive Components

Toda modificación sobre:

- autenticación;
- autorización;
- cifrado;
- gestión de secretos;
- infraestructura crítica;

deberá escalarse para revisión arquitectónica.

---

## Compliance

Toda refactorización deberá mantener cumplimiento con:

- arquitectura;
- auditoría;
- políticas corporativas;
- estándares de desarrollo.

---

# 16. Performance Guidelines

El Refactoring Runtime deberá priorizar mantenibilidad sin degradar el rendimiento.

---

## Refactoring Strategy

Priorizar:

- cambios pequeños;
- cambios incrementales;
- validación continua;
- commits atómicos.

---

## Maintainability

Optimizar:

- cohesión;
- desacoplamiento;
- reutilización;
- claridad del código.

---

## Resource Usage

Reducir:

- complejidad;
- duplicación;
- dependencias innecesarias;
- consumo de memoria cuando sea posible.

---

## Scalability

Toda refactorización deberá facilitar:

- crecimiento del proyecto;
- incorporación de nuevos Runtime;
- nuevas integraciones;
- evolución tecnológica.

---

## Availability

La refactorización nunca deberá comprometer:

- estabilidad;
- disponibilidad;
- continuidad operacional.

---

# 17. Completion Criteria

El Runtime únicamente podrá finalizar cuando todas las condiciones siguientes se cumplan.

---

## Refactoring Execution

Confirmar:

- refactorización completada;
- comportamiento preservado;
- deuda técnica reducida.

---

## Validation

Confirmar:

- pruebas exitosas;
- análisis estático aprobado;
- estándares cumplidos.

---

## Documentation

Confirmar:

- Documentation Runtime notificado cuando corresponda;
- cambios documentados;
- evidencia registrada.

---

## Notifications

Confirmar:

- QA Runtime notificado;
- Orchestrator actualizado;
- eventos emitidos.

---

## Events

Confirmar emisión de:

```text
RefactoringStarted

↓

TechnicalDebtReduced

↓

RefactoringCompleted

↓

RuntimeCompleted
```

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

El Refactoring Runtime se considerará correctamente implementado cuando cumpla todos los siguientes criterios.

---

## Functional Criteria

Debe ser capaz de:

- reducir deuda técnica;
- mejorar la mantenibilidad del código;
- preservar el comportamiento funcional;
- eliminar duplicación;
- mejorar modularidad;
- reducir acoplamiento;
- incrementar cohesión;
- mantener compatibilidad con la arquitectura.

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

## Code Quality Compliance

Debe garantizar:

- código limpio;
- estructura consistente;
- cumplimiento de estándares;
- modularidad;
- reutilización;
- simplicidad.

---

## Runtime Compliance

Debe operar únicamente:

- mediante tareas;
- mediante eventos;
- coordinado por el Orchestrator Runtime.

Nunca iniciará procesos por iniciativa propia.

---

## Documentation Compliance

Toda refactorización deberá:

- generar evidencia;
- actualizar documentación cuando corresponda;
- mantener sincronización con Documentation Runtime;
- preservar la trazabilidad.

---

## Security Compliance

Debe respetar:

- Repository Permission Matrix;
- Decision Authority Matrix;
- estándares de codificación segura;
- principio de mínimo privilegio.

---

## Performance Compliance

Debe cumplir objetivos de:

- menor complejidad;
- menor deuda técnica;
- mejor mantenibilidad;
- alta reutilización;
- mínima regresión.

---

## Event Compliance

Todos los eventos emitidos deberán existir en:

```text
operating-model/event-catalog.md
```

Nunca podrá emitir eventos no documentados.

---

# 19. Runtime State Machine

El comportamiento interno del Refactoring Runtime seguirá el siguiente modelo.

```text
Idle

↓

Task Assigned

↓

Initializing

↓

Loading Context

↓

Static Analysis

↓

Technical Debt Analysis

↓

Planning Refactoring

↓

Incremental Refactoring

↓

Running Tests

↓

Validating Quality

↓

Generating Report

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

Refactoring Error

↓

Rollback

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

Reload Context

↓

Reexecute Refactoring

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

Refactoring Runtime

↓

DevOps Runtime

↓

Task Closed
```

---

## Integration Responsibilities

El Refactoring Runtime será responsable de:

- mejorar la calidad técnica;
- reducir deuda técnica;
- modernizar el código;
- mantener alineación arquitectónica;
- preparar el código para futuras evoluciones.

No será responsable de:

- modificar reglas de negocio;
- alterar arquitectura sin aprobación;
- desplegar cambios;
- aprobar entregables.

---

# 21. Future Evolution

Este Runtime deberá evolucionar sin romper compatibilidad con el Operating Model.

Deberá soportar futuras capacidades como:

- refactorización asistida por IA;
- análisis semántico del código;
- modernización automática;
- actualización automática de dependencias;
- detección predictiva de deuda técnica;
- optimización arquitectónica;
- generación automática de pruebas;
- análisis continuo de calidad.

La evolución tecnológica nunca deberá modificar el comportamiento definido por este Runtime.

---

# Appendix A — Complete Runtime Flow

```text
Technical Debt Detected

↓

Orchestrator Runtime

↓

Refactoring Runtime

↓

Analyze Code

↓

Identify Improvements

↓

Execute Incremental Refactoring

↓

Run Static Analysis

↓

Run Tests

↓

Generate Refactoring Report

↓

Notify QA Runtime

↓

Documentation Runtime

↓

RefactoringCompleted

↓

RuntimeCompleted

↓

Task Lifecycle Continues
```

---

# Appendix B — Refactoring Runtime Principles

Todo comportamiento del Refactoring Runtime deberá respetar permanentemente los siguientes principios.

## Behavior Preservation

Toda refactorización deberá preservar el comportamiento funcional existente.

---

## Incremental Improvement

Las mejoras deberán realizarse mediante cambios pequeños, verificables y reversibles.

---

## Architecture First

Toda refactorización deberá fortalecer la arquitectura, nunca debilitarla.

---

## Documentation First

Toda modificación relevante deberá reflejarse en la documentación oficial.

---

## Event Driven

El Runtime nunca inicia procesos.

Siempre responde a:

- tareas;
- eventos;
- solicitudes aprobadas.

---

## Traceability

Toda refactorización deberá reconstruirse mediante:

- Event ID;
- Task ID;
- Correlation ID;
- Repository ID;
- Commit ID;
- Audit Trail.

---

## Continuous Validation

Toda modificación deberá validarse inmediatamente mediante:

- análisis estático;
- pruebas automatizadas;
- revisión arquitectónica cuando corresponda.

---

## Platform Independence

El Runtime no dependerá de herramientas específicas.

Podrá implementarse mediante:

- SonarQube;
- OpenRewrite;
- ESLint;
- Ruff;
- PMD;
- Checkstyle;
- herramientas futuras compatibles.

La herramienta implementa el Runtime; el Runtime no depende de la herramienta.

---

## Governance by Design

Toda acción deberá respetar:

- arquitectura;
- Operating Model;
- matrices;
- permisos;
- autoridad.

---

## Continuous Improvement

Toda refactorización deberá facilitar:

- evolución futura;
- incorporación de nuevos Runtime;
- reducción continua de deuda técnica;
- incremento sostenido de la calidad del software.

---

## Reusability

Toda mejora deberá incrementar la reutilización del código, reducir el acoplamiento y facilitar el mantenimiento del ecosistema ERP Intelligence Platform.

---

# End of Document