# Master Execution Plan — v2
**Supersedes:** master_execution_plan.md
**Basis:** Reconciliation Report + Database Ground Truth + Unified Product Graph v2
**Date:** 2026-07-03

> **Changes from v1:**
> - T019, T020, T106 marked DONE (confirmed in live DB)
> - T014 revised (table already exists — task becomes "activate")
> - 18 new tasks added (N001–N018 from reconciliation)
> - RLS policy implementation elevated to P0 (above all else)
> - Customer Payments domain added to AR Intelligence work
> - Dual insight store reconciliation added to Wave 2
> - Wave ordering preserved; security tasks front-loaded in Wave 1

---

# PART I — REVISED WAVE DEFINITIONS

## WAVE 0 — SECURITY EMERGENCY (NEW)
**"Enforce what the platform claims to enforce"**

This wave did not exist in v1. The live database inspection revealed that RLS is enabled on all 90 tables but zero policies exist. The Product Knowledge Graph incorrectly states that RLS enforces multi-tenant isolation. This must be corrected before any other development.

### Why Wave 0 Exists
- All 90 tables are accessible to any authenticated Supabase user with no row-level isolation
- `clientId = 'vonderk'` is hardcoded in `routes/ai.js` — all DQBot queries return one client's data regardless of login
- JWT_SECRET defaults to `'dev_secret_change_me'` — all tokens are trivially forgeable
- These three issues combined represent a complete multi-tenancy failure

### Wave 0 Completion Criteria
- [ ] RLS policy on `clients` and `app_users` enforces `client_id = auth.uid()` equivalent
- [ ] RLS policies on all business domain tables enforce `client_id` from JWT
- [ ] `clientId` in DQBot route reads from `req.user.client_id`
- [ ] JWT_SECRET validation blocks server startup if using default value
- [ ] `requireAuth` extracted to shared middleware module

---

## WAVE 1 — FOUNDATION (Revised)
**"Govern undocumented domains, activate pipeline observability, define E-series"**

Removes security tasks (moved to Wave 0). Adds documentation of 27 undocumented objects discovered in DB. Retains E-series specification and pipeline automation work.

---

## WAVE 2 — RULES COMPLETION + INSIGHT RECONCILIATION (Revised)
**"Activate C-series rules, complete DQBot tier 1, fix the dual insight store"**

Adds N004 (reconcile `insights` vs `insights_log`) to prevent frontend from reading stale legacy data while new architecture is being built.

---

## WAVE 3 — INTELLIGENCE EXPANSION (Unchanged structure)
## WAVE 4 — DQBOT DEPTH (Adds N018 — Customer Payments handler)
## WAVE 5 — PRODUCTION POLISH + CLEANUP (Adds primary keys, backup table removal, RLS policy audit)

---

# PART II — COMPLETE TASK LIST (v2)

---

## WAVE 0 — SECURITY EMERGENCY (NEW)

| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| N001 | Define RLS policies on `clients` + `app_users` enforcing `client_id` isolation | Auth (8) | Database | HIGH | None | Authenticated users can only read their own `client_id` records; confirmed with test query |
| N002 | Define RLS policies on all 12 core business domain tables | Auth (8) | Database | HIGH | N001 | All domain tables (sales, inventory, finance, AR, insights) enforce `client_id` = current user's tenant |
| T001 | Extract `clientId` from JWT in `routes/ai.js` | Auth (8) | Backend | Low | None | `req.user.client_id` used everywhere; 'vonderk' string absent |
| T002 | Extract `requireAuth` to `backend/middleware/auth.js` | Auth (8) | Backend | Low | None | Shared module imported by all protected routes |
| T005 | Validate JWT_SECRET at startup | Auth (8) | Backend | Low | None | Server refuses to start with default secret |

**Wave 0: 5 tasks · Est: ~8 agent-days · Calendar: ~2 days (parallel N001+N002, T001+T002+T005)**

---

## WAVE 1 — FOUNDATION (Revised)

### Epic E1.1 — Token Lifecycle (formerly in Wave 1 Security, reduced scope after Wave 0)
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| T003 | Implement POST /api/auth/refresh-token | Auth (8) | Backend | Medium | T002 | Returns new access + refresh tokens |
| T004 | Implement POST /api/auth/logout | Auth (8) | Backend | Medium | T002 | Invalidates JWT; returns 200 |

### Epic E1.2 — AR Domain Governance
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| T006 | Author `sop_ar_intelligence.md` | AR (4) | Documentation | High | None | Covers: business purpose, KPIs, rules, pipeline, API, DQBot, dashboard |
| T007 | Complete AR KPI formulas in `kpi.md` | AR (4) | Documentation | Medium | T006 | AR001–AR004 + collection efficiency fully specified |
| T008 | Document AR semantic views in `database.md` | AR (4) | Documentation | Medium | T006 | `vw_ar_dso`, `vw_collection_efficiency` specified before implementation |
| N003 | Document Customer Payments domain in `database.md` and `kpi.md` | AR (4) | Documentation | Medium | T006 | `raw_customer_payments` → `stg_customer_payments_clean` → `customer_payments` fully documented |

### Epic E1.3 — Executive Rules Specification
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| T009 | Specify E001 cross-domain rule | Executive (5) | Chief Architect | High | None | E001 fully specified in `rules-engine.md` |
| T010 | Specify E002 cross-domain rule | Executive (5) | Chief Architect | High | T009 | E002 fully specified |
| T011 | Specify E003 cross-domain rule | Executive (5) | Chief Architect | High | T010 | E003 fully specified |
| T012 | Define Business Health Score formula | Executive (5) | Chief Architect | High | T009–T011 | Formula with weights, normalization, bands in `functional.md` |
| T013 | Define EX001 and EX002 KPI specs | Executive (5) | Documentation | Medium | T012 | Both KPIs fully specified in `kpi.md` |

### Epic E1.4 — Pipeline Observability (Revised from v1)
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| ~~T014~~ | ~~Create `pipeline_run_log` table~~ | ~~Pipeline (10)~~ | — | — | — | **CANCELLED — `data_pipeline_step_log` already exists** |
| N017 | Activate `data_pipeline_step_log` — instrument all pipeline functions to write to it | Pipeline (10) | Database | Medium | None | Every pipeline function writes start + end record; table has rows after next pipeline run |
| T015 | Verify `data_pipeline_step_log` instrumentation | Pipeline (10) | QA | Low | N017 | Trigger one pipeline function; confirm row appears in log |
| T016 | Design n8n workflow (or evaluate pg_cron alternative) | Pipeline (10) | DevOps | Medium | None | Decision document: n8n vs pg_cron; design for chosen approach |
| N012 | Evaluate enabling `pg_cron` as alternative to n8n | Pipeline (10) | DevOps | Low | None | Document tradeoffs; recommendation with justification |
| T017 | Implement GET /api/pipeline/status endpoint | Pipeline (10) | Backend | Low | N017 | Returns last run, status, timestamp, domains |
| T018 | Add data freshness metadata to KPI endpoint responses | Pipeline (10) | Backend | Medium | N017 | All KPI responses include `X-Data-As-Of` header |

### Epic E1.5 — Documentation Debt (NEW — from undocumented DB objects)
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| N005 | Document `ar_settings`, `inventory_settings`, `alert_config`, `client_config` in `database.md` | Config (11) | Documentation | Medium | None | All 4 tables documented with schema and purpose |
| N006 | Document `sales_semantic_current` in `database.md` | Sales (1) | Documentation | Low | None | 48K-row materialized table documented with refresh pattern |
| N007 | Document item master resolution layer in `database.md` | Inventory (2) | Documentation | Medium | None | `items_master`, `item_bom`, `item_bom_resolved`, `item_lookup_normalized`, `item_alias_map` all documented |
| N008 | Document SOP tables in `database.md` | Documentation (12) | Documentation | Low | None | `sop_inventory_supply_intelligence`, `sop_business_pipeline` documented with schema and purpose |
| N015 | Document `inventory_supply_snapshot_daily` | Supply (3) | Documentation | Low | None | Documented with refresh pattern and use in trend analysis |
| N016 | Add ERP identity (NetSuite) to all relevant documentation | All | Documentation | Low | None | technology-stack.md, functional.md, database.md reference NetSuite explicitly |
| ~~D001~~ fix | Correct RLS claim in `project-governance.md` and product graph | Auth (8) | Documentation | Low | N002 | Remove false claim that RLS enforces isolation; state actual policy status |
| D002 fix | Correct `finance_ar_open_items_cxc` → `finance_ar_open_items` in `database.md` | AR (4) | Documentation | Low | None | All references use correct table name |

**Wave 1: ~20 tasks · Est: ~22 agent-days · Calendar: ~6 days (parallel tracks)**

---

## WAVE 2 — RULES COMPLETION + INSIGHT RECONCILIATION (Revised)

### Epic E2.0 — Dual Insight Store Reconciliation (NEW)
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| N004a | Audit `insights` table (1,371 rows) — determine if frontend reads from it | Insight (6) | Backend | Low | None | Confirmed: which frontend components query `insights` vs `insights_log` |
| N004b | Migrate frontend to read from `insights_log` (if reading from legacy `insights`) | Insight (6) | Frontend | Medium | N004a | No frontend component queries `insights` table |
| N004c | Migrate legacy insight data from `insights` → `insights_log` (if applicable) | Insight (6) | Database | Medium | N004b | `insights_log` contains all active insights; legacy table retained as archive |

### Epic E2.1 — AR STG Layer
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| ~~T019~~ | ~~Create `stg_ar_open_items_clean`~~ | — | — | — | — | **DONE — 697 rows confirmed live** |
| ~~T020~~ | ~~Implement `refresh_stg_ar_open_items_clean()`~~ | — | — | — | — | **DONE — function ran, table populated** |
| T021 | Integrate AR STG into automated pipeline sequence | AR (4) | Database | Low | T016 | AR STG refresh appears in pipeline workflow |

### Epic E2.2 — C-Series Rule Implementation
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| T022 | Create `vw_ar_dso` semantic view | AR (4) | Database | Medium | T006, T008 | View computes DSO; documented in `database.md` |
| T023 | Create `vw_collection_efficiency` semantic view | AR (4) | Database | Medium | N003, T022 | Uses `customer_payments` table (36K rows available); documented |
| T024 | Implement C001 (Overdue Receivables Risk) | AR (4) | Database | High | T022, T023 | C001 generates `insights_log` entries with correct severity |
| T025 | Implement C002 (DSO Deterioration) | AR (4) | Database | High | T022 | C002 generates insights |
| T026 | Implement C003 (Customer Credit Risk) | AR (4) | Database | High | T022 | C003 generates insights |
| T027 | Implement C004 (Collection Forecast Risk) | AR (4) | Database | High | T023 | C004 generates insights (uses `customer_payments` data) |
| T028 | Implement C005 (Critical Overdue Documents) | AR (4) | Database | High | T022 | C005 generates insights |
| T029 | Update `vw_priority_engine` to include C-series | AR (4) | Database | Medium | T024–T028 | Priority engine ranks C-series alongside V/I series |

### Epic E2.3 — DQBot Tier 1 Handlers
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| T030 | Implement `v002.handler.js` (Forecast Deviation) | DQBot (7) | DQBot | Medium | T001 | Handler answers forecast deviation questions with data |
| T031 | Implement `v001.handler.js` (Forecast Achievement) | DQBot (7) | DQBot | Medium | T030 | Handler answers "are we on track?" questions |
| T032 | Implement `c001.handler.js` (Overdue Receivables) | DQBot (7) | DQBot | Medium | T024, T001 | Handler answers AR overdue questions with C001 data |
| T033 | Expand `intentDetector.js` for V001, V002, C001 | DQBot (7) | DQBot | Low | T030–T032 | Keywords correctly routed to handlers |
| T034 | Expand `buildSuggestedQuestions()` | DQBot (7) | DQBot | Low | T033 | Contextual follow-up questions for each handler |

### Epic E2.4 — Insight Engine UI
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| T035 | Build `app/insights/[id]/page.tsx` | Insight (6) | Frontend | Medium | N004 complete | Insight detail page renders with all fields |
| T036 | Build InsightEvolutionChart component | Insight (6) | Frontend | Medium | T035 | Time-series chart of metric evolution |
| T037 | Build ActionManagementTable component | Insight (6) | Frontend | Medium | T035 | Action status PATCH works via UI |
| T038 | Convert `InsightsPanel.jsx` → `InsightsPanel.tsx` | Insight (6) | Refactoring | Low | None | TypeScript, fully typed |
| T039 | Expand `app/insights/page.tsx` from stub | Insight (6) | Frontend | Medium | T035, T038 | Full listing with filters |

**Wave 2: ~22 tasks · Est: ~27 agent-days · Calendar: ~8 days**

---

## WAVE 3 — INTELLIGENCE EXPANSION (Unchanged from v1)

### Epic E3.1 — Supply Dedicated API + Dashboard
T040–T048 (unchanged)

### Epic E3.2 — Business Health Score
T049–T054 (unchanged)

### Epic E3.3 — E-Series Rules
T055–T058 (unchanged)

### Epic E3.4 — Sales Completion
T059–T064 (unchanged)

**Wave 3: 25 tasks · Est: ~28 agent-days · Calendar: ~8 days**

---

## WAVE 4 — DQBOT DEPTH (Adds N018)

### Epic E4.1 — DQBot Handlers Tier 2 + 3 (Adds Customer Payments handler)
| ID | Task | Agent | Notes |
|----|------|-------|-------|
| T065–T073 | (unchanged from v1) | DQBot | |
| N018 | Implement `payments.handler.js` (Customer Payments / Collection) | DQBot | NEW — answers "what is the collection situation?" using `customer_payments` 36K rows |

### Epics E4.2–E4.4 (unchanged from v1)
T074–T086

**Wave 4: 23 tasks (was 22) · Est: ~33 agent-days · Calendar: ~8 days**

---

## WAVE 5 — PRODUCTION POLISH + CLEANUP (Revised)

### New Epic E5.0 — Database Cleanup (NEW)
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| N009 | Add primary keys to `sales`, `sales_lines`, `inventory`, `finance_ar_open_items` | All | Database | Medium | Wave 4 complete | 4 core tables have primary keys; no query regressions |
| N010 | Remove 14 backup/validation tables from production schema | All | Database | Low | Wave 4 complete | Backup tables removed; data archived if needed |
| N011 | Remove `tmp_subsidiaries` from production schema | All | Database | Low | N010 | No temp tables in production schema |

### Epic E5.1–E5.4 (unchanged from v1)
T087–T105

### Epic E5.5 — Configuration Engine
| ID | Task | Notes |
|----|------|-------|
| ~~T106~~ | ~~Create `rule_thresholds` table~~ | **DONE — `business_rule_thresholds` with 15 rows** |
| T107 | Verify SQL views read from `business_rule_thresholds` (not hardcoded) | Confirm materialized rule views use the table |
| T108 | Create `/api/config/*` route module | Unchanged |
| T109 | Build Configuration Management UI | Unchanged |

### New Epic E5.6 — Extension Enablement (NEW)
| ID | Task | Capability | Agent | Complexity | Dependencies | Acceptance Criteria |
|----|------|-----------|-------|-----------|-------------|---------------------|
| N013 | Enable `pgtap` extension for DB unit testing | Pipeline (10) | DevOps | Low | Wave 5 test setup | `pgtap` installed; first DB function test written |
| N014 | Evaluate enabling `vector` (pgvector) for DQBot semantic search | DQBot (7) | DQBot | Low | None | Decision document: semantic search architecture |

**Wave 5: ~29 tasks (was 23) · Est: ~40 agent-days · Calendar: ~9 days**

---

# PART III — TASK COUNT SUMMARY (v2)

| Wave | Tasks | ✅ Done | Net New | Agent-Days | Calendar |
|------|------:|:-------:|:-------:|:----------:|:--------:|
| Wave 0 (NEW) | 5 | 0 | +5 | ~8 | ~2 |
| Wave 1 | ~20 | 0 | +8 (docs/pipeline) | ~22 | ~6 |
| Wave 2 | ~22 | 2 (T019,T020) | +3 (N004a-c) | ~27 | ~8 |
| Wave 3 | 25 | 0 | 0 | ~28 | ~8 |
| Wave 4 | 23 | 0 | +1 (N018) | ~33 | ~8 |
| Wave 5 | ~29 | 1 (T106) | +6 (N009-N011, N013-N014, T107 revised) | ~40 | ~9 |
| **Total** | **~124** | **3** | **+18** | **~158** | **~41** |

---

# PART IV — REVISED DEPENDENCY GRAPH (KEY CHANGES)

```
NEW: N001 + N002 (RLS policies) ────────────────────┐
     T001 (clientId fix) ───────────────────────────┤→ WAVE 0 COMPLETE (Security baseline)
     T005 (JWT_SECRET validation) ──────────────────┘
                                                    │
                    ┌───────────────────────────────┘
                    ↓
     T006 (AR SOP) ──────────────────────────────────────────────────┐
     N003 (Customer Payments docs) ─────────────────────────────────┤
     T009–T011 (E-series spec) ────────────────────────────────────┤→ WAVE 1 COMPLETE
     N017 (activate data_pipeline_step_log) ──────────────────────┤
     N005–N008, N015, N016 (documentation debt) ──────────────────┘
                    │
                    ↓
     N004a/b/c (dual insight store reconciliation) ──┐
     T022 (vw_ar_dso) ──────────────────────────────┤
     T023 (vw_collection_efficiency) ───────────────┤→ T024–T028 (C-series rules)
     T021 (AR STG pipeline integration) ────────────┘         │
                                                              └→ T029 (priority engine)
                                                                        │
                                                                        └→ T032 (c001.handler)

     CANCELLED: T019, T020 (already done)
     CANCELLED: T014 (replaced by N017)
     CANCELLED: T106 (already done as business_rule_thresholds)
```

---

# PART V — REVISED CRITICAL PATH

```
N001 (RLS policies — 3d)
  → N002 (all domain tables — 4d)
    → [Wave 0 complete]
      → T006 (AR SOP — 3d)
        → N003 (Customer Payments docs — 2d)
          → T023 (vw_collection_efficiency uses customer_payments — 2d)
            → T027 (C004 rule — 3d)
              → T029 (priority engine update — 1d)
                → [Wave 2 complete]
                  → T049 (vw_business_health_score — 3d)
                    → T053 (BusinessHealthScore widget — 3d)
                      → [Wave 3 complete]
                        → T075 (contextBuilder design — 2d)
                          → T076 (contextBuilder.js — 3d)
                            → [Wave 4 complete]
                              → N009 (primary keys — 3d)
                                → [Wave 5 complete]
```

**Revised critical path: ~38 agent-days (was ~35)**
**Addition:** RLS policy implementation added to critical path as Wave 0 prerequisite.

---

# PART VI — REVISED MILESTONES

| Milestone | Wave | Key Signal |
|-----------|------|-----------|
| **M0 — Platform Secured** | W0 | RLS policies enforce tenant isolation; clientId reads from JWT; JWT_SECRET validated |
| M1 — Token Lifecycle | W1 | Refresh + logout endpoints operational |
| M2 — AR Governed | W1 | AR SOP exists; Customer Payments domain documented |
| M3 — Executive Architecture | W1 | E-series rules specified; Business Health Score formula approved |
| M4 — Pipeline Observable | W1 | `data_pipeline_step_log` armed; `/api/pipeline/status` works |
| M5 — Documentation Debt Cleared | W1 | 27 undocumented tables documented; naming errors corrected |
| M6 — Insight Store Unified | W2 | Single `insights_log` source of truth; legacy `insights` archived |
| M7 — AR Intelligence Activated | W2 | C001–C005 generating insights; priority engine updated |
| M8 — DQBot Speaks Finance | W2 | C001, V001, V002 handlers operational |
| M9 — Insight UI Complete | W2 | Detail page, evolution chart, action management all live |
| M10 — Supply First-Class | W3 | /api/supply/* + Supply dashboard live |
| M11 — Business Health Score | W3 | Score visible on Executive Home with 30-day trend |
| M12 — Cross-Domain Rules | W3 | E001, E002, E003 generating insights |
| M13 — Sales Complete | W3 | Concentration, forecast gauge, inline SQL eliminated |
| M14 — DQBot Full Coverage | W4 | All 16 handlers operational across all domains |
| M15 — AI Mode Safe | W4 | Context injection + safety guardrails |
| M16 — Multi-Turn DQBot | W4 | Conversation history persisted and rendered |
| M17 — Enterprise Ready | W5 | Responsive, accessible, tested (≥80%), PKs added, backup tables removed |
| **🏁 PRODUCTION READY** | W5 | All capabilities ≥85% maturity; zero RLS gaps; full test coverage |

---

# PART VII — REVISED RISK REGISTER

| ID | Risk | Probability | Impact | Change from v1 |
|----|------|:-----------:|:------:|----------------|
| R000 | **Zero RLS policies in production** | CONFIRMED | CRITICAL | **NEW** — was not in v1; elevated to highest priority |
| R001 | E-series rule specification requires business stakeholder input | HIGH | CRITICAL | Unchanged |
| R002 | Business Health Score formula requires business validation | HIGH | CRITICAL | Unchanged |
| R003 | `vw_sales_pipeline_vs_supply` performance at scale | MEDIUM | HIGH | Unchanged |
| R004 | DQBot AI mode hallucination without data grounding | HIGH | HIGH | Unchanged |
| R005 | C-series rules need STG AR validation | ~~HIGH~~ LOW | MEDIUM | **REDUCED** — stg_ar_open_items_clean is DONE |
| R006 | In-memory cache loss on restart | MEDIUM | MEDIUM | Unchanged |
| R007 | intentDetector regressions from keyword expansion | MEDIUM | HIGH | Unchanged |
| R008 | Pipeline log instrumentation latency | LOW | MEDIUM | Unchanged |
| R009 | Multi-turn conversation session management | MEDIUM | MEDIUM | Unchanged |
| R010 | WCAG color contrast may require design system changes | MEDIUM | MEDIUM | Unchanged |
| R011 | JWT_SECRET default in dev environment | HIGH | CRITICAL | Addressed in Wave 0 (T005) |
| R012 | AR SOP requires domain expert input | MEDIUM | HIGH | Unchanged |
| R013 | **Dual insight stores (`insights` + `insights_log`) may cause data inconsistency** | HIGH | HIGH | **NEW** — 1,371 legacy vs 5 current |
| R014 | **47 tables without primary keys — query performance at scale** | MEDIUM | MEDIUM | **NEW** — confirmed by advisor |
| R015 | **14 backup tables consuming storage and causing confusion** | LOW | LOW | **NEW** — production hygiene |
| R016 | **`data_pipeline_step_log` exists but empty — pipeline is unobservable** | HIGH | MEDIUM | **NEW** — known operational blindspot |
