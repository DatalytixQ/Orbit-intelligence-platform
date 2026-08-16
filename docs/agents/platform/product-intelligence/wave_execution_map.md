# Wave Execution Map
**Version:** 1.0
**Source:** master_execution_plan_v2.md
**Date:** 2026-07-03
**Purpose:** Visual execution topology — parallel tracks, critical path, blocked tasks, approval gates.

> **HOW TO READ THIS MAP**
> - Each wave is a separate section with a parallel execution diagram
> - Tasks on the same horizontal level can run concurrently
> - Tasks connected by arrows are sequential (dependency order)
> - 🔴 = blocked by security approval | 🟠 = blocked by business decision | 🟡 = blocked by prior task | 🟢 = ready | ✅ = completed | ⛔ = cancelled

---

## WAVE 0 — SECURITY EMERGENCY
**Gate:** User explicit approval required before ANY Wave 0 task starts
**Objective:** Enforce multi-tenancy — RLS policies + clientId fix + JWT validation
**Est. calendar:** ~2 days | **Est. agent-days:** ~8
**Milestone:** M0 — Platform Secured

```
APPROVAL GATE 🔴 (User must approve before this wave starts)
│
├── TRACK A: Database Agent
│   ├── [Exec order 1] N001 — RLS policies on clients + app_users (3d) ✅
│   │       complexity: HIGH | risk: CRITICAL | security-approval: YES
│   │       criteria: SELECT returns only own-client rows; service role bypasses RLS
│   │       artifacts-out: migration/rls_clients_app_users.sql
│   │       ↓
│   └── [Exec order 2] N002 — RLS policies on 27 domain tables (3 phases) 🟡 deps: N001 (Phase 1-2 ✅ / Phase 3 🟢)
│           complexity: HIGH | risk: CRITICAL | security-approval: YES
│           criteria: sales, inventory, finance_ar, insights, customers all enforce client_id
│           artifacts-out: migration/rls_domain_tables.sql
│
└── TRACK B: Backend Agent (parallel with Track A)
    ├── [Exec order 1] T001 — Extract clientId from JWT in routes/ai.js (0.5d) 🔴
    │       complexity: LOW | risk: CRITICAL | security-approval: YES
    │       criteria: 'vonderk' string absent; req.user.client_id used
    │       artifacts-out: backend/routes/ai.js (modified)
    │
    ├── [Exec order 1] T002 — Extract requireAuth to middleware/auth.js (0.5d) 🔴
    │       complexity: LOW | risk: HIGH | security-approval: YES
    │       criteria: backend/middleware/auth.js exists; imported by all protected routes
    │       artifacts-out: backend/middleware/auth.js (new), all route files (modified imports)
    │
    └── [Exec order 1] T005 — Validate JWT_SECRET at startup (0.5d) 🔴
            complexity: LOW | risk: CRITICAL | security-approval: YES
            criteria: Server refuses start with 'dev_secret_change_me'; startup log shows validation
            artifacts-out: backend/app.js or backend/server.js (modified)

WAVE 0 COMPLETION CRITERIA:
  ✓ N001 COMPLETED + N002 Phase 1-2 COMPLETED
  ✓ T001 COMPLETED + T002 COMPLETED + T005 COMPLETED
  ✓ User notified → Wave 1 may start
```

**Critical path in Wave 0:** N001 → N002 (sequential, 7 agent-days)
**Parallel opportunity:** N001+N002 (DB Track) can run in parallel with T001+T002+T005 (Backend Track)

---

## WAVE 1 — FOUNDATION
**Gate:** Wave 0 COMPLETED + user notified
**Objective:** Documentation debt, AR governance, E-series spec, pipeline observability
**Est. calendar:** ~6 days | **Est. agent-days:** ~22
**Milestones:** M1, M2, M3, M4, M5

```
WAVE 0 COMPLETE ──────────────────────────────────────────┐
                                                           │
├── EPIC E1.1 — Token Lifecycle (Backend Agent)            │
│   ├── [Exec 1] T003 — POST /api/auth/refresh-token (1d) 🟡 deps: T002
│   │       complexity: MEDIUM | risk: MEDIUM
│   │       criteria: Returns new access+refresh tokens; validated by QA
│   │       artifacts-out: backend/routes/auth.js (refresh endpoint added)
│   │       ↓
│   └── [Exec 2] T004 — POST /api/auth/logout (1d) 🟡 deps: T002
│           complexity: MEDIUM | risk: MEDIUM
│           criteria: Token invalidated; returns 200; subsequent requests with old token rejected
│           artifacts-out: backend/routes/auth.js (logout endpoint added)
│           → MILESTONE M1: Token Lifecycle
│
├── EPIC E1.2 — AR Domain Governance (Documentation Agent) │
│   ├── [Exec 1] T006 — Author sop_ar_intelligence.md (3d) 🟢 no deps
│   │       complexity: HIGH | risk: HIGH (R012)
│   │       criteria: SOP covers: purpose, KPIs, rules, pipeline, API, DQBot, dashboard
│   │       artifacts-out: docs/sop/sop_ar_intelligence.md (new)
│   │       ↓
│   ├── [Exec 2] T007 — Complete AR KPI formulas (1.5d) 🟡 deps: T006
│   │       complexity: MEDIUM | risk: MEDIUM
│   │       criteria: AR001–AR004 + collection efficiency fully specified with formulas
│   │       artifacts-out: docs/business/kpi.md (AR section complete)
│   │       ↓
│   ├── [Exec 2] T008 — Document AR semantic views (1d) 🟡 deps: T006
│   │       complexity: MEDIUM | risk: MEDIUM
│   │       criteria: vw_ar_dso, vw_collection_efficiency specified before implementation
│   │       artifacts-out: docs/business/database.md (AR semantic views added)
│   │       ↓
│   └── [Exec 3] N003 — Document Customer Payments domain (1.5d) 🟡 deps: T006
│           complexity: MEDIUM | risk: MEDIUM
│           criteria: raw_customer_payments→stg_customer_payments_clean→customer_payments documented
│           artifacts-out: docs/business/database.md, docs/business/kpi.md
│           → MILESTONE M2: AR Governed
│
├── EPIC E1.3 — Executive Rules Specification (Chief Architect Agent)
│   ├── [Exec 1] T009 — Specify E001 rule (3d) 🟠 BUSINESS DECISION REQUIRED
│   │       complexity: HIGH | risk: CRITICAL (R001)
│   │       BLOCKED: Requires business stakeholder to define cross-domain trigger conditions
│   │       criteria: E001 specified in rules-engine.md; approved by stakeholder
│   │       artifacts-out: docs/business/rules-engine.md (E001 section)
│   │       ↓
│   ├── [Exec 2] T010 — Specify E002 rule (2d) 🟡 deps: T009
│   │       complexity: HIGH | risk: CRITICAL (R001)
│   │       criteria: E002 specified; approved
│   │       artifacts-out: docs/business/rules-engine.md (E002 section)
│   │       ↓
│   ├── [Exec 3] T011 — Specify E003 rule (2d) 🟡 deps: T010
│   │       complexity: HIGH | risk: CRITICAL (R001)
│   │       criteria: E003 specified; approved
│   │       artifacts-out: docs/business/rules-engine.md (E003 section)
│   │       ↓
│   ├── [Exec 4] T012 — Define Business Health Score formula (2d) 🟡 deps: T009–T011
│   │       complexity: HIGH | risk: CRITICAL (R002)
│   │       BLOCKED: Formula requires business validation of weights and bands
│   │       criteria: Formula with weights, normalization, bands in functional.md; approved
│   │       artifacts-out: docs/business/functional.md (BHS formula)
│   │       ↓
│   └── [Exec 5] T013 — Define EX001, EX002 KPI specs (1d) 🟡 deps: T012
│           complexity: MEDIUM | risk: HIGH
│           criteria: EX001 + EX002 fully specified with formulas in kpi.md
│           artifacts-out: docs/business/kpi.md (executive section complete)
│           → MILESTONE M3: Executive Architecture
│
├── EPIC E1.4 — Pipeline Observability (Database Agent + Backend Agent + DevOps Agent)
│   │
│   ├── TRACK A: Database Agent (parallel)
│   │   └── [Exec 1] N017 — Activate data_pipeline_step_log (2d) 🟢 no deps
│   │           complexity: MEDIUM | risk: HIGH (R016)
│   │           criteria: All pipeline functions write start+end records; table has rows after run
│   │           artifacts-out: Supabase function modifications (each pipeline fn updated)
│   │
│   ├── TRACK B: DevOps Agent (parallel)
│   │   ├── [Exec 1] N012 — Evaluate pg_cron vs n8n (0.5d) 🟢 no deps
│   │   │       complexity: LOW | risk: LOW
│   │   │       criteria: Decision document; recommendation with justification
│   │   │       artifacts-out: docs/operating-model/pipeline-automation-decision.md (new)
│   │   │       ↓
│   │   └── [Exec 2] T016 — Design chosen pipeline automation (1.5d) 🟡 deps: N012
│   │           complexity: MEDIUM | risk: MEDIUM
│   │           criteria: Workflow design document for n8n OR pg_cron schedule
│   │           artifacts-out: docs/operating-model/pipeline-automation-design.md (new)
│   │
│   └── TRACK C: Backend Agent (depends on N017)
│       ├── [Exec 2] T017 — GET /api/pipeline/status (1d) 🟡 deps: N017
│       │       complexity: LOW | risk: LOW
│       │       criteria: Returns last run, status, timestamp, domains; 200 response
│       │       artifacts-out: backend/routes/pipeline.js (new)
│       │       ↓
│       └── [Exec 3] T015 — Verify data_pipeline_step_log (0.5d) 🟡 deps: N017 [QA Agent]
│               complexity: LOW | risk: LOW
│               criteria: QA triggers pipeline fn; confirms row appears in log
│               artifacts-out: QA verification report
│       ↓
│       [Exec 4] T018 — Data freshness headers on KPI endpoints (1.5d) 🟡 deps: N017
│               complexity: MEDIUM | risk: LOW
│               criteria: All KPI responses include X-Data-As-Of header with ISO timestamp
│               artifacts-out: backend/routes/*.js (all KPI routes modified)
│               → MILESTONE M4: Pipeline Observable
│
└── EPIC E1.5 — Documentation Debt (Documentation Agent — all parallel, no deps)
    ├── [Exec 1] D002-fix — Correct finance_ar_open_items name in database.md (0.5d) 🟢
    │       complexity: LOW | criteria: No references to finance_ar_open_items_cxc remain
    │       artifacts-out: docs/business/database.md
    │
    ├── [Exec 1] N005 — Document ar_settings, inventory_settings, alert_config, client_config (1d) 🟢
    │       complexity: MEDIUM | criteria: All 4 tables documented with schema and purpose
    │       artifacts-out: docs/business/database.md (config tables section)
    │
    ├── [Exec 1] N006 — Document sales_semantic_current (0.5d) 🟢
    │       complexity: LOW | criteria: 48K-row materialized table documented with refresh pattern
    │       artifacts-out: docs/business/database.md (sales semantic section)
    │
    ├── [Exec 1] N007 — Document item master resolution layer (1d) 🟢
    │       complexity: MEDIUM | criteria: 5 item resolution tables documented
    │       artifacts-out: docs/business/database.md (item master section)
    │
    ├── [Exec 1] N008 — Document SOP tables (0.5d) 🟢
    │       complexity: LOW | criteria: sop_inventory_supply_intelligence + sop_business_pipeline documented
    │       artifacts-out: docs/business/database.md (SOP tables section)
    │
    ├── [Exec 1] N015 — Document inventory_supply_snapshot_daily (0.5d) 🟢
    │       complexity: LOW | criteria: Table documented with refresh pattern + supply trend use
    │       artifacts-out: docs/business/database.md (supply section)
    │
    ├── [Exec 1] N016 — Add NetSuite to all relevant docs (0.5d) 🟢
    │       complexity: LOW | criteria: technology-stack.md, functional.md, database.md reference NetSuite
    │       artifacts-out: 3 documentation files
    │
    └── [Exec 2] D001-fix — Correct RLS claim in project-governance.md (0.5d) 🟡 deps: N002
            complexity: LOW | criteria: False RLS isolation claim removed; actual policy status stated
            artifacts-out: docs/architecture/project-governance.md
            → MILESTONE M5: Documentation Debt Cleared

WAVE 1 COMPLETION CRITERIA:
  ✓ M1 (Token Lifecycle): T003 + T004 COMPLETED
  ✓ M2 (AR Governed): T006 + T007 + T008 + N003 COMPLETED
  ✓ M3 (Executive Architecture): T009–T013 COMPLETED (requires business approval)
  ✓ M4 (Pipeline Observable): N017 + T017 + T018 COMPLETED
  ✓ M5 (Documentation Debt): All E1.5 tasks COMPLETED
  ✓ User notified → Wave 2 may start
```

**Critical path in Wave 1:** T006 → N003 (for AR; feeds Wave 2 C-series)
**Critical path in Wave 1:** T009 → T010 → T011 → T012 → T013 (for Executive; feeds Wave 3)
**Longest blocked chain:** T009 is BLOCKED by business decision — if not resolved by Wave 1 end, Wave 3 is delayed
**Parallel opportunities:**
- E1.2 Track A, E1.3, E1.4 Track A, E1.4 Track B, E1.5 can all start simultaneously
- All E1.5 tasks are fully parallel among themselves

---

## WAVE 2 — RULES COMPLETION + INSIGHT RECONCILIATION
**Gate:** Wave 1 COMPLETED (M1 through M5 all reached) + user notified
**Objective:** C-series rules live, DQBot speaks finance, insight store unified, insight UI built
**Est. calendar:** ~8 days | **Est. agent-days:** ~27
**Milestones:** M6, M7, M8, M9

```
WAVE 1 COMPLETE ──────────────────────────────────────────┐
                                                           │
├── EPIC E2.0 — Dual Insight Store Reconciliation
│   ├── [Exec 1] N004a — Audit insights vs insights_log (0.5d) 🟢 no deps [Backend Agent]
│   │       complexity: LOW | risk: HIGH (R013)
│   │       criteria: Confirmed which frontend components query insights vs insights_log
│   │       artifacts-out: audit report (inline in code review or separate note)
│   │       ↓
│   ├── [Exec 2] N004b — Migrate frontend from legacy insights (1.5d) 🟡 deps: N004a [Frontend Agent]
│   │       complexity: MEDIUM | risk: HIGH (R013)
│   │       criteria: No frontend component queries insights table; all use insights_log
│   │       artifacts-out: frontend component files (modified queries)
│   │       ↓
│   └── [Exec 3] N004c — Migrate insight data to insights_log (1.5d) 🟡 deps: N004b [Database Agent]
│           complexity: MEDIUM | risk: HIGH (R013)
│           criteria: Active insights in insights_log; insights table archived (not dropped)
│           artifacts-out: Supabase migration: migrate_insights_to_insights_log.sql
│           → MILESTONE M6: Insight Store Unified
│
├── EPIC E2.1 — AR STG Integration
│   └── [Exec 1] T021 — Integrate AR STG into pipeline sequence (0.5d) 🟡 deps: T016 [Database Agent]
│           complexity: LOW | risk: LOW
│           criteria: AR STG refresh appears in pipeline workflow definition
│           artifacts-out: pipeline automation config (n8n or pg_cron schedule)
│
├── EPIC E2.2 — C-Series Rule Implementation (Database Agent)
│   ├── [Exec 1] T022 — Create vw_ar_dso semantic view (1.5d) 🟡 deps: T006, T008
│   │       complexity: MEDIUM | risk: MEDIUM
│   │       criteria: View computes DSO; documented in database.md; tested with sample data
│   │       artifacts-out: Supabase: vw_ar_dso (new view)
│   │       ↓
│   ├── [Exec 2] T023 — Create vw_collection_efficiency view (1.5d) 🟡 deps: N003, T022
│   │       complexity: MEDIUM | risk: MEDIUM
│   │       criteria: Uses customer_payments (36K rows); collection rate computed; documented
│   │       artifacts-out: Supabase: vw_collection_efficiency (new view)
│   │       ↓  (T024, T025, T026, T027, T028 can run in parallel after T022/T023)
│   ├── [Exec 3a] T024 — Implement C001 (Overdue Receivables) (2d) 🟡 deps: T022, T023
│   │       complexity: HIGH | risk: HIGH
│   │       criteria: C001 generates insights_log entries; severity HIGH when overdue > threshold
│   │       artifacts-out: Supabase: C001 rule logic in insight generation function
│   │
│   ├── [Exec 3b] T025 — Implement C002 (DSO Deterioration) (2d) 🟡 deps: T022 [parallel]
│   │       complexity: HIGH | criteria: C002 generates insights; DSO trend computed
│   │       artifacts-out: Supabase: C002 rule logic
│   │
│   ├── [Exec 3c] T026 — Implement C003 (Customer Credit Risk) (2d) 🟡 deps: T022 [parallel]
│   │       complexity: HIGH | criteria: C003 generates insights; risk score computed
│   │       artifacts-out: Supabase: C003 rule logic
│   │
│   ├── [Exec 3d] T027 — Implement C004 (Collection Forecast Risk) (2d) 🟡 deps: T023 [parallel]
│   │       complexity: HIGH | criteria: C004 generates insights using customer_payments data
│   │       artifacts-out: Supabase: C004 rule logic
│   │
│   ├── [Exec 3e] T028 — Implement C005 (Critical Overdue Documents) (2d) 🟡 deps: T022 [parallel]
│   │       complexity: HIGH | criteria: C005 generates insights; individual document alerts
│   │       artifacts-out: Supabase: C005 rule logic
│   │       ↓  (all 5 C-series must complete before T029)
│   └── [Exec 4] T029 — Update vw_priority_engine for C-series (1d) 🟡 deps: T024–T028
│           complexity: MEDIUM | criteria: Priority engine ranks C-series alongside V/I series
│           artifacts-out: Supabase: vw_priority_engine (updated)
│           → MILESTONE M7: AR Intelligence Activated
│
├── EPIC E2.3 — DQBot Tier 1 Handlers (DQBot Agent)
│   ├── [Exec 1] T030 — v002.handler.js (Forecast Deviation) (1.5d) 🟡 deps: T001
│   │       complexity: MEDIUM | risk: MEDIUM (R007)
│   │       criteria: Handler routes forecast questions; returns structured data + narrative
│   │       artifacts-out: backend/services/dqbot/handlers/v002.handler.js (new)
│   │       ↓
│   ├── [Exec 2] T031 — v001.handler.js (Forecast Achievement) (1.5d) 🟡 deps: T030
│   │       complexity: MEDIUM | criteria: Handler answers "are we on track?" questions
│   │       artifacts-out: backend/services/dqbot/handlers/v001.handler.js (new)
│   │
│   ├── [Exec 2] T032 — c001.handler.js (Overdue Receivables) (1.5d) 🟡 deps: T024, T001
│   │       complexity: MEDIUM | criteria: Handler answers AR overdue questions with C001 data
│   │       artifacts-out: backend/services/dqbot/handlers/c001.handler.js (new)
│   │       ↓  (both T031 and T032 must complete)
│   ├── [Exec 3] T033 — Expand intentDetector for V001, V002, C001 (1d) 🟡 deps: T030–T032
│   │       complexity: LOW | risk: MEDIUM (R007)
│   │       criteria: Keywords correctly routed; no regressions on existing I003 handler
│   │       artifacts-out: backend/services/dqbot/intentDetector.js (modified)
│   │       ↓
│   └── [Exec 4] T034 — Expand buildSuggestedQuestions() (0.5d) 🟡 deps: T033
│           complexity: LOW | criteria: Contextual follow-up questions for V001, V002, C001
│           artifacts-out: backend/services/dqbot/formatters.js or intentDetector.js (modified)
│           → MILESTONE M8: DQBot Speaks Finance
│
└── EPIC E2.4 — Insight Engine UI (Frontend Agent + Refactoring Agent)
    ├── [Exec 1] T038 — Convert InsightsPanel.jsx → .tsx (1d) 🟢 no deps [Refactoring Agent]
    │       complexity: LOW | criteria: TypeScript; fully typed; no JSX remain in this file
    │       artifacts-out: frontend/components/insights/InsightsPanel.tsx (renamed + typed)
    │
    ├── [Exec 2] T035 — Build app/insights/[id]/page.tsx (2d) 🟡 deps: N004 complete [Frontend Agent]
    │       complexity: MEDIUM | criteria: Detail page renders insight with all fields
    │       artifacts-out: frontend/app/insights/[id]/page.tsx (new)
    │       ↓
    ├── [Exec 3a] T036 — InsightEvolutionChart component (1.5d) 🟡 deps: T035 [parallel]
    │       complexity: MEDIUM | criteria: Time-series chart of metric evolution renders
    │       artifacts-out: frontend/components/InsightEvolutionChart.tsx (new)
    │
    ├── [Exec 3b] T037 — ActionManagementTable component (1.5d) 🟡 deps: T035 [parallel]
    │       complexity: MEDIUM | criteria: PATCH action status works via UI
    │       artifacts-out: frontend/components/ActionManagementTable.tsx (new)
    │       ↓  (T036 + T037 must complete)
    └── [Exec 4] T039 — Expand insights/page.tsx from stub (2d) 🟡 deps: T035, T038
            complexity: MEDIUM | criteria: Full listing page with filters; replaces 987-byte stub
            artifacts-out: frontend/app/insights/page.tsx (replaced)
            → MILESTONE M9: Insight UI Complete

WAVE 2 COMPLETION CRITERIA:
  ✓ M6 (Insight Store Unified): N004a + N004b + N004c COMPLETED
  ✓ M7 (AR Intelligence Activated): T022–T029 COMPLETED
  ✓ M8 (DQBot Speaks Finance): T030–T034 COMPLETED
  ✓ M9 (Insight UI Complete): T035–T039 COMPLETED
  ✓ User notified → Wave 3 may start
```

**Critical path in Wave 2:** T022 → T023 → T027 → T029 (AR; 6 agent-days)
**Parallel opportunities:**
- T024, T025, T026, T027, T028 can all run in parallel after T022+T023
- E2.0, E2.3 Track A (T030), E2.4 T038 can start simultaneously at Wave 2 open
- T035 (insight detail page) can start as soon as N004 is complete

---

## WAVE 3 — INTELLIGENCE EXPANSION
**Gate:** Wave 2 COMPLETED (M6–M9 all reached) + user notified
**Objective:** Supply first-class, Business Health Score, E-series rules live, Sales completion
**Est. calendar:** ~8 days | **Est. agent-days:** ~28
**Milestones:** M10, M11, M12, M13

```
WAVE 2 COMPLETE ──────────────────────────────────────────┐
                                                           │
├── EPIC E3.1 — Supply Dedicated API + Dashboard (Backend + Frontend + Database + Documentation)
│   ├── TRACK A: Database Agent
│   │   └── [Exec 1] T040 — Backend/routes/supply.js scaffold (0.5d) 🟢
│   │           artifacts-out: backend/routes/supply.js (new)
│   │           ↓
│   ├── TRACK B: Backend Agent (parallel after T040)
│   │   ├── [Exec 2a] T041 — GET /api/supply/pipeline-summary (1d) 🟡 deps: T040
│   │   ├── [Exec 2b] T042 — GET /api/supply/pipeline-vs-supply (1d) 🟡 deps: T040 [parallel]
│   │   ├── [Exec 2c] T043 — GET /api/supply/risk-by-customer (1d) 🟡 deps: T040 [parallel]
│   │   └── [Exec 2d] T044 — GET /api/supply/inbound-timeline (1d) 🟡 deps: T040 [parallel]
│   │           ↓  (all 4 endpoints complete)
│   ├── TRACK C: Frontend Agent (after endpoints complete)
│   │   ├── [Exec 3] T045 — app/supply/page.tsx (2d) 🟡 deps: T041–T044
│   │   │       artifacts-out: frontend/app/supply/page.tsx (new)
│   │   │       ↓
│   │   ├── [Exec 4a] T046 — SupplyPipelineChart component (1.5d) 🟡 deps: T045 [parallel]
│   │   └── [Exec 4b] T047 — SupplyRiskCustomerTable component (1.5d) 🟡 deps: T045 [parallel]
│   │
│   └── TRACK D: Documentation Agent (parallel with other tracks)
│       └── [Exec 1] T048 — Document supply API in api.md (1d) 🟢
│               artifacts-out: docs/business/api.md (supply section)
│               → MILESTONE M10: Supply First-Class
│
├── EPIC E3.2 — Business Health Score (Database + Backend + Frontend)
│   ├── [Exec 1] T049 — vw_business_health_score view (3d) 🟡 deps: T012 [Database Agent]
│   │       NOTE: Blocked if T012 not complete (business decision required for formula)
│   │       criteria: View computes BHS with weights from functional.md; returns 0–100 score
│   │       artifacts-out: Supabase: vw_business_health_score (new view)
│   │       ↓
│   ├── [Exec 2a] T050 — GET /api/executive/health-score (1d) 🟡 deps: T049 [Backend Agent]
│   ├── [Exec 2b] T051 — GET /api/executive/health-trend (1d) 🟡 deps: T049 [Backend parallel]
│   │       ↓
│   ├── [Exec 3] T052 — Create executive_health_snapshot table (1d) 🟡 deps: T049 [Database]
│   │       artifacts-out: Supabase migration: executive_health_snapshot.sql
│   │       ↓
│   ├── [Exec 4] T053 — BusinessHealthScore widget (2d) 🟡 deps: T050, T051 [Frontend Agent]
│   │       artifacts-out: frontend/components/BusinessHealthScore.tsx (new)
│   │       ↓
│   └── [Exec 5] T054 — Integrate BHS widget into Executive Home (1d) 🟡 deps: T053 [Frontend]
│           artifacts-out: frontend/app/page.tsx (BHS widget added)
│           → MILESTONE M11: Business Health Score
│
├── EPIC E3.3 — E-Series Rules (Database Agent)
│   NOTE: Entire epic BLOCKED if T009–T011 not complete (business decision required)
│   ├── [Exec 1a] T055 — Implement E001 rule (2d) 🟡 deps: T009 [parallel]
│   ├── [Exec 1b] T056 — Implement E002 rule (2d) 🟡 deps: T010 [parallel]
│   └── [Exec 1c] T057 — Implement E003 rule (2d) 🟡 deps: T011 [parallel]
│           ↓  (all 3 complete)
│       [Exec 2] T058 — Update vw_priority_engine for E-series (1d) 🟡 deps: T055–T057
│               → MILESTONE M12: Cross-Domain Rules
│
└── EPIC E3.4 — Sales Completion (Backend + Frontend + Refactoring)
    ├── [Exec 1a] T059 — Extract inline SQL from commercial-summary (1d) 🟢 [Refactoring Agent]
    ├── [Exec 1b] T060 — Extract inline SQL from sales-vs-last-year (1d) 🟢 [Refactoring Agent]
    ├── [Exec 1c] T061 — GET /api/sales/pipeline-risk (1.5d) 🟢 [Backend Agent]
    └── [Exec 1d] T062 — GET /api/sales/concentration (1.5d) 🟢 [Backend Agent]
            ↓  (T061 + T062 complete)
        ├── [Exec 2a] T063 — SalesConcentrationChart component (1.5d) 🟡 deps: T062 [Frontend]
        └── [Exec 2b] T064 — ForecastGauge component (1.5d) 🟡 deps: T061 [Frontend]
                → MILESTONE M13: Sales Complete

WAVE 3 COMPLETION CRITERIA:
  ✓ M10 (Supply First-Class): T040–T048 COMPLETED
  ✓ M11 (Business Health Score): T049–T054 COMPLETED (requires T012 business approval)
  ✓ M12 (Cross-Domain Rules): T055–T058 COMPLETED (requires T009–T011 business approval)
  ✓ M13 (Sales Complete): T059–T064 COMPLETED
  ✓ User notified → Wave 4 may start
```

**Critical path in Wave 3:** T049 → T053 → T054 → M11 (BHS; 7 agent-days after T012)
**Blocked on business decision:** E3.2 (T049 blocked by T012), E3.3 (T055–T057 blocked by T009–T011)
**Parallel opportunities:** E3.1, E3.3, E3.4 can all start simultaneously; E3.4 tracks A+B fully parallel

---

## WAVE 4 — DQBOT DEPTH
**Gate:** Wave 3 COMPLETED (M10–M13 all reached) + user notified
**Objective:** Full DQBot handler coverage, AI mode safety, multi-turn conversations
**Est. calendar:** ~8 days | **Est. agent-days:** ~33
**Milestones:** M14, M15, M16

```
WAVE 3 COMPLETE ──────────────────────────────────────────┐
                                                           │
├── EPIC E4.1 — DQBot Handlers Tier 2+3 (DQBot Agent — all parallel after Wave 3)
│   ├── [Exec 1a] T065 — v003.handler.js (Commercial Trend) (1.5d)
│   ├── [Exec 1b] T066 — v004.handler.js (Customer Concentration) (1.5d)
│   ├── [Exec 1c] T067 — v005.handler.js (Product Concentration) (1.5d)
│   ├── [Exec 1d] T068 — c002.handler.js (DSO Deterioration) (1.5d)
│   ├── [Exec 1e] T069 — c003.handler.js (Customer Credit Risk) (1.5d)
│   ├── [Exec 1f] T070 — i001.handler.js (Critical Inventory) (1.5d)
│   ├── [Exec 1g] T071 — i002.handler.js (Inventory Immobilization) (1.5d)
│   ├── [Exec 1h] T072 — i004.handler.js (BOM Capacity) (1.5d)
│   ├── [Exec 1i] T073 — e001.handler.js (Executive Cross-Domain) (2d) 🟡 deps: T055–T057
│   └── [Exec 1j] N018 — payments.handler.js (Customer Payments/Collection) (1.5d)
│           ↓  (all handlers complete)
│       [Exec 2] T074 — Expand intentDetector for all new handlers (1d) 🟡 deps: T065–T073+N018
│               artifacts-out: intentDetector.js (fully expanded)
│               → MILESTONE M14: DQBot Full Coverage
│
├── EPIC E4.2 — AI Grounding + Safety (DQBot Agent + Backend Agent)
│   ├── [Exec 1] T075 — Design domain context builder architecture (1.5d) 🟢 [DQBot Agent]
│   │       criteria: Architecture document for contextBuilder; reviewed
│   │       artifacts-out: docs/architecture/context-builder-design.md (new)
│   │       ↓
│   ├── [Exec 2] T076 — Implement contextBuilder.js (2d) 🟡 deps: T075
│   │       artifacts-out: backend/services/dqbot/contextBuilder.js (new)
│   │       ↓
│   ├── [Exec 3a] T077 — Integrate contextBuilder into AI/hybrid modes (1.5d) 🟡 deps: T076
│   └── [Exec 3b] T078 — Add AI mode safety guardrails (1d) 🟡 deps: T076 [parallel]
│               → MILESTONE M15: AI Mode Safe
│
├── EPIC E4.3 — Prompt Governance (Documentation Agent + DQBot Agent)
│   ├── [Exec 1a] T079 — Author base DQBot system prompt (1.5d) 🟢 [Documentation Agent]
│   │       NOTE: docs/agents/prompts/ is EMPTY — this is the first prompt file
│   │       artifacts-out: docs/agents/prompts/dqbot-system-prompt.md (new)
│   ├── [Exec 1b] T080 — Author per-domain context templates (2d) 🟢 [Documentation Agent]
│   │       artifacts-out: docs/agents/prompts/domain-context-templates/ (new directory)
│   └── [Exec 1c] T081 — Author AI mode safety guidelines (1d) 🟢 [Documentation Agent]
│               artifacts-out: docs/agents/prompts/ai-safety-guidelines.md (new)
│
└── EPIC E4.4 — Multi-Turn Conversation (Database + Backend + Frontend)
    ├── [Exec 1] T082 — Design conversation persistence schema (1d) 🟢 [Database Agent]
    │       artifacts-out: docs/architecture/conversation-schema.md (new)
    │       ↓
    ├── [Exec 2] T083 — Implement conversation tables (1.5d) 🟡 deps: T082
    │       artifacts-out: Supabase migration: conversation_sessions + conversation_messages tables
    │       ↓
    ├── [Exec 3a] T084 — Add conversation_id to DQBot API (1d) 🟡 deps: T083 [Backend]
    ├── [Exec 3b] T085 — Implement context window management (1.5d) 🟡 deps: T083 [Backend]
    │       ↓  (both complete)
    └── [Exec 4] T086 — Build conversation history UI (2d) 🟡 deps: T084, T085 [Frontend]
            artifacts-out: frontend/components/ConversationHistory.tsx (new)
            → MILESTONE M16: Multi-Turn DQBot

WAVE 4 COMPLETION CRITERIA:
  ✓ M14 (DQBot Full Coverage): T065–T073 + N018 + T074 COMPLETED
  ✓ M15 (AI Mode Safe): T075–T078 COMPLETED
  ✓ M16 (Multi-Turn DQBot): T082–T086 COMPLETED
  ✓ User notified → Wave 5 may start
```

**Parallel opportunities:** All E4.1 handlers (T065–T073, N018) run fully in parallel
**Note:** T073 (e001.handler) depends on T055–T057 from Wave 3

---

## WAVE 5 — PRODUCTION POLISH + CLEANUP
**Gate:** Wave 4 COMPLETED (M14–M16 all reached) + user notified
**Objective:** Responsive, accessible, tested, database cleaned, extensions evaluated
**Est. calendar:** ~9 days | **Est. agent-days:** ~40
**Milestones:** M17, Production Ready

```
WAVE 4 COMPLETE ──────────────────────────────────────────┐
                                                           │
├── EPIC E5.0 — Database Cleanup (Database Agent)
│   ├── [Exec 1] N010 — Remove 14 backup/validation tables (1.5d) 🟢
│   │       criteria: Backup tables removed; data archived if needed before drop
│   │       artifacts-out: Supabase migration: drop_backup_tables.sql
│   │       ↓
│   └── [Exec 2] N011 — Remove tmp_subsidiaries (0.5d) 🟡 deps: N010
│           criteria: No temp tables in production schema
│           ↓
│   [Exec 3] N009 — Add primary keys to sales, sales_lines, inventory, finance_ar_open_items (3d) 🟡 deps: N010
│           NOTE: CRITICAL — must not run concurrent with active queries on these tables
│           criteria: 4 core tables have PKs; no query regressions on any API endpoint
│           artifacts-out: Supabase migration: add_primary_keys.sql
│
├── EPIC E5.1 — Responsive Design (Frontend Agent — all parallel)
│   ├── T087 — Responsive audit (0.5d)
│   ├── T088 — Mobile navigation (2d)
│   ├── T089 — Responsive charts (2d)
│   └── T090 — Table overflow fix (1d)
│
├── EPIC E5.2 — Accessibility (Frontend Agent)
│   ├── T091 — Text labels on semaforo indicators (0.5d)
│   ├── T092 — ARIA labels on all interactive elements (1.5d)
│   ├── T093 — Keyboard navigation (1.5d)
│   └── T094 — WCAG 2.1 AA audit (1d)
│
├── EPIC E5.3 — Testing (QA Agent — sequential setup, then parallel tests)
│   ├── [Exec 1] T095 — Set up Jest + Supertest (1d)
│   │       ↓
│   ├── [Exec 2a] T096 — Backend route unit tests (2d) 🟡 deps: T095 [parallel]
│   ├── [Exec 2b] T097 — intentDetector unit tests (1d) 🟡 deps: T095 [parallel]
│   ├── [Exec 2c] T098 — DQBot handler unit tests (2d) 🟡 deps: T095 [parallel]
│   ├── [Exec 2d] T099 — Pipeline function integration tests (1.5d) 🟡 deps: T095 [parallel]
│   │       ↓
│   ├── [Exec 3] T100 — Set up React Testing Library (0.5d)
│   │       ↓
│   └── [Exec 4] T101 — Component tests (2d) 🟡 deps: T100
│
├── EPIC E5.4 — Performance (Backend Agent + Database Agent)
│   ├── T102 — Redis cache for financeRisk.js (1.5d)
│   ├── T103 — vw_sales_pipeline_vs_supply perf analysis (1d)
│   ├── T104 — Response caching for static KPI endpoints (1d)
│   └── T105 — X-Data-As-Of header cleanup / standardization (0.5d)
│
├── EPIC E5.5 — Configuration Engine (Backend Agent + Frontend Agent + Database Agent)
│   ├── [Exec 1] T107 — Verify views read from business_rule_thresholds (1d) 🟢 [Database Agent]
│   │       criteria: No hardcoded thresholds remain in SQL views; all read from table
│   │       artifacts-out: Supabase view modifications (if needed)
│   │       ↓
│   ├── [Exec 2] T108 — Create /api/config/* route module (2d) 🟡 deps: T107 [Backend Agent]
│   │       artifacts-out: backend/routes/config.js (new)
│   │       ↓
│   └── [Exec 3] T109 — Build Configuration Management UI (3d) 🟡 deps: T108 [Frontend Agent]
│           artifacts-out: frontend/app/admin/config/page.tsx (new)
│
└── EPIC E5.6 — Extension Enablement (DevOps Agent)
    ├── N013 — Enable pgtap for DB unit testing (0.5d) 🟡 deps: T095
    │       criteria: pgtap installed; first DB function test written
    └── N014 — Evaluate vector/pgvector for DQBot semantic search (0.5d) 🟢
            criteria: Decision document; architecture recommendation

WAVE 5 COMPLETION CRITERIA (= PRODUCTION READY):
  ✓ M17 (Enterprise Ready): All E5.0–E5.6 tasks COMPLETED
  ✓ Test coverage: ≥80% on backend routes + DQBot handlers + core components
  ✓ WCAG 2.1 AA audit passed
  ✓ Zero RLS policy gaps (verified post-cleanup)
  ✓ No backup tables in production schema
  ✓ Primary keys on all core business tables
  ✓ All capabilities ≥85% maturity
  ✓ 🏁 PRODUCTION READY milestone reached
```

---

## GLOBAL EXECUTION SUMMARY

### Tasks by State

| State | Count | Task IDs |
|-------|------:|---------|
| ✅ COMPLETED | 3 | T019, T020, T106 |
| ⛔ CANCELLED | 3 | T014, T019-dup, T020-dup |
| 🔴 BLOCKED (security approval) | 5 | N001, N002, T001, T002, T005 |
| 🟠 BLOCKED (business decision) | 7 | T009, T010, T011, T012, T055, T056, T057 |
| 🟡 NOT STARTED (has dependencies) | ~85 | Most Wave 1–5 tasks |
| 🟢 READY (no dependencies, not started) | ~18 | T006, T009*, N005–N008, N015, N016, D002-fix, N012, T079, T080, T081, T082, T038, N004a, T040, T048, T059, T060 |
| 🔴 MUST NOT EXECUTE YET | All | Wave 0 approval not yet given |

### Critical Path (Full Project)

```
N001 (3d) → N002 (4d) → [W0 complete] →
T006 (3d) → N003 (1.5d) → T022 (1.5d) → T023 (1.5d) → T027 (2d) → T029 (1d) → [W2 complete] →
T012* (2d) → T049 (3d) → T053 (2d) → T054 (1d) → [W3 complete] →
T075 (1.5d) → T076 (2d) → [W4 complete] →
N009 (3d) → [W5 complete] → 🏁 PRODUCTION READY
```
*T012 depends on T009→T010→T011 business decisions = highest-risk dependency in project

**Total critical path: ~38 agent-days**
**Longest business-decision delay risk: T009 chain (could stall Wave 3 by weeks if unresolved)**

### Parallel Execution Opportunities (Highest Value)

| Opportunity | Wave | Tasks | Days Saved |
|------------|------|-------|:----------:|
| DB Track A (N001+N002) + Backend Track B (T001+T002+T005) | W0 | 5 tasks | ~1.5d |
| All E1.5 documentation tasks | W1 | 8 tasks | ~3d |
| E1.2 + E1.3 + E1.4 Track A + E1.4 Track B | W1 | 4 epics | ~4d |
| C-series rules T024–T028 (after T022+T023) | W2 | 5 tasks | ~4d |
| All DQBot handlers T065–T073 + N018 | W4 | 10 tasks | ~5d |
| E5.1 responsive tasks | W5 | 4 tasks | ~2d |

### Tasks Blocked by Business Decision

| Task | Blocks | Risk |
|------|--------|------|
| T009 (E001 spec) | T010, T011, T012, T013, T055, T056, T057, T058, T049, M3, M11, M12 | R001 — CRITICAL |
| T012 (BHS formula) | T049, T053, T054, M11 | R002 — CRITICAL |

**Recommendation:** Business decisions for T009 and T012 should be solicited during Wave 1, not after Wave 2 completes. These are the highest-risk non-engineering dependencies in the entire plan.

### Tasks Blocked by Security Approval

| Task | Approval Required | Wave |
|------|------------------|------|
| N001 | User explicit approval for Wave 0 | 0 |
| N002 | User explicit approval for Wave 0 | 0 |
| T001 | User explicit approval for Wave 0 | 0 |
| T002 | User explicit approval for Wave 0 | 0 |
| T005 | User explicit approval for Wave 0 | 0 |
