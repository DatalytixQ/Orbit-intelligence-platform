# Orchestrator Task Schema
**Version:** 1.0
**Purpose:** Defines the canonical task format for all Orchestrator agents executing against the Master Execution Plan v2.
**Authoritative source:** `master_execution_plan_v2.md`
**Date:** 2026-07-03

> Every task submitted to an Orchestrator agent MUST conform to this schema.
> Tasks that do not include all required fields must be rejected and returned for completion.

---

## SECTION 1 — TASK OBJECT SCHEMA

### 1.1 JSON Schema (Canonical)

```json
{
  "task": {
    "id": "string — unique task identifier (e.g. T001, N002, D002-fix)",
    "wave": "integer — execution wave (0–5)",
    "epic": "string — parent epic identifier (e.g. E1.2, E2.2, E0)",
    "title": "string — short human-readable task name",
    "description": "string — full task description including context",
    "capability": {
      "id": "integer — capability number (1–12)",
      "name": "string — capability name"
    },
    "runtime": {
      "type": "string — enum: database | backend | frontend | documentation | devops | qa | refactoring | dqbot | chief-architect",
      "environment": "string — where the task executes: supabase | node | nextjs | docs | shell"
    },
    "agent": {
      "type": "string — assigned agent role",
      "subagent": "string or null — specific subagent name if applicable"
    },
    "complexity": "string — enum: Low | Medium | High | Critical",
    "estimated_agent_days": "number — fractional agent-days to complete",
    "dependencies": {
      "task_ids": ["array of task IDs that must complete before this task starts"],
      "wave_gate": "string or null — wave name that must complete (e.g. 'Wave 0 Complete')",
      "external": ["array of non-task dependencies: business decisions, approvals, etc."]
    },
    "status": {
      "state": "string — enum: COMPLETED | PARTIAL | NOT_STARTED | BLOCKED | CANCELLED | INCORRECTLY_PLANNED",
      "completion_evidence": "string or null — evidence confirming completion (DB rows, file path, etc.)",
      "blocker": "string or null — description of what is blocking this task"
    },
    "execution_control": {
      "requires_user_approval": "boolean — true if task cannot start without explicit user approval",
      "requires_security_approval": "boolean — true if task modifies auth or RLS",
      "requires_business_decision": "boolean — true if task needs stakeholder input",
      "must_not_execute_yet": "boolean — true if preconditions not yet met",
      "execution_order": "integer — absolute execution order within wave (lower = earlier)",
      "can_parallel": "boolean — true if this task can run concurrently with others"
    },
    "acceptance_criteria": [
      "string — specific, verifiable criterion 1",
      "string — specific, verifiable criterion 2"
    ],
    "artifacts": {
      "inputs": ["list of files/tables/objects this task reads"],
      "outputs": ["list of files/tables/objects this task produces or modifies"]
    },
    "risk": {
      "level": "string — enum: CRITICAL | HIGH | MEDIUM | LOW",
      "risk_ids": ["array of R-series risk IDs from risk register"],
      "notes": "string or null"
    },
    "milestone": "string or null — milestone this task contributes to (e.g. M0, M2)"
  }
}
```

---

### 1.2 Enumerated Values Reference

| Field | Valid Values |
|-------|-------------|
| `wave` | 0, 1, 2, 3, 4, 5 |
| `complexity` | Low, Medium, High, Critical |
| `status.state` | COMPLETED, PARTIAL, NOT_STARTED, BLOCKED, CANCELLED, INCORRECTLY_PLANNED |
| `risk.level` | CRITICAL, HIGH, MEDIUM, LOW |
| `runtime.type` | database, backend, frontend, documentation, devops, qa, refactoring, dqbot, chief-architect |
| `runtime.environment` | supabase, node, nextjs, docs, shell |
| `agent.type` | Database Agent, Backend Agent, Frontend Agent, Documentation Agent, DevOps Agent, QA Agent, Refactoring Agent, DQBot Agent, Chief Architect Agent |

---

### 1.3 Execution Control Rules

| Rule | Description |
|------|-------------|
| `requires_user_approval: true` | Orchestrator MUST stop and request explicit user confirmation before proceeding. Used for: Wave 0 tasks, schema changes, security changes. |
| `requires_security_approval: true` | Implies `requires_user_approval: true`. Used for: RLS policy changes, JWT changes, auth middleware changes. |
| `requires_business_decision: true` | Orchestrator MUST stop and flag task as BLOCKED until user provides stakeholder input. Used for: E-series rules, Business Health Score formula. |
| `must_not_execute_yet: true` | Task is sequenced for a future wave. Orchestrator must not assign or start it. |
| `can_parallel: true` | Task may be run concurrently with other tasks in the same wave that also have `can_parallel: true` AND share no dependencies. |

---

## SECTION 2 — EXAMPLE TASK INSTANCES

### Example A — Completed Task

```json
{
  "task": {
    "id": "T019",
    "wave": 2,
    "epic": "E2.1",
    "title": "Create stg_ar_open_items_clean table",
    "description": "Create staging table for AR open items after normalization from raw_ar_open_items",
    "capability": { "id": 4, "name": "AR Intelligence" },
    "runtime": { "type": "database", "environment": "supabase" },
    "agent": { "type": "Database Agent", "subagent": null },
    "complexity": "Medium",
    "estimated_agent_days": 1.0,
    "dependencies": {
      "task_ids": [],
      "wave_gate": null,
      "external": []
    },
    "status": {
      "state": "COMPLETED",
      "completion_evidence": "Live DB: stg_ar_open_items_clean confirmed with 697 rows (2026-07-03 Supabase inspection)",
      "blocker": null
    },
    "execution_control": {
      "requires_user_approval": false,
      "requires_security_approval": false,
      "requires_business_decision": false,
      "must_not_execute_yet": false,
      "execution_order": 0,
      "can_parallel": false
    },
    "acceptance_criteria": [
      "Table stg_ar_open_items_clean exists in public schema",
      "Table contains normalized AR open item records",
      "Table is populated by refresh_stg_ar_open_items_clean() function"
    ],
    "artifacts": {
      "inputs": ["public.raw_ar_open_items"],
      "outputs": ["public.stg_ar_open_items_clean"]
    },
    "risk": { "level": "LOW", "risk_ids": [], "notes": null },
    "milestone": "M7"
  }
}
```

---

### Example B — Blocked by Security Approval

```json
{
  "task": {
    "id": "N001",
    "wave": 0,
    "epic": "E0",
    "title": "Define RLS policies on clients and app_users",
    "description": "Create PostgreSQL Row Level Security policies on the clients and app_users tables to enforce client_id isolation. Each authenticated user must only be able to read rows belonging to their own client_id.",
    "capability": { "id": 8, "name": "Auth and Multi-tenancy" },
    "runtime": { "type": "database", "environment": "supabase" },
    "agent": { "type": "Database Agent", "subagent": null },
    "complexity": "High",
    "estimated_agent_days": 3.0,
    "dependencies": {
      "task_ids": [],
      "wave_gate": null,
      "external": ["Explicit user approval for Wave 0 execution"]
    },
    "status": {
      "state": "BLOCKED",
      "completion_evidence": null,
      "blocker": "Wave 0 requires explicit user approval before any task begins. No autonomous execution permitted."
    },
    "execution_control": {
      "requires_user_approval": true,
      "requires_security_approval": true,
      "requires_business_decision": false,
      "must_not_execute_yet": true,
      "execution_order": 1,
      "can_parallel": true
    },
    "acceptance_criteria": [
      "RLS policy created on public.clients: users can only SELECT rows where client_id matches their JWT claim",
      "RLS policy created on public.app_users: users can only SELECT their own record",
      "Test query from non-matching user returns 0 rows (not error)",
      "Existing API functionality unaffected — backend service role bypasses RLS"
    ],
    "artifacts": {
      "inputs": ["public.clients", "public.app_users"],
      "outputs": ["Supabase migration: rls_clients_app_users.sql", "docs/architecture/project-governance.md (updated)"]
    },
    "risk": { "level": "CRITICAL", "risk_ids": ["R000"], "notes": "Failure to implement allows cross-tenant data access" },
    "milestone": "M0"
  }
}
```

---

### Example C — Blocked by Business Decision

```json
{
  "task": {
    "id": "T009",
    "wave": 1,
    "epic": "E1.3",
    "title": "Specify E001 cross-domain rule in rules-engine.md",
    "description": "Define the first E-series executive rule combining signals from Sales, Inventory, AR, and Supply domains into a unified cross-domain insight. Requires business stakeholder to define trigger conditions and severity thresholds.",
    "capability": { "id": 5, "name": "Executive Intelligence" },
    "runtime": { "type": "documentation", "environment": "docs" },
    "agent": { "type": "Chief Architect Agent", "subagent": null },
    "complexity": "High",
    "estimated_agent_days": 3.0,
    "dependencies": {
      "task_ids": [],
      "wave_gate": "Wave 0 Complete",
      "external": ["Business stakeholder must define: which cross-domain conditions trigger E001, severity bands, and business narrative"]
    },
    "status": {
      "state": "BLOCKED",
      "completion_evidence": null,
      "blocker": "E-series rules require business stakeholder input on trigger conditions. Cannot be specified by engineering alone. Wave 0 must also complete first."
    },
    "execution_control": {
      "requires_user_approval": false,
      "requires_security_approval": false,
      "requires_business_decision": true,
      "must_not_execute_yet": true,
      "execution_order": 1,
      "can_parallel": true
    },
    "acceptance_criteria": [
      "E001 rule fully documented in docs/business/rules-engine.md with: trigger formula, threshold values, severity classification, business narrative, and example scenarios",
      "Rule reviewed and approved by business stakeholder",
      "Documentation consistent with AGENTS.md Rule R001"
    ],
    "artifacts": {
      "inputs": ["docs/business/rules-engine.md", "docs/business/functional.md"],
      "outputs": ["docs/business/rules-engine.md (E001 section complete)"]
    },
    "risk": { "level": "CRITICAL", "risk_ids": ["R001"], "notes": "Blocks T010, T011, T012, T055, T056, T057, T058 — entire Wave 3 E-series chain" },
    "milestone": "M3"
  }
}
```

---

## SECTION 3 — AGENT ROLE DEFINITIONS

| Agent Role | Assigned Runtime | Responsible For |
|-----------|-----------------|-----------------|
| **Database Agent** | Supabase (MCP) | SQL migrations, RLS policies, views, functions, indexes |
| **Backend Agent** | Node.js / Express | Routes, services, middleware, API endpoints |
| **Frontend Agent** | Next.js | Pages, components, TypeScript, UI features |
| **Documentation Agent** | Markdown / docs/ | SOP files, database.md, kpi.md, api.md, rules-engine.md |
| **DevOps Agent** | Shell / config | Pipeline automation, pg_cron, n8n, environment config |
| **QA Agent** | Jest / Supertest / pgtap | Test setup, test authoring, test execution |
| **Refactoring Agent** | Node.js / Next.js | Type migrations (JSX→TSX), code cleanup, inline SQL extraction |
| **DQBot Agent** | Node.js | DQBot handlers, intentDetector, formatters, context builders |
| **Chief Architect Agent** | Docs + Code (read/design) | E-series rules, Business Health Score formula, architectural decisions |

---

## SECTION 4 — WAVE GATE PROTOCOL

Before any task in Wave N+1 is dispatched, the Orchestrator must verify:

1. All tasks in Wave N with `must_not_execute_yet: false` have `status.state = COMPLETED`
2. All milestone signals for Wave N are verifiable
3. User has been notified of wave completion
4. User has not issued a halt instruction
5. For Wave 1 specifically: Wave 0 completion must be confirmed by user (not just by task status)

**Wave gate confirmation format (Orchestrator must output before starting next wave):**

```
WAVE [N] GATE CHECK
───────────────────
Completed tasks: X / Y
Milestones reached: [list]
Blocked tasks (carried forward): [list or none]
Cancelled tasks: [list or none]
User notification: REQUIRED before Wave [N+1] starts
```

---

## SECTION 5 — TASK DISPATCH PROTOCOL

When the Orchestrator dispatches a task to an agent:

1. **Pre-dispatch check:** Verify all `dependencies.task_ids` have `status.state = COMPLETED`
2. **Approval check:** If `requires_user_approval: true` → STOP, request approval, wait
3. **Business check:** If `requires_business_decision: true` → STOP, flag as BLOCKED, notify user
4. **Conflict check:** Ensure no running task modifies the same output artifacts
5. **Dispatch:** Send task object (full JSON) to agent with instruction: "Execute exactly this task. Do not exceed task scope."
6. **Verify:** After agent completes, verify each acceptance criterion before marking `COMPLETED`
7. **Update:** Update `execution_queue.md` with new status and evidence

---

## SECTION 6 — STATUS TRANSITION RULES

```
NOT_STARTED → BLOCKED       (when dependency fails or approval required)
NOT_STARTED → IN_PROGRESS   (when dispatched to agent)
IN_PROGRESS → COMPLETED     (when all acceptance criteria verified)
IN_PROGRESS → PARTIAL       (when some criteria met; task needs continuation)
PARTIAL     → COMPLETED     (after continuation task completes all criteria)
BLOCKED     → NOT_STARTED   (when blocker is resolved)
COMPLETED   → (terminal)    (no transitions from COMPLETED)
CANCELLED   → (terminal)    (no transitions from CANCELLED)
```
