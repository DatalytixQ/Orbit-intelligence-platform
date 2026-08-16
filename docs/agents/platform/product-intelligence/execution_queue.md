# Execution Queue
**Version:** 1.0
**Source:** master_execution_plan_v2.md + reconciliation_report.md
**Schema:** orchestrator_task_schema.md
**Date:** 2026-07-03

> **DEPRECATION NOTICE: ORCHESTRATION FRAMEWORK v1 IS ACTIVE**
> This legacy task queue has been superseded.
> Tasks and state routing are now managed via `docs/orchestration/execution_manifest.yaml` and `docs/orchestration/checkpoint_state.yaml`.

> This is the machine-readable task queue for the Orchestrator agent.
> Tasks are ordered by Wave → Epic → Execution Order → Dependency resolution.
> No task may be dispatched until all conditions in `execution_control` are met.

---

## LEGEND

| Symbol | Meaning |
|--------|---------|
| ✅ | COMPLETED — confirmed in live DB or source |
| ⛔ | CANCELLED — task eliminated during reconciliation |
| 🔴 | BLOCKED — security approval required |
| 🟠 | BLOCKED — business decision required |
| 🟡 | NOT STARTED — has unmet dependencies |
| 🟢 | READY — no dependencies; can start when wave is open |
| 🚫 | MUST NOT EXECUTE — wave gate not yet met |

---

## WAVE 0 — SECURITY EMERGENCY
**Approval gate:** USER MUST EXPLICITLY APPROVE before any task in this wave is dispatched.
**No task in this wave may begin without that approval.**

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 0.1.A | N001 | Define RLS policies on clients + app_users | Database | HIGH | none | 🔴 BLOCKED | CRITICAL | Security ✋ | YES (with N002) | M0 |
| 0.1.B | N002 | Define RLS policies on 27 domain tables (Phases 1-3) | Database | HIGH | N001 | 🟡 IN PROGRESS (Phase 1-2 ✅ / Phase 3 🟢) | CRITICAL | Security ✋ | Phased (3 phases) | M0 |
| 0.2.A | T001 | Extract clientId from JWT in routes/ai.js | Backend | LOW | none | 🔴 BLOCKED | CRITICAL | Security ✋ | YES (with T002, T005) | M0 |
| 0.2.B | T002 | Extract requireAuth to middleware/auth.js | Backend | LOW | none | 🔴 BLOCKED | HIGH | Security ✋ | YES (with T001, T005) | M0 |
| 0.2.C | T005 | Validate JWT_SECRET at startup | Backend | LOW | none | 🔴 BLOCKED | CRITICAL | Security ✋ | YES (with T001, T002) | M0 |

**Wave 0 acceptance gate:** N001✅ T001✅ T002✅ T005✅ done. N002 Phase 1-2 ✅ (76 policies, 14/14 validated). Phase 3 🟢 READY.
**Parallel tracks:** DB Track: N001 DONE → N002 Phase 1-2 DONE → Phase 3 READY. Backend Track: ALL DONE.

---

## WAVE 1 — FOUNDATION
**Approval gate:** Wave 0 COMPLETED + user notified.
**Status:** 🚫 MUST NOT EXECUTE YET

### Epic E1.1 — Token Lifecycle

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 1.1.1 | T003 | POST /api/auth/refresh-token | Backend | MEDIUM | T002 | 🟡 | MEDIUM | None | YES (with T004) | M1 |
| 1.1.2 | T004 | POST /api/auth/logout | Backend | MEDIUM | T002 | 🟡 | MEDIUM | None | YES (with T003) | M1 |

### Epic E1.2 — AR Domain Governance

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 1.2.1 | T006 | Author sop_ar_intelligence.md | Documentation | HIGH | none | 🟢 READY | HIGH | None | YES | M2 |
| 1.2.2 | T007 | Complete AR KPI formulas in kpi.md | Documentation | MEDIUM | T006 | 🟡 | MEDIUM | None | YES (with T008, N003) | M2 |
| 1.2.3 | T008 | Document AR semantic views in database.md | Documentation | MEDIUM | T006 | 🟡 | MEDIUM | None | YES (with T007, N003) | M2 |
| 1.2.4 | N003 | Document Customer Payments domain | Documentation | MEDIUM | T006 | 🟡 | MEDIUM | None | YES (with T007, T008) | M2 |

### Epic E1.3 — Executive Rules Specification

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 1.3.1 | T009 | Specify E001 cross-domain rule | Chief Architect | HIGH | BUSINESS DECISION | 🟠 BLOCKED | CRITICAL | Biz Decision ✋ | YES (start E1.3 parallel) | M3 |
| 1.3.2 | T010 | Specify E002 cross-domain rule | Chief Architect | HIGH | T009 | 🟡 | CRITICAL | Biz Decision ✋ | NO | M3 |
| 1.3.3 | T011 | Specify E003 cross-domain rule | Chief Architect | HIGH | T010 | 🟡 | CRITICAL | Biz Decision ✋ | NO | M3 |
| 1.3.4 | T012 | Define Business Health Score formula | Chief Architect | HIGH | T009–T011 + BUSINESS DECISION | 🟠 BLOCKED | CRITICAL | Biz Decision ✋ | NO | M3 |
| 1.3.5 | T013 | Define EX001 and EX002 KPI specs | Documentation | MEDIUM | T012 | 🟡 | HIGH | None | NO | M3 |

### Epic E1.4 — Pipeline Observability

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| ~~1.4.0~~ | ~~T014~~ | ~~Create pipeline_run_log table~~ | — | — | — | ⛔ CANCELLED | — | — | — | — |
| 1.4.1 | N017 | Activate data_pipeline_step_log — instrument all pipeline functions | Database | MEDIUM | none | 🟢 READY | HIGH | None | YES | M4 |
| 1.4.2 | N012 | Evaluate pg_cron vs n8n | DevOps | LOW | none | 🟢 READY | LOW | None | YES | M4 |
| 1.4.3 | T016 | Design pipeline automation (n8n or pg_cron) | DevOps | MEDIUM | N012 | 🟡 | MEDIUM | None | NO | M4 |
| 1.4.4 | T017 | GET /api/pipeline/status endpoint | Backend | LOW | N017 | 🟡 | LOW | None | YES (with T018) | M4 |
| 1.4.5 | T015 | Verify data_pipeline_step_log instrumentation | QA | LOW | N017 | 🟡 | LOW | None | YES (with T017) | M4 |
| 1.4.6 | T018 | Data freshness X-Data-As-Of headers on KPI endpoints | Backend | MEDIUM | N017 | 🟡 | LOW | None | YES (with T017) | M4 |

### Epic E1.5 — Documentation Debt

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 1.5.1 | D002-fix | Correct finance_ar_open_items name in database.md | Documentation | LOW | none | 🟢 READY | LOW | None | YES | M5 |
| 1.5.2 | N005 | Document ar_settings, inventory_settings, alert_config, client_config | Documentation | MEDIUM | none | 🟢 READY | LOW | None | YES | M5 |
| 1.5.3 | N006 | Document sales_semantic_current in database.md | Documentation | LOW | none | 🟢 READY | LOW | None | YES | M5 |
| 1.5.4 | N007 | Document item master resolution layer | Documentation | MEDIUM | none | 🟢 READY | LOW | None | YES | M5 |
| 1.5.5 | N008 | Document SOP tables in database.md | Documentation | LOW | none | 🟢 READY | LOW | None | YES | M5 |
| 1.5.6 | N015 | Document inventory_supply_snapshot_daily | Documentation | LOW | none | 🟢 READY | LOW | None | YES | M5 |
| 1.5.7 | N016 | Add NetSuite to all relevant documentation | Documentation | LOW | none | 🟢 READY | LOW | None | YES | M5 |
| 1.5.8 | D001-fix | Correct RLS claim in project-governance.md | Documentation | LOW | N002 | 🟡 | LOW | None | NO | M5 |

---

## WAVE 2 — RULES COMPLETION + INSIGHT RECONCILIATION
**Approval gate:** Wave 1 COMPLETED (M1–M5 all reached) + user notified.
**Status:** 🚫 MUST NOT EXECUTE YET

### Epic E2.0 — Dual Insight Store Reconciliation

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 2.0.1 | N004a | Audit insights vs insights_log table usage | Backend | LOW | none | 🟡 | HIGH | None | YES | M6 |
| 2.0.2 | N004b | Migrate frontend from legacy insights table | Frontend | MEDIUM | N004a | 🟡 | HIGH | None | NO | M6 |
| 2.0.3 | N004c | Migrate insight data to insights_log | Database | MEDIUM | N004b | 🟡 | HIGH | None | NO | M6 |

### Epic E2.1 — AR STG Pipeline Integration

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| ~~2.1.0~~ | ~~T019~~ | ~~Create stg_ar_open_items_clean~~ | — | — | — | ✅ COMPLETED | — | — | — | — |
| ~~2.1.0~~ | ~~T020~~ | ~~Implement refresh_stg_ar_open_items_clean()~~ | — | — | — | ✅ COMPLETED | — | — | — | — |
| 2.1.1 | T021 | Integrate AR STG into automated pipeline sequence | Database | LOW | T016 | 🟡 | LOW | None | YES | M7 |

### Epic E2.2 — C-Series Rule Implementation

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 2.2.1 | T022 | Create vw_ar_dso semantic view | Database | MEDIUM | T006, T008 | 🟡 | MEDIUM | None | NO | M7 |
| 2.2.2 | T023 | Create vw_collection_efficiency semantic view | Database | MEDIUM | N003, T022 | 🟡 | MEDIUM | None | NO | M7 |
| 2.2.3A | T024 | Implement C001 — Overdue Receivables Risk | Database | HIGH | T022, T023 | 🟡 | HIGH | None | YES (parallel with T025–T028) | M7 |
| 2.2.3B | T025 | Implement C002 — DSO Deterioration | Database | HIGH | T022 | 🟡 | HIGH | None | YES | M7 |
| 2.2.3C | T026 | Implement C003 — Customer Credit Risk | Database | HIGH | T022 | 🟡 | HIGH | None | YES | M7 |
| 2.2.3D | T027 | Implement C004 — Collection Forecast Risk | Database | HIGH | T023 | 🟡 | HIGH | None | YES | M7 |
| 2.2.3E | T028 | Implement C005 — Critical Overdue Documents | Database | HIGH | T022 | 🟡 | HIGH | None | YES | M7 |
| 2.2.4 | T029 | Update vw_priority_engine for C-series | Database | MEDIUM | T024–T028 | 🟡 | HIGH | None | NO | M7 |

### Epic E2.3 — DQBot Tier 1 Handlers

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 2.3.1 | T030 | v002.handler.js — Forecast Deviation | DQBot | MEDIUM | T001 | 🟡 | MEDIUM | None | NO | M8 |
| 2.3.2A | T031 | v001.handler.js — Forecast Achievement | DQBot | MEDIUM | T030 | 🟡 | MEDIUM | None | YES (parallel with T032) | M8 |
| 2.3.2B | T032 | c001.handler.js — Overdue Receivables | DQBot | MEDIUM | T024, T001 | 🟡 | MEDIUM | None | YES | M8 |
| 2.3.3 | T033 | Expand intentDetector for V001, V002, C001 | DQBot | LOW | T030–T032 | 🟡 | MEDIUM | None | NO | M8 |
| 2.3.4 | T034 | Expand buildSuggestedQuestions() | DQBot | LOW | T033 | 🟡 | LOW | None | NO | M8 |

### Epic E2.4 — Insight Engine UI

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 2.4.0 | T038 | Convert InsightsPanel.jsx → InsightsPanel.tsx | Refactoring | LOW | none | 🟡 | LOW | None | YES | M9 |
| 2.4.1 | T035 | Build app/insights/[id]/page.tsx | Frontend | MEDIUM | N004 complete | 🟡 | LOW | None | NO | M9 |
| 2.4.2A | T036 | Build InsightEvolutionChart component | Frontend | MEDIUM | T035 | 🟡 | LOW | None | YES (parallel with T037) | M9 |
| 2.4.2B | T037 | Build ActionManagementTable component | Frontend | MEDIUM | T035 | 🟡 | LOW | None | YES | M9 |
| 2.4.3 | T039 | Expand app/insights/page.tsx from stub | Frontend | MEDIUM | T035, T038 | 🟡 | LOW | None | NO | M9 |

---

## WAVE 3 — INTELLIGENCE EXPANSION
**Approval gate:** Wave 2 COMPLETED (M6–M9 all reached) + user notified.
**Status:** 🚫 MUST NOT EXECUTE YET

### Epic E3.1 — Supply Intelligence API + Dashboard

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 3.1.0 | T040 | Create backend/routes/supply.js scaffold | Backend | LOW | none | 🟡 | LOW | None | YES | M10 |
| 3.1.1A | T041 | GET /api/supply/pipeline-summary | Backend | MEDIUM | T040 | 🟡 | LOW | None | YES (parallel T041–T044) | M10 |
| 3.1.1B | T042 | GET /api/supply/pipeline-vs-supply | Backend | MEDIUM | T040 | 🟡 | LOW | None | YES | M10 |
| 3.1.1C | T043 | GET /api/supply/risk-by-customer | Backend | MEDIUM | T040 | 🟡 | MEDIUM | None | YES | M10 |
| 3.1.1D | T044 | GET /api/supply/inbound-timeline | Backend | MEDIUM | T040 | 🟡 | LOW | None | YES | M10 |
| 3.1.2 | T045 | Create app/supply/page.tsx | Frontend | HIGH | T041–T044 | 🟡 | LOW | None | NO | M10 |
| 3.1.3A | T046 | Build SupplyPipelineChart component | Frontend | MEDIUM | T045 | 🟡 | LOW | None | YES | M10 |
| 3.1.3B | T047 | Build SupplyRiskCustomerTable component | Frontend | MEDIUM | T045 | 🟡 | LOW | None | YES | M10 |
| 3.1.4 | T048 | Document supply API in api.md | Documentation | MEDIUM | none | 🟢 READY | LOW | None | YES | M10 |

### Epic E3.2 — Business Health Score

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 3.2.1 | T049 | Create vw_business_health_score view | Database | HIGH | T012 + BIZ DECISION | 🟠 BLOCKED | CRITICAL | Biz Decision ✋ | NO | M11 |
| 3.2.2A | T050 | GET /api/executive/health-score | Backend | MEDIUM | T049 | 🟡 | HIGH | None | YES | M11 |
| 3.2.2B | T051 | GET /api/executive/health-trend | Backend | MEDIUM | T049 | 🟡 | HIGH | None | YES | M11 |
| 3.2.3 | T052 | Create executive_health_snapshot table | Database | MEDIUM | T049 | 🟡 | MEDIUM | None | NO | M11 |
| 3.2.4 | T053 | Build BusinessHealthScore widget | Frontend | HIGH | T050, T051 | 🟡 | HIGH | None | NO | M11 |
| 3.2.5 | T054 | Integrate BHS into Executive Home | Frontend | MEDIUM | T053 | 🟡 | MEDIUM | None | NO | M11 |

### Epic E3.3 — E-Series Rules Implementation

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 3.3.1A | T055 | Implement E001 rule | Database | HIGH | T009 + BIZ DECISION | 🟠 BLOCKED | CRITICAL | Biz Decision ✋ | YES (parallel T055–T057) | M12 |
| 3.3.1B | T056 | Implement E002 rule | Database | HIGH | T010 + BIZ DECISION | 🟠 BLOCKED | CRITICAL | Biz Decision ✋ | YES | M12 |
| 3.3.1C | T057 | Implement E003 rule | Database | HIGH | T011 + BIZ DECISION | 🟠 BLOCKED | CRITICAL | Biz Decision ✋ | YES | M12 |
| 3.3.2 | T058 | Update vw_priority_engine for E-series | Database | MEDIUM | T055–T057 | 🟡 | HIGH | None | NO | M12 |

### Epic E3.4 — Sales Completion

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 3.4.1A | T059 | Extract inline SQL from commercial-summary route | Refactoring | MEDIUM | none | 🟢 READY | LOW | None | YES | M13 |
| 3.4.1B | T060 | Extract inline SQL from sales-vs-last-year route | Refactoring | MEDIUM | none | 🟢 READY | LOW | None | YES | M13 |
| 3.4.1C | T061 | GET /api/sales/pipeline-risk | Backend | MEDIUM | none | 🟢 READY | MEDIUM | None | YES | M13 |
| 3.4.1D | T062 | GET /api/sales/concentration | Backend | MEDIUM | none | 🟢 READY | LOW | None | YES | M13 |
| 3.4.2A | T063 | Build SalesConcentrationChart component | Frontend | MEDIUM | T062 | 🟡 | LOW | None | YES | M13 |
| 3.4.2B | T064 | Build ForecastGauge component | Frontend | MEDIUM | T061 | 🟡 | LOW | None | YES | M13 |

---

## WAVE 4 — DQBOT DEPTH
**Approval gate:** Wave 3 COMPLETED (M10–M13 all reached) + user notified.
**Status:** 🚫 MUST NOT EXECUTE YET

### Epic E4.1 — DQBot Handlers Tier 2+3

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 4.1.1A | T065 | v003.handler.js — Commercial Trend | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.1B | T066 | v004.handler.js — Customer Concentration | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.1C | T067 | v005.handler.js — Product Concentration | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.1D | T068 | c002.handler.js — DSO Deterioration | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.1E | T069 | c003.handler.js — Customer Credit Risk | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.1F | T070 | i001.handler.js — Critical Inventory | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.1G | T071 | i002.handler.js — Inventory Immobilization | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.1H | T072 | i004.handler.js — BOM Capacity | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.1I | T073 | e001.handler.js — Executive Cross-Domain | DQBot | HIGH | T055–T057 | 🟡 | HIGH | None | YES | M14 |
| 4.1.1J | N018 | payments.handler.js — Customer Payments | DQBot | MEDIUM | none | 🟡 | MEDIUM | None | YES | M14 |
| 4.1.2 | T074 | Expand intentDetector for all new handlers | DQBot | MEDIUM | T065–T073, N018 | 🟡 | HIGH | None | NO | M14 |

### Epic E4.2 — AI Grounding + Safety

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 4.2.1 | T075 | Design domain context builder architecture | DQBot | MEDIUM | none | 🟡 | HIGH | None | YES | M15 |
| 4.2.2 | T076 | Implement contextBuilder.js | DQBot | HIGH | T075 | 🟡 | HIGH | None | NO | M15 |
| 4.2.3A | T077 | Integrate contextBuilder into AI/hybrid modes | DQBot | HIGH | T076 | 🟡 | HIGH | None | YES | M15 |
| 4.2.3B | T078 | Add AI mode safety guardrails | Backend | MEDIUM | T076 | 🟡 | HIGH | None | YES | M15 |

### Epic E4.3 — Prompt Governance

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 4.3.1A | T079 | Author base DQBot system prompt | Documentation | MEDIUM | none | 🟡 | HIGH | None | YES | M15 |
| 4.3.1B | T080 | Author per-domain context templates | Documentation | HIGH | none | 🟡 | HIGH | None | YES | M15 |
| 4.3.1C | T081 | Author AI mode safety guidelines | Documentation | MEDIUM | none | 🟡 | HIGH | None | YES | M15 |

### Epic E4.4 — Multi-Turn Conversation

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 4.4.1 | T082 | Design conversation persistence schema | Database | MEDIUM | none | 🟡 | MEDIUM | None | YES | M16 |
| 4.4.2 | T083 | Implement conversation tables | Database | MEDIUM | T082 | 🟡 | MEDIUM | None | NO | M16 |
| 4.4.3A | T084 | Add conversation_id to DQBot API | Backend | MEDIUM | T083 | 🟡 | MEDIUM | None | YES | M16 |
| 4.4.3B | T085 | Implement context window management | Backend | HIGH | T083 | 🟡 | MEDIUM | None | YES | M16 |
| 4.4.4 | T086 | Build conversation history UI | Frontend | HIGH | T084, T085 | 🟡 | MEDIUM | None | NO | M16 |

---

## WAVE 5 — PRODUCTION POLISH + CLEANUP
**Approval gate:** Wave 4 COMPLETED (M14–M16 all reached) + user notified.
**Status:** 🚫 MUST NOT EXECUTE YET

### Epic E5.0 — Database Cleanup

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 5.0.1 | N010 | Remove 14 backup/validation tables | Database | LOW | Wave 4 complete | 🟡 | LOW | None | NO | M17 |
| 5.0.2 | N011 | Remove tmp_subsidiaries from production schema | Database | LOW | N010 | 🟡 | LOW | None | NO | M17 |
| 5.0.3 | N009 | Add primary keys to 4 core tables | Database | MEDIUM | N010 | 🟡 | MEDIUM | None | NO | M17 |

### Epic E5.1 — Responsive Design

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 5.1.1 | T087 | Responsive audit | Frontend | LOW | none | 🟡 | LOW | None | YES | M17 |
| 5.1.2A | T088 | Mobile navigation | Frontend | MEDIUM | T087 | 🟡 | MEDIUM | None | YES | M17 |
| 5.1.2B | T089 | Responsive charts | Frontend | MEDIUM | T087 | 🟡 | MEDIUM | None | YES | M17 |
| 5.1.2C | T090 | Table overflow fix | Frontend | LOW | T087 | 🟡 | LOW | None | YES | M17 |

### Epic E5.2 — Accessibility

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 5.2.1A | T091 | Text labels on semaforo indicators | Frontend | LOW | none | 🟡 | LOW | None | YES | M17 |
| 5.2.1B | T092 | ARIA labels on all interactive elements | Frontend | MEDIUM | none | 🟡 | MEDIUM | None | YES | M17 |
| 5.2.1C | T093 | Keyboard navigation | Frontend | MEDIUM | none | 🟡 | MEDIUM | None | YES | M17 |
| 5.2.2 | T094 | WCAG 2.1 AA audit | QA | MEDIUM | T091–T093 | 🟡 | MEDIUM | None | NO | M17 |

### Epic E5.3 — Testing

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 5.3.1 | T095 | Set up Jest + Supertest | QA | MEDIUM | none | 🟡 | LOW | None | NO | M17 |
| 5.3.2A | T096 | Backend route unit tests | QA | HIGH | T095 | 🟡 | LOW | None | YES | M17 |
| 5.3.2B | T097 | intentDetector unit tests | QA | MEDIUM | T095 | 🟡 | MEDIUM | None | YES | M17 |
| 5.3.2C | T098 | DQBot handler unit tests | QA | HIGH | T095 | 🟡 | MEDIUM | None | YES | M17 |
| 5.3.2D | T099 | Pipeline function integration tests | QA | MEDIUM | T095 | 🟡 | MEDIUM | None | YES | M17 |
| 5.3.3 | T100 | Set up React Testing Library | QA | LOW | none | 🟡 | LOW | None | YES | M17 |
| 5.3.4 | T101 | Component tests | QA | HIGH | T100 | 🟡 | LOW | None | NO | M17 |

### Epic E5.4 — Performance

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 5.4.1A | T102 | Redis cache for financeRisk.js | Backend | MEDIUM | none | 🟡 | MEDIUM | None | YES | M17 |
| 5.4.1B | T103 | vw_sales_pipeline_vs_supply perf analysis | Database | MEDIUM | none | 🟡 | HIGH | None | YES | M17 |
| 5.4.1C | T104 | Response caching for static KPI endpoints | Backend | MEDIUM | none | 🟡 | LOW | None | YES | M17 |
| 5.4.1D | T105 | X-Data-As-Of header standardization | Backend | LOW | T018 | 🟡 | LOW | None | YES | M17 |

### Epic E5.5 — Configuration Engine

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| ~~5.5.0~~ | ~~T106~~ | ~~Create rule_thresholds table~~ | — | — | — | ✅ COMPLETED | — | — | — | — |
| 5.5.1 | T107 | Verify SQL views read from business_rule_thresholds | Database | MEDIUM | none | 🟢 READY | LOW | None | YES | M17 |
| 5.5.2 | T108 | Create /api/config/* route module | Backend | HIGH | T107 | 🟡 | LOW | None | NO | M17 |
| 5.5.3 | T109 | Build Configuration Management UI | Frontend | HIGH | T108 | 🟡 | LOW | None | NO | M17 |

### Epic E5.6 — Extension Enablement

| Order | ID | Title | Agent | Complexity | Deps | Status | Risk | Approval | Parallel? | Milestone |
|:-----:|-----|-------|-------|:----------:|------|--------|------|:--------:|:---------:|-----------|
| 5.6.1A | N013 | Enable pgtap for DB unit testing | DevOps | LOW | T095 | 🟡 | LOW | None | YES | M17 |
| 5.6.1B | N014 | Evaluate vector/pgvector for DQBot semantic search | DQBot | LOW | none | 🟢 READY | LOW | None | YES | M17 |

---

## COMPLETED TASKS (Do Not Dispatch)

| ID | Title | Completion Evidence |
|----|-------|-------------------|
| ✅ T019 | Create stg_ar_open_items_clean | Live DB: 697 rows confirmed (2026-07-03 inspection) |
| ✅ T020 | Implement refresh_stg_ar_open_items_clean() | Live DB: table populated — function must exist and have run |
| ✅ T106 | Create rule_thresholds table | Live DB: business_rule_thresholds with 15 rows (name differs from plan) |

## CANCELLED TASKS (Do Not Dispatch)

| ID | Original Title | Reason |
|----|----------------|--------|
| ⛔ T014 | Create pipeline_run_log table | data_pipeline_step_log already exists; replaced by N017 |

---

## QUEUE STATISTICS

| Metric | Count |
|--------|------:|
| Total tasks in queue | 121 |
| ✅ Completed | 3 |
| ⛔ Cancelled | 1 |
| 🔴 Blocked (security approval) | 5 |
| 🟠 Blocked (business decision) | 7 |
| 🟢 Ready (no dependencies, wave open) | 18 |
| 🟡 Not started (has dependencies or wave gate) | 87 |
| 🚫 Must not execute yet (wave gate not met) | All waves 1–5 |
| Waves | 6 (W0–W5) |
| Epics | 22 |
| Agents required | 9 types |
| Est. total agent-days | ~158 |
| Est. calendar days (full parallelism) | ~41 |

## AGENT WORKLOAD SUMMARY

| Agent | Tasks | Waves Active |
|-------|------:|-------------|
| Database Agent | ~35 | W0, W1, W2, W3, W4, W5 |
| Backend Agent | ~28 | W0, W1, W2, W3, W4, W5 |
| Frontend Agent | ~25 | W1, W2, W3, W4, W5 |
| Documentation Agent | ~18 | W1, W2, W3, W4 |
| DQBot Agent | ~16 | W2, W4 |
| QA Agent | ~10 | W1, W5 |
| DevOps Agent | ~4 | W1, W5 |
| Chief Architect Agent | ~5 | W1, W3 |
| Refactoring Agent | ~4 | W2, W3 |

## HIGHEST URGENCY TASKS (Act First When Approved)

| Priority | ID | Task | Why |
|:--------:|-----|------|-----|
| 🔴 P0 | N001 | RLS policies — clients + app_users | Zero tenant isolation confirmed in production DB |
| 🔴 P0 | T001 | clientId from JWT | Hardcoded 'vonderk' is an active data leak |
| 🔴 P0 | T005 | JWT_SECRET validation | Default secret makes all tokens forgeable |
| 🟠 P1 | T009 | E001 rule specification | Business decision — every day of delay = Wave 3 delay |
| 🟢 P1 | T006 | AR SOP authoring | Blocks all C-series rules; no code dependency |
| 🟢 P1 | N017 | Activate data_pipeline_step_log | Platform is operationally blind; 0-row log |
