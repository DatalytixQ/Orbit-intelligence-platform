# AGENTS.md

# ERP Intelligence Platform — AI Development Guide

**Version:** 1.0  
**Status:** Official Repository Standard

---

# Purpose

Este documento establece las reglas que deben seguir todos los agentes de desarrollo (Antigravity, Claude Code, Codex, Cursor, GitHub Copilot, ChatGPT, etc.) al trabajar sobre este repositorio.

Su objetivo es garantizar que toda modificación del código mantenga consistencia con la arquitectura, la documentación y las decisiones de diseño oficiales.

---

# 1. Repository Structure

```text
/

docs/
backend/
frontend/
```

## docs/

Contiene la documentación oficial del producto y constituye la **Single Source of Truth**.

```text
docs/

├── agents/
│   ├── specifications/
│   ├── runtime/
│   ├── prompts/
│   └── platform/
│
├── architecture/
├── business/
├── operating-model/
│   ├── matrices/
│   └── standards/
│
├── sop/
│
├── AGENTS.md
├── README.md
└── documentation-index.md
```

Toda modificación funcional o técnica deberá mantener sincronizada esta documentación.

---

## backend/

Contiene:

- REST APIs
- Rules Engine
- Insight Engine
- Priority Engine
- SQL
- ETL
- Integraciones
- Servicios
- Conectores
- Lógica de negocio

---

## frontend/

Contiene:

- Next.js
- Dashboard
- DQBot
- Componentes
- Hooks
- Servicios REST
- UX/UI

---

## External Resources

El producto depende además de recursos externos al repositorio.

Actualmente:

```text
Supabase

↓

Database

Views

RPC

Storage

Policies

Authentication
```

Los agentes deberán considerar Supabase como parte del producto durante el proceso de Product Discovery.

---

# 2. Documentation Hierarchy

En caso de conflicto entre documentos, prevalece el siguiente orden:

1. `functional.md`
2. `database.md`
3. `kpi.md`
4. `rules-engine.md`
5. `api.md`
6. `dqbot-architecture.md`
7. `technology-stack.md`
8. SOPs
9. Documentación técnica

Ningún documento puede contradecir a uno de mayor jerarquía.

---

# 3. Source of Truth

Los siguientes documentos son canónicos:

| Tema | Documento |
|------|-----------|
| Funcionalidad | functional.md |
| Modelo de datos | database.md |
| KPIs | kpi.md |
| Reglas | rules-engine.md |
| APIs | api.md |
| IA Conversacional | dqbot-architecture.md |
| Tecnología | technology-stack.md |

---

# 4. Mandatory Development Rules

Los agentes deben cumplir obligatoriamente:

- No modificar contratos REST sin actualizar `api.md`.
- No crear KPIs fuera de `kpi.md`.
- No agregar reglas fuera de `rules-engine.md`.
- No crear vistas SQL sin documentarlas en `database.md`.
- No acceder desde APIs a tablas RAW o STG.
- Consumir únicamente la capa semántica.
- Mantener trazabilidad completa.
- Mantener nomenclatura consistente.

---

# 5. Documentation First

Toda funcionalidad nueva debe seguir este orden:

```text
Documentación

↓

Diseño

↓

Implementación

↓

Testing

↓

Actualización documental
```

Nunca implementar primero y documentar después.

---

# 6. Architecture Principles

- API First.
- Domain Driven Design.
- Multi-tenant.
- Explainable Intelligence.
- Configuration over Code.
- Modularidad.
- Bajo acoplamiento.
- Alta cohesión.

---

# 7. Backend Rules

El backend implementa únicamente:

- REST APIs.
- Rules Engine.
- Insight Engine.
- Priority Engine.
- Integraciones.
- Seguridad.

No debe contener lógica de presentación.

---

# 8. Frontend Rules

El frontend:

- Consume APIs.
- No implementa lógica de negocio.
- No calcula KPIs.
- No ejecuta reglas.

---

# 9. SQL Rules

Toda vista SQL debe:

- Estar documentada.
- Tener nombre consistente.
- Consumir únicamente capas autorizadas.
- Ser reutilizable.

---

# 10. AI Rules

DQBot:

- No consulta el ERP.
- No ejecuta SQL.
- No recalcula KPIs.
- Consume únicamente APIs oficiales.

---

# 11. Change Management

Toda modificación importante deberá actualizar:

- documentación;
- contratos afectados;
- trazabilidad;
- roadmap, si corresponde.

---

# 12. Coding Standards

- TypeScript estricto.
- Componentes reutilizables.
- Arquitectura modular.
- Convenciones consistentes.
- Código documentado.

---

# 13. Goal

Toda contribución debe mantener la consistencia entre:

- documentación;
- arquitectura;
- implementación;
- operación.

# 14. Product Discovery

Antes de modificar cualquier componente, todo agente deberá:

1. Escanear completamente el repositorio.
2. Escanear la documentación.
3. Escanear Supabase.
4. Construir el Product Graph.
5. Calcular Product Health Score.
6. Generar Task Backlog.

Hasta completar estos pasos el Workspace permanece en READ ONLY.