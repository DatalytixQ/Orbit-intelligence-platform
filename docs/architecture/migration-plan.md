# Repository Migration Plan

**Document:** `migration-plan.md`  
**Version:** 1.0  
**Status:** Official Migration Baseline  
**Owner:** ERP Intelligence Platform

---

# Document Metadata

## Document Role

Canonical Repository Migration Specification

---

## Repository Scope

Applies To:

- `/backend`
- `/frontend`
- `/docs`

---

## Source of Truth

Este documento define la estrategia oficial para evolucionar la estructura del repositorio.

Ninguna reorganización deberá realizarse fuera de este proceso.

---

## Depends On

- `AGENTS.md`
- `repository-structure.md`
- `project-governance.md`
- `technology-stack.md`

---

## Used By

- Chief Architect Agent
- Refactoring Agent
- Backend Agent
- Frontend Agent
- Documentation Agent
- QA Agent

---

## Related Documents

- `functional.md`
- `database.md`
- `api.md`
- `rules-engine.md`

---

# 1. Purpose

El propósito de este documento es establecer un proceso controlado para migrar el repositorio desde su estructura actual hacia la arquitectura objetivo.

La prioridad absoluta es preservar la estabilidad del producto durante todo el proceso.

---

# 2. Migration Principles

Toda migración deberá cumplir:

- No romper funcionalidades existentes.
- Mantener compatibilidad hacia atrás.
- Ejecutar cambios pequeños e incrementales.
- Validar cada iteración.
- Mantener sincronizada la documentación.
- Evitar migraciones masivas.

---

# 3. Current Baseline

Estado actual del proyecto:

- Aproximadamente 70% implementado.
- Backend operativo.
- Frontend operativo.
- DQBot funcional.
- APIs implementadas.
- Documentación consolidada.

Este estado constituye el punto de partida oficial.

---

# 4. Target Architecture

La arquitectura objetivo corresponde a la definida en:

- `repository-structure.md`
- `technology-stack.md`

El objetivo es organizar el proyecto por dominios funcionales sin modificar el comportamiento del sistema.

---

# 5. Migration Strategy

La migración seguirá una estrategia iterativa.

```text
Current Repository
        │
        ▼
Create Target Structure
        │
        ▼
Move One Module
        │
        ▼
Update Imports
        │
        ▼
Run Tests
        │
        ▼
Deploy
        │
        ▼
Repeat
```

---

# 6. Migration Phases

## Phase 0 — Preparation

Objetivo:

Preparar el repositorio sin mover código.

### Actividades

- Crear nuevas carpetas.
- Actualizar documentación.
- Definir estructura destino.
- Configurar validaciones.

---

## Phase 1 — DQBot

Migrar únicamente:

```text
backend/services/dqbot
```

Destino:

```text
backend/src/domains/dqbot
```

Validar:

- Conversación.
- APIs.
- Prompts.
- Routing.

---

## Phase 2 — Analytics

Migrar:

```text
analyticsEngine

businessInsights

analytics routes
```

Destino:

```text
domains/analytics
```

---

## Phase 3 — Sales

Migrar:

- rutas;
- servicios;
- controladores.

---

## Phase 4 — Inventory

Migrar dominio Inventory.

---

## Phase 5 — Supply

Migrar dominio Supply.

---

## Phase 6 — Finance

Migrar dominio Finance.

---

## Phase 7 — Shared Components

Crear:

```text
shared/

middleware/

config/

utils/
```

---

## Phase 8 — Frontend

Migrar:

- services;
- hooks;
- components;
- domains.

---

## Phase 9 — Cleanup

Eliminar estructura legacy únicamente cuando:

- todos los imports estén actualizados;
- no existan referencias;
- todas las pruebas sean exitosas.

---

# 7. Validation Gates

Cada fase deberá superar los siguientes controles:

## Functional

- Aplicación inicia.
- Login funciona.
- Dashboard operativo.
- DQBot operativo.
- APIs responden.

---

## Technical

- Sin errores de compilación.
- Sin imports rotos.
- Sin dependencias circulares.

---

## Documentation

- Documentación actualizada.
- Cambios registrados.
- Trazabilidad mantenida.

---

# 8. Rollback Strategy

Cada migración deberá permitir volver al estado anterior.

Nunca combinar múltiples migraciones en un mismo cambio.

Cada fase debe ser independiente.

---

# 9. AI Agent Responsibilities

## Chief Architect Agent

- Aprueba la migración.
- Verifica coherencia arquitectónica.

---

## Refactoring Agent

- Mueve archivos.
- Actualiza imports.
- Mantiene compatibilidad.

---

## Backend Agent

- Ajusta servicios.
- Corrige dependencias.
- Ejecuta validaciones.

---

## Frontend Agent

- Actualiza referencias.
- Corrige consumo de APIs.

---

## Documentation Agent

- Sincroniza todos los documentos afectados.

---

## QA Agent

- Ejecuta pruebas.
- Verifica regresiones.

---

# 10. Success Criteria

La migración se considera exitosa cuando:

- El comportamiento funcional permanece inalterado.
- La documentación refleja la estructura real.
- No existen referencias a módulos obsoletos.
- Los dominios están claramente separados.
- La arquitectura coincide con `repository-structure.md`.

---

# Appendix A — Migration Roadmap

```text
Preparation
        │
        ▼
DQBot
        │
        ▼
Analytics
        │
        ▼
Sales
        │
        ▼
Inventory
        │
        ▼
Supply
        │
        ▼
Finance
        │
        ▼
Frontend
        │
        ▼
Cleanup
```

---

# Appendix B — Migration Principles

- Progressive Refactoring.
- Small Iterations.
- Continuous Validation.
- Documentation First.
- Backward Compatibility.
- Zero Functional Regression.

---

# End of Document