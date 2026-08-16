# Document Metadata Standard

**Document:** `document-metadata-standard.md`  
**Version:** 1.0  
**Status:** Official Documentation Standard  
**Owner:** ERP Intelligence Platform

---

# 1. Purpose

Este documento define el bloque estándar de metadatos que deberá incorporarse al inicio de todos los documentos `.md` del proyecto.

Su objetivo es permitir que desarrolladores y agentes de IA identifiquen rápidamente:

- propósito del documento;
- alcance;
- dependencias;
- documentos relacionados;
- código asociado;
- reglas de modificación.

---

# 2. Placement

El bloque debe ubicarse siempre después del encabezado principal del documento y antes de la sección `Purpose`.

Ejemplo:

```text
# Document Title

**Document:** `file-name.md`
**Version:** 1.0
**Status:** Production Baseline
**Owner:** ERP Intelligence Platform

---

# Document Metadata

...

---

# 1. Purpose
```

---

# 3. Standard Metadata Block

```markdown
# Document Metadata

## Document Role

[Canonical / Supporting / Operational / Development / Governance]

---

## Repository Scope

Applies To:

- `/docs`
- `/backend`
- `/frontend`

---

## Source of Truth

Describe si este documento es fuente oficial para el dominio tratado.

---

## Depends On

- `document-a.md`
- `document-b.md`

---

## Used By

- Backend
- Frontend
- DQBot
- Rules Engine
- AI Agents
- Development Team

---

## Related Documents

- `related-document.md`

---

## Related Source Code

Backend:

```text
/backend/...
```

Frontend:

```text
/frontend/...
```

---

## AI Agent Instructions

- Consultar este documento antes de modificar código relacionado.
- No contradecir documentos de mayor jerarquía.
- Actualizar este documento si cambia la implementación.
- Mantener trazabilidad entre documentación y código.

---

## Change Policy

Toda modificación relevante debe actualizar:

- versión;
- estado;
- dependencias;
- documentación relacionada;
- código afectado.
```

---

# 4. Required Fields

Todo documento deberá incluir:

| Field | Required |
|------|----------|
| Document Role | Yes |
| Repository Scope | Yes |
| Source of Truth | Yes |
| Depends On | Yes |
| Used By | Yes |
| Related Documents | Yes |
| Related Source Code | When applicable |
| AI Agent Instructions | Yes |
| Change Policy | Yes |

---

# 5. Document Role Values

| Role | Meaning |
|------|---------|
| Canonical | Fuente oficial |
| Supporting | Documento complementario |
| Operational | Procedimiento operativo |
| Development | Guía de implementación |
| Governance | Gobierno del proyecto |
| Migration | Plan de migración |

---

# 6. Status Values

```text
Draft
Review
Approved
Production Baseline
Migration Baseline
Deprecated
```

---

# 7. Application Order

Aplicar este estándar en el siguiente orden:

1. `functional.md`
2. `database.md`
3. `kpi.md`
4. `api.md`
5. `rules-engine.md`
6. `dqbot-architecture.md`
7. `technology-stack.md`
8. `sop_sales_intelligence.md`
9. `sop_inventory_supply_intelligence.md`
10. `sop_ar_intelligence.md`
11. `AGENTS.md`
12. `repository-structure.md`
13. `project-governance.md`
14. `migration-plan.md`

---

# 8. Acceptance Criteria

Este estándar se considera aplicado cuando:

- todos los `.md` tienen bloque `Document Metadata`;
- las dependencias están claras;
- los agentes pueden identificar alcance y código relacionado;
- no existen documentos sin propietario ni estado;
- cada documento indica cómo debe ser usado por humanos y agentes de IA.

---

# End of Document