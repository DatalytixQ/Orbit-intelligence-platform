# Project State — Antigravity Operational Checkpoint
**File:** `docs/agents/platform/product-intelligence/project_state.md`
**Purpose:** Persistent resume point for all Antigravity agents. Read this file before taking any action.
**Last updated:** 2026-07-13 (N002 Phase 1 COMPLETED — 40 policies on 10 core business tables)
**Updated by:** Antigravity — Engineering Execution Agent

---

> **DEPRECATION NOTICE: ORCHESTRATION FRAMEWORK v1 IS ACTIVE**
> This legacy state document has been superseded.
> Execution state is now managed via `docs/orchestration/checkpoint_state.yaml` and `docs/orchestration/execution_log.md`.

> **RESUME INSTRUCTION**
> Read this file first. Continue from **Current Phase** and **Next Milestone**.
> Do not repeat discovery unless explicitly instructed.

---

## 1. Current Phase

```
Engineering Execution — Wave 0D / N002 Phase 2 COMPLETE / Phase 3 READY
```

Wave 0 Backend Track and N001 complete. N002 Phase 1 executed: 40 RLS policies on 10 core business tables. N002 Phase 2 executed: 36 RLS policies on 9 analytics & intelligence tables. 14/14 validations passed. Total policies in DB: 84. Phase 3 is ready. Awaiting user approval.

---

## 2. Completed Milestones

| # | Milestone | Date | Status |
|---|-----------|------|--------|
| 1 | Project entry documentation completed | 2026-07-03 | ✅ |
| 2 | Antigravity workspace connected | 2026-07-03 | ✅ |
| 3 | Repository discovery completed | 2026-07-03 | ✅ |
| 4 | Product inventory completed | 2026-07-03 | ✅ |
| 5 | Product Knowledge Graph generated | 2026-07-03 | ✅ |
| 6 | Product Analysis Report generated | 2026-07-03 | ✅ |
| 7 | Master Execution Plan generated (v1) | 2026-07-03 | ✅ |
| 8 | Supabase MCP connected | 2026-07-03 | ✅ |
| 9 | Database Ground Truth generated | 2026-07-03 | ✅ |
| 10 | Unified Product Graph generated (v2) | 2026-07-03 | ✅ |
| 11 | Reconciliation completed | 2026-07-03 | ✅ |
| 12 | Master Execution Plan v2 generated | 2026-07-03 | ✅ |
| 13 | Planning Engine created (execution_queue + schema + wave map) | 2026-07-03 | ✅ |
| 14 | Engineering Execution Readiness Review completed | 2026-07-04 | ✅ |
| 15 | N001 executed — RLS policies on clients + app_users (Wave 0B) | 2026-07-10 | ✅ |
| 16 | N002 Discovery Complete — Security architecture, classification, execution plan | 2026-07-10 | ✅ |
| 17 | N002 Phase 1 executed — 40 RLS policies on 10 core business tables | 2026-07-13 | ✅ |
| 18 | N002 Phase 2 executed — 36 RLS policies on 9 analytics & intelligence tables | 2026-07-13 | ✅ |


---

## 3. Current Source of Truth

The following documents are the canonical references for all future agents. When in conflict with older artifacts or source code comments, these documents take precedence. When in conflict with each other, use the order below (higher = more authoritative).

| Priority | Document | Location | Purpose |
|:--------:|----------|----------|---------|
| 1 | **Unified Product Graph v2** | `.gemini/antigravity/brain/.../unified_product_graph.md` | Canonical product architecture — verified against live DB |
| 2 | **Database Ground Truth** | `.gemini/antigravity/brain/.../database_ground_truth.md` | Live Supabase state — 90 tables, security + performance advisors |
| 3 | **Reconciliation Report** | `.gemini/antigravity/brain/.../reconciliation_report.md` | All discrepancies, task statuses, new tasks, revised health scores |
| 4 | **Master Execution Plan v2** | `.gemini/antigravity/brain/.../master_execution_plan_v2.md` | Canonical engineering roadmap — 6 waves, ~124 tasks |
| 5 | **README.md** | `README.md` | Project overview and entry point |
| 6 | **AGENTS.md** | `docs/AGENTS.md` | AI operating contract — governance rules R001–R010 |
| 7 | **documentation-index.md** | `docs/documentation-index.md` | Documentation hierarchy and reading order |

All agents must read the Unified Product Graph v2 and AGENTS.md before performing any task.

---

## 4. Current Product Understanding

The platform is an **Executive Decision Intelligence Platform** that transforms ERP operational information (source: **NetSuite**) into executive intelligence using a layered pipeline:

```
NetSuite ERP
  → RAW tables (source-fidelity landing zone)
  → STG tables (normalized, cleaned)
  → Business tables (consolidated domain models)
  → Semantic layer (SQL views: vw_*, materialized: *_semantic_current)
  → KPI objects (computed metrics)
  → Rules Engine (heuristic V/I/C/E series — triggers from thresholds)
  → Insight Engine (generate_insights_snapshot → insights_log)
  → Priority Engine (vw_priority_engine — ranked executive alerts)
  → API (Node/Express — /api/kpi/*, /api/analytics/*, /api/ai/*)
  → Frontend (Next.js — Sales, Inventory, Finance, Executive dashboards)
  → DQBot (natural language — heuristic/AI/hybrid mode via /api/ai/chat-v2)
```

**Capabilities and current maturity (revised after DB reconciliation):**

| # | Capability | Maturity | Critical Gap |
|---|-----------|:--------:|-------------|
| 1 | Sales Intelligence | 74% | Inline SQL in 2 routes; missing supply risk endpoint |
| 2 | Inventory Intelligence | 73% | Item resolution layer undocumented; no primary keys |
| 3 | Supply Intelligence | 57% | No dedicated API or dashboard |
| 4 | AR Intelligence | 66% | C-series rules not implemented; AR SOP missing |
| 5 | Executive Intelligence | 48% | E-series rules empty; Business Health Score not built |
| 6 | Insight Engine | 53% | Dual insight stores (insights 1,371 rows legacy + insights_log 5 rows current) |
| 7 | DQBot | 38% | Only 1 handler (i003); clientId hardcoded; prompts empty |
| 8 | Auth and Multi-tenancy | 43% | RLS enabled, ZERO policies — critical security gap |
| 9 | Platform Shell | 65% | Auth token injection unverified in frontend |
| 10 | Operational Pipeline | 45% | Pipeline not automated; data_pipeline_step_log exists but empty |
| 11 | Configuration Engine | 42% | 11 config tables exist but undocumented; no API or UI |
| 12 | Documentation Governance | 69% | 27 undocumented DB objects; naming errors; agents/prompts/ empty |

**Overall platform maturity: ~56%**

**Key confirmed facts:**
- ERP source: NetSuite
- Database: PostgreSQL 17.6.1 on Supabase (us-west-2)
- Total tables: 90 (60 with data, 30 empty, 14 are backup/validation tables)
- Total approximate rows: ~820,000+
- Active clients: 1 | Active users: 1
- DQBot calls logged: 21 (platform is actively used)
- Extensions installed: plpgsql, unaccent, pg_stat_statements, uuid-ossp, pgcrypto, supabase_vault
- Extensions available but not installed: pg_cron (pipeline scheduling), vector/pgvector (semantic search), pgtap (DB testing)

---

## 5. Current Risks

The following risks are active and must be considered before any execution task is assigned.

| Priority | Risk ID | Description | Status |
|:--------:|---------|-------------|--------|
| P0 | R000 | **Zero RLS policies on 90 tables** — Multi-tenancy claims in docs are false; any authenticated Supabase user can read all rows of any table. No tenant isolation exists at the database layer. | CONFIRMED — must be Wave 0 |
| P0 | R011 | **JWT_SECRET defaults to 'dev_secret_change_me'** — All tokens trivially forgeable if default not overridden in production | CONFIRMED |
| P0 | — | **clientId hardcoded as 'vonderk' in routes/ai.js** — All DQBot queries return one tenant's data regardless of authenticated user | CONFIRMED — T001 |
| P1 | R001 | E-series rule specification requires business stakeholder input and blocks Wave 3 | Active |
| P1 | R002 | Business Health Score formula requires business validation and blocks M11 | Active |
| P2 | R013 | Dual insight stores (insights 1,371 rows legacy + insights_log 5 rows current) — data consistency risk; migration in progress but incomplete | Active — N004 |
| P2 | R003 | vw_sales_pipeline_vs_supply semantic view — performance unknown at 48K row scale | Active |
| P2 | R004 | DQBot AI mode hallucination without data grounding context | Active |
| P2 | R014 | 47 core tables without primary keys (including sales, sales_lines, inventory) — performance at scale | Confirmed — N009 |
| P2 | R016 | data_pipeline_step_log exists but is empty — pipeline is unobservable | Confirmed — N017 |
| P2 | R012 | AR SOP (sop_ar_intelligence.md) does not exist — gates all C-series rule implementation | Active — T006 |
| P3 | R010 | WCAG color contrast may require design system changes in Wave 5 | Active |
| P3 | R015 | 14 backup/validation tables in production schema | Confirmed — N010 |
| P3 | — | tmp_subsidiaries temporary table in production schema | Confirmed — N011 |
| P3 | — | docs/agents/prompts/ directory is empty — zero prompt governance | Active — T079 |

**Incomplete test coverage:** Zero automated tests exist (no Jest, no React Testing Library setup, no pgtap). All functionality is manually verified only.

**UI/UX and responsive gaps:** No mobile navigation, no responsive chart handling, no ARIA labels confirmed on interactive elements.

**Production readiness:** Not yet validated. No staging deployment has been documented. No load testing has been performed.

---

## 6. Current Execution Status

```
No autonomous execution has started yet.
System is ready to prepare the execution queue.
```

**Wave 0 — Backend Track:** ✅ COMPLETED (2026-07-04)
- T001: Extract clientId from JWT in routes/ai.js — ✅ COMPLETED
- T002: Extract requireAuth to middleware/auth.js — ✅ COMPLETED
- T005: Validate JWT_SECRET at startup — ✅ COMPLETED

**Wave 0B — Database Track:** ✅ COMPLETED (2026-07-10)
- N001: RLS policies on clients + app_users — ✅ COMPLETED (8 policies, 5/5 validations passed)

**Wave 0C — N002 Discovery:** ✅ COMPLETED (2026-07-10)
- N002 Security Architecture — ✅ COMPLETE
- N002 Table Classification (A/B/C/D) — ✅ COMPLETE
- N002 Execution Strategy — ✅ COMPLETE
- N002 Execution Plan (5 phases) — ✅ COMPLETE

**Wave 0D — N002 Execution:**
- Phase 1: Core Business Tables (10 tables, 40 policies) — ✅ COMPLETED (2026-07-13, 13/13 validations passed)
- Phase 2: Analytics & Intelligence (9 tables, 36 policies) — ✅ COMPLETED (2026-07-13, 14/14 validations passed)
- Phase 3: Config, Audit & AI (8 tables, 32 policies) — 🟢 READY
- Phase 4: Reference & System (52 tables, 0 policies, doc only) — 🟢 READY
- Phase 5: Schema Evolution (17 tables, deferred) — ⛔ NOT READY (requires ALTER TABLE)

**Wave 1 (Foundation):** Not started.

**Waves 2–5:** Not started.

**Tasks confirmed already completed (from Database Ground Truth):**
- T019 — stg_ar_open_items_clean created (697 rows live)
- T020 — refresh_stg_ar_open_items_clean() implemented (table is populated)
- T106 — business_rule_thresholds created (15 rows live; plan incorrectly called it rule_thresholds)

**Tasks confirmed incorrectly planned:**
- T014 — Was "create pipeline_run_log"; revised to N017 "activate data_pipeline_step_log" (table already exists)

---

## 7. Next Milestone

```
Wave 0 — Complete Backend Track → Await N001/N002 Approval
```

Backend Track (T001, T002, T005) executing now. After completion:
1. Deliver post-execution report
2. Await explicit approval for Database Track (N001, N002)
3. After N001+N002: Wave 0 complete → Wave 1 may start

---

## 8. Immediate Next Actions

The following actions must be performed in order. No action may skip ahead without completing the prerequisites.

| Step | Action | Status | Output |
|------|--------|--------|--------|
| 1 | Generate execution_queue.md | ✅ DONE | 121-task queue with full metadata |
| 2 | Define orchestrator_task_schema.md | ✅ DONE | JSON schema + dispatch protocol + wave gate rules |
| 3 | Generate wave_execution_map.md | ✅ DONE | Visual parallel/sequential execution topology |
| 4 | **Submit Wave 0 for user approval** | ⏳ WAITING | User must explicitly approve N001, N002, T001, T002, T005 |
| 5 | **Execute Wave 0** | 🚫 NOT STARTED | Dispatch only after Step 4 approval received |

> Step 5 requires explicit user approval. Do not execute Wave 0 autonomously.

---

## 9. Active Constraints

All agents operating under this project state must respect the following constraints. Violation of any constraint requires immediate halt and user notification.

### Database Constraints

| Constraint | Detail |
|-----------|--------|
| **Supabase: READ ONLY** | MCP operations limited to: list_projects, get_project, list_tables, list_extensions, get_logs, get_advisors, search_docs |
| **No migrations** | apply_migration is prohibited until Wave 0 is approved and execution begins |
| **No schema changes** | No execute_sql with DDL (CREATE, ALTER, DROP) without explicit task authorization |
| **No data modifications** | No execute_sql with DML (INSERT, UPDATE, DELETE) without explicit task authorization |

### Code Constraints

| Constraint | Detail |
|-----------|--------|
| **No code changes without explicit task** | Every code modification must trace to a task ID in master_execution_plan_v2.md |
| **No code changes without documentation update** | Per AGENTS.md Rule R001: implementation and documentation must be updated together |
| **No new files without justification** | Every new file must have a task ID and documented purpose |

### Execution Constraints

| Constraint | Detail |
|-----------|--------|
| **No autonomous execution until Planning Engine is created** | The execution queue and orchestrator task format must be defined and approved first |
| **Wave 0 requires explicit user approval** | Security tasks (RLS policies, clientId fix, JWT validation) cannot start autonomously |
| **Each wave requires completion criteria review** | Before starting Wave N+1, completion criteria for Wave N must be verified |
| **Product Knowledge Graph is canonical** | The Unified Product Graph v2 is the authoritative product description. Agents must not rebuild it from scratch. |

---

## 10. Resume Instruction

> **Read this file first. Continue from Current Phase and Next Milestone. Do not repeat discovery unless instructed.**

When resuming from a checkpoint:

1. **Read this file** (project_state.md) before any other action
2. **Read** docs/AGENTS.md — confirm operating rules R001–R010
3. **Read** docs/documentation-index.md — confirm document hierarchy
4. **Check Current Phase** — confirm you are operating in the correct phase
5. **Check Next Milestone** — begin work from the stated next milestone
6. **Do not re-read** the entire repository unless a specific task requires it
7. **Do not rebuild** the Product Knowledge Graph or Unified Product Graph — use existing artifacts
8. **Do not re-run** Supabase discovery — use database_ground_truth.md as source
9. **Do not regenerate** the Reconciliation Report or Master Execution Plan v2 — they are current
10. **Reference task IDs** from master_execution_plan_v2.md for every engineering action

### Phase Transition Protocol

When a phase change occurs, update this file with:
- New Current Phase value
- New completed milestone entry
- Updated Current Execution Status
- Updated Next Milestone
- Any new risks discovered
- Date and agent identity of update

### Artifact Registry

All discovery artifacts produced during this session are located at:

```
C:\Users\dario\.gemini\antigravity\brain\b55d750e-5112-435c-b7d3-7d172d1935bf\
  product_knowledge.md         — Level 1–12 hierarchy (superseded by unified_product_graph.md)
  product_inventory.md         — Business capability inventory
  product_graph.md             — Original graph (superseded by unified_product_graph.md)
  product_analysis_report.md   — 20-dimension capability analysis
  master_execution_plan.md     — v1 (superseded by master_execution_plan_v2.md)
  database_ground_truth.md     — Live Supabase state: 90 tables, advisors
  unified_product_graph.md     ★ CANONICAL PRODUCT GRAPH
  reconciliation_report.md     ★ CANONICAL RECONCILIATION
  master_execution_plan_v2.md  ★ CANONICAL EXECUTION PLAN
```

**Files marked with ★ are the current canonical documents. Use these. Ignore superseded versions.**
