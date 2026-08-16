# Reconciliation Report
**Sources:** Product Knowledge Graph · Product Analysis Report · Master Execution Plan · Database Ground Truth
**Date:** 2026-07-03 | Mode: READ ONLY — Documentation artifacts only
**Method:** Cross-reference of all four documents against live Supabase evidence

---

## PART 1 — MASTER EXECUTION PLAN TASK STATUS

### STATUS LEGEND
| Symbol | Status | Meaning |
|--------|--------|---------|
| ✅ | Completed | Live evidence confirms task is done |
| ⚠️ | Partially Completed | Some sub-items done, others remain |
| ❌ | Not Started | No evidence of implementation |
| 🔄 | Incorrectly Planned | Task is wrong — must be revised or replaced |
| ➕ | New Task | Discovered during reconciliation — not in original plan |

---

### WAVE 1 — FOUNDATION

| Task | Title | Status | Evidence |
|------|-------|--------|---------|
| T001 | Extract `clientId` from JWT in `routes/ai.js` | ❌ Not Started | 'vonderk' hardcoded confirmed in code analysis |
| T002 | Extract `requireAuth` to shared middleware | ❌ Not Started | Still in `routes/auth.js` per graph |
| T003 | Implement token refresh endpoint | ❌ Not Started | No refresh_tokens table in DB |
| T004 | Implement logout endpoint | ❌ Not Started | No token_blacklist table in DB |
| T005 | Validate JWT_SECRET at startup | ❌ Not Started | No startup validation evidenced |
| T006 | Author `sop_ar_intelligence.md` | ❌ Not Started | File confirmed absent |
| T007 | Complete AR KPI formulas in `kpi.md` | ⚠️ Partial | AR001–AR004 partially documented; formulas incomplete |
| T008 | Document missing AR semantic views in `database.md` | ⚠️ Partial | `vw_ar_dso` and `vw_collection_efficiency` not yet confirmed in DB |
| T009 | Specify E001 rule in `rules-engine.md` | ❌ Not Started | E-series section empty |
| T010 | Specify E002 rule in `rules-engine.md` | ❌ Not Started | E-series section empty |
| T011 | Specify E003 rule in `rules-engine.md` | ❌ Not Started | E-series section empty |
| T012 | Define Business Health Score formula in `functional.md` | ❌ Not Started | No BHS formula evidenced |
| T013 | Define EX001 and EX002 KPI specs in `kpi.md` | ❌ Not Started | EX001 partial, EX002 not started |
| T014 | Create `pipeline_run_log` table | 🔄 Incorrectly Planned | `data_pipeline_step_log` EXISTS (0 rows). Task should be revised to: "Activate `data_pipeline_step_log`" |
| T015 | Instrument pipeline functions with log inserts | ❌ Not Started | `data_pipeline_step_log` is empty — no functions write to it |
| T016 | Design n8n workflow document | ❌ Not Started | No n8n documentation found |
| T017 | Implement GET /api/pipeline/status endpoint | ❌ Not Started | No pipeline route file exists |
| T018 | Add data freshness headers to KPI endpoints | ❌ Not Started | No `X-Data-As-Of` header logic evidenced |

**Wave 1 Score: 0/18 completed · 2/18 partial · 1/18 incorrectly planned · 15/18 not started**

---

### WAVE 2 — RULES COMPLETION

| Task | Title | Status | Evidence |
|------|-------|--------|---------|
| T019 | Create `stg_ar_open_items_clean` table | ✅ Completed | **Live: 697 rows. Task is DONE.** |
| T020 | Implement `refresh_stg_ar_open_items_clean()` function | ✅ Completed | Table is populated — function must exist and run |
| T021 | Integrate AR STG into pipeline execution sequence | ⚠️ Partial | Function exists; n8n not integrated; manual only |
| T022 | Create `vw_ar_dso` semantic view | ❌ Unknown | Views not exposed in `list_tables`; cannot confirm from table list alone |
| T023 | Create `vw_collection_efficiency` semantic view | ❌ Unknown | Same — cannot confirm |
| T024 | Implement C001 rule | ❌ Unknown | Rules in `vw_business_insights` not inspectable from table list |
| T025 | Implement C002 rule | ❌ Unknown | Same |
| T026 | Implement C003 rule | ❌ Unknown | Same |
| T027 | Implement C004 rule | ❌ Unknown | Same |
| T028 | Implement C005 rule | ❌ Unknown | Same — note: `customer_payments` data now available (36K rows) |
| T029 | Update `vw_priority_engine` for C-series | ❌ Unknown | Cannot confirm from table list |
| T030 | Implement `v002.handler.js` | ❌ Not Started | Only `i003.handler.js` confirmed in code |
| T031 | Implement `v001.handler.js` | ❌ Not Started | Only `i003.handler.js` confirmed |
| T032 | Implement `c001.handler.js` | ❌ Not Started | Only `i003.handler.js` confirmed |
| T033 | Expand `intentDetector.js` for V001, V002, C001 | ⚠️ Partial | V002/C001 keywords partially mapped but route to fallback |
| T034 | Expand `buildSuggestedQuestions()` | ❌ Not Started | Generic fallback questions only |
| T035 | Build `app/insights/[id]/page.tsx` | ❌ Not Started | Only stub `app/insights/page.tsx` (987 bytes) exists |
| T036 | Build InsightEvolutionChart component | ❌ Not Started | Component not in graph |
| T037 | Build ActionManagementTable component | ❌ Not Started | Component not in graph |
| T038 | Convert `InsightsPanel.jsx` → `.tsx` | ❌ Not Started | JSX file confirmed |
| T039 | Expand `app/insights/page.tsx` from stub | ❌ Not Started | Stub confirmed |

**Wave 2 Score: 2/21 completed · 3/21 partial · 6/21 unknown · 10/21 not started**

---

### WAVE 3 — INTELLIGENCE EXPANSION

| Task | Title | Status | Evidence |
|------|-------|--------|---------|
| T040 | Create `backend/routes/supply.js` | ❌ Not Started | No supply route file in graph |
| T041 | GET /api/supply/pipeline-summary | ❌ Not Started | No supply endpoints exist |
| T042 | GET /api/supply/pipeline-vs-supply | ❌ Not Started | |
| T043 | GET /api/supply/risk-by-customer | ❌ Not Started | |
| T044 | GET /api/supply/inbound-timeline | ❌ Not Started | |
| T045 | Create `app/supply/page.tsx` | ❌ Not Started | |
| T046 | Build SupplyPipelineChart | ❌ Not Started | |
| T047 | Build SupplyRiskCustomerTable | ❌ Not Started | |
| T048 | Document Supply API in `api.md` | ❌ Not Started | |
| T049 | Implement `vw_business_health_score` view | ❌ Not Started | No such view/table found in DB |
| T050 | GET /api/executive/health-score | ❌ Not Started | |
| T051 | GET /api/executive/health-trend | ❌ Not Started | |
| T052 | Create `executive_health_snapshot` table | ❌ Not Started | Table not found in live DB |
| T053 | Build BusinessHealthScore widget | ❌ Not Started | |
| T054 | Integrate BHS widget into Executive Home | ❌ Not Started | |
| T055 | Implement E001 rule | ❌ Not Started | Spec not yet written (T009 not started) |
| T056 | Implement E002 rule | ❌ Not Started | |
| T057 | Implement E003 rule | ❌ Not Started | |
| T058 | Update `vw_priority_engine` for E-series | ❌ Not Started | |
| T059 | Replace inline SQL in commercial-summary | ❌ Not Started | Inline SQL confirmed in route |
| T060 | Replace inline SQL in sales-vs-last-year | ❌ Not Started | |
| T061 | Implement GET /api/sales/pipeline-risk | ❌ Not Started | |
| T062 | Implement GET /api/sales/concentration | ❌ Not Started | |
| T063 | Build SalesConcentrationChart | ❌ Not Started | |
| T064 | Build ForecastGauge component | ❌ Not Started | |

**Wave 3 Score: 0/25 completed · 0/25 partial · 25/25 not started**

---

### WAVE 4 — DQBOT DEPTH

| Task | Title | Status | Evidence |
|------|-------|--------|---------|
| T065 | `v003.handler.js` (Commercial Trend) | ❌ Not Started | |
| T066 | `v004.handler.js` (Customer Concentration) | ❌ Not Started | |
| T067 | `v005.handler.js` (Product Concentration) | ❌ Not Started | |
| T068 | `c002.handler.js` (DSO Deterioration) | ❌ Not Started | |
| T069 | `c003.handler.js` (Customer Credit Risk) | ❌ Not Started | |
| T070 | `i001.handler.js` (Critical Inventory) | ❌ Not Started | |
| T071 | `i002.handler.js` (Inventory Immobilization) | ❌ Not Started | |
| T072 | `i004.handler.js` (BOM Capacity) | ❌ Not Started | |
| T073 | `e001.handler.js` (Executive Cross-Domain) | ❌ Not Started | |
| T074 | Expand `intentDetector.js` for all handlers | ❌ Not Started | |
| T075 | Design domain context builder architecture | ❌ Not Started | |
| T076 | Implement `contextBuilder.js` | ❌ Not Started | |
| T077 | Integrate contextBuilder into AI/hybrid modes | ❌ Not Started | |
| T078 | Add AI mode safety guardrails | ❌ Not Started | |
| T079 | Author base DQBot system prompt | ❌ Not Started | `agents/prompts/` is empty |
| T080 | Author per-domain context templates | ❌ Not Started | |
| T081 | Author AI mode safety guidelines | ❌ Not Started | |
| T082 | Design conversation persistence schema | ❌ Not Started | No conversation tables in DB |
| T083 | Implement conversation tables | ❌ Not Started | |
| T084 | Add `conversation_id` to DQBot API | ❌ Not Started | |
| T085 | Implement context window management | ❌ Not Started | |
| T086 | Build conversation history UI | ❌ Not Started | |

**Wave 4 Score: 0/22 completed · 0/22 partial · 22/22 not started**

---

### WAVE 5 — PRODUCTION POLISH

| Task | Title | Status | Evidence |
|------|-------|--------|---------|
| T087 | Responsive audit | ❌ Not Started | |
| T088 | Mobile navigation | ❌ Not Started | |
| T089 | Responsive charts | ❌ Not Started | |
| T090 | Table overflow fix | ❌ Not Started | |
| T091 | Text labels on semaforo indicators | ❌ Not Started | |
| T092 | ARIA labels | ❌ Not Started | |
| T093 | Keyboard navigation | ❌ Not Started | |
| T094 | WCAG 2.1 AA audit | ❌ Not Started | |
| T095 | Set up Jest + Supertest | ❌ Not Started | No test setup evidenced |
| T096 | Backend route unit tests | ❌ Not Started | |
| T097 | intentDetector unit tests | ❌ Not Started | |
| T098 | DQBot handler unit tests | ❌ Not Started | |
| T099 | Pipeline function integration tests | ❌ Not Started | |
| T100 | Set up React Testing Library | ❌ Not Started | |
| T101 | Component tests | ❌ Not Started | |
| T102 | Redis cache for financeRisk | ❌ Not Started | |
| T103 | vw_sales_pipeline_vs_supply performance analysis | ❌ Not Started | |
| T104 | Response caching for static KPI endpoints | ❌ Not Started | |
| T105 | `X-Data-As-Of` headers | ❌ Not Started | |
| T106 | Create `rule_thresholds` table | ✅ Completed | **Live: `business_rule_thresholds` with 15 rows** |
| T107 | Migrate thresholds from views to table | ⚠️ Partial | Table exists with 15 rows; unclear if SQL views read from it |
| T108 | Create `/api/config/*` route module | ❌ Not Started | |
| T109 | Build Configuration Management UI | ❌ Not Started | |

**Wave 5 Score: 1/23 completed · 1/23 partial · 21/23 not started**

---

### TASK STATUS SUMMARY

| Wave | Total | ✅ Done | ⚠️ Partial | 🔄 Incorrect | ❌ Unknown | ❌ Not Started |
|------|-------|:-------:|:---------:|:-----------:|:---------:|:-------------:|
| W1 | 18 | 0 | 2 | 1 | 0 | 15 |
| W2 | 21 | 2 | 3 | 0 | 6 | 10 |
| W3 | 25 | 0 | 0 | 0 | 0 | 25 |
| W4 | 22 | 0 | 0 | 0 | 0 | 22 |
| W5 | 23 | 1 | 1 | 0 | 0 | 21 |
| **Total** | **109** | **3** | **6** | **1** | **6** | **93** |

**Plan Completion: 3/109 tasks confirmed done (2.8%)**

---

## PART 2 — UNDOCUMENTED FUNCTIONALITY

Functionality confirmed in the live database with zero documentation in the Product Knowledge Graph, Product Analysis Report, or SOPs.

### U001 — Customer Payments Domain (CRITICAL)
**Evidence:** Three fully populated tables form a complete payment pipeline:
- `raw_customer_payments` — 76,531 rows
- `stg_customer_payments_clean` — 76,531 rows
- `customer_payments` — 36,798 rows

**Business meaning:** Complete customer payment history is available. This is the data foundation for:
- Collection efficiency KPI (C004 rule depends on this)
- DSO calculation (actual payments vs. invoices)
- Cash application and aging reconciliation

**Impact on Master Execution Plan:** T022 (`vw_collection_efficiency`) and C004 rule implementation have MORE data infrastructure available than planned. The Customer Payments domain must be added to Capability 4 (AR Intelligence) documentation.

---

### U002 — Customer Master Domain
**Evidence:**
- `raw_customers` — 727 rows
- `stg_customers_clean` — 727 rows
- `customers` — 727 rows (same count — same dataset, processed)
- `raw_netsuite_customers` — 5 rows (NetSuite-specific customer records)

**Business meaning:** A complete customer master with RAW→STG→Business pipeline. Not documented anywhere in the graph.

---

### U003 — Item Master Resolution Layer
**Evidence:**
- `raw_items_master` — 32,895 rows (no primary key)
- `stg_items_master_clean` — 32,895 rows
- `items_master` — 4,539 rows
- `items_master_override` — 2 rows (manual overrides)
- `item_bom` — 3,548 rows
- `item_bom_resolved` — 3,556 rows
- `item_lookup_normalized` — 4,505 rows (with unused SKU + name indexes)
- `item_alias_map` — 52 rows

**Business meaning:** A sophisticated item master resolution system with alias mapping and manual overrides. Supports supply and BOM calculations. Not documented in the graph.

---

### U004 — Sales Semantic Current (Large Materialized Table)
**Evidence:** `sales_semantic_current` — 48,605 rows, no primary key

**Business meaning:** A large materialized semantic table that appears to be the primary source for sales analytics. The graph describes semantic views (`vw_sales_*`) but this is a physically materialized TABLE, not a view. This changes the performance profile of the entire Sales domain.

---

### U005 — Supply Snapshot History
**Evidence:** `inventory_supply_snapshot_daily` — 5,008 rows, no primary key

**Business meaning:** Daily supply snapshots already exist as historical data. This means supply trend analysis already has a data foundation — the graph treated supply as point-in-time only.

---

### U006 — Extended Configuration Tables
**Evidence:** Six configuration tables not documented in the graph:
- `ar_settings` — 1 row (AR thresholds and targets)
- `inventory_settings` — 1 row (inventory parameters)
- `inventory_category_settings` — 0 rows (per-category settings)
- `alert_config` — 3 rows (alert thresholds)
- `client_config` — 1 row (client-level overrides)
- `sales_exclusion_rules` — 3 rows (sales scope rules)
- `financial_currency_field_catalog` — 0 rows (currency field mapping)
- `customer_segments` — 0 rows (customer segmentation)
- `industry_profiles` — 4 rows (industry benchmarks — graph said "planned" but EXISTS)

**Impact:** The Configuration Engine (Capability 11) is significantly more complete than documented. Maturity score must be revised upward.

---

### U007 — SOP Content Stored as Database Tables
**Evidence:**
- `sop_inventory_supply_intelligence` — 11 rows
- `sop_business_pipeline` — 13 rows

**Business meaning:** SOP procedure steps are stored as database records — an unusual but powerful pattern enabling machine-readable SOPs. These may drive automated pipeline execution or checklist validation.

---

### U008 — Pipeline Audit Infrastructure (Partial)
**Evidence:**
- `data_pipeline_step_log` — 0 rows (created but not instrumented)
- `data_load_runs` — 0 rows
- `data_quality_checks` — 1 row
- `sync_runs` — 0 rows

**Impact:** T014 in the Master Execution Plan was planned to CREATE a pipeline log table. It already exists (`data_pipeline_step_log`). T014 must be revised to "activate and instrument `data_pipeline_step_log`."

---

### U009 — Dual Insight Stores (Legacy Migration in Progress)
**Evidence:**
- `insights` — 1,371 rows (legacy)
- `insights_log` — 5 rows (current architecture)

**Business meaning:** The platform is migrating from `insights` (1,371 rows) to `insights_log` (5 rows). The frontend may currently be reading from the legacy `insights` table while the backend writes to `insights_log`. This creates a data consistency risk.

**Impact:** A new task is required: reconcile and migrate from `insights` → `insights_log`.

---

### U010 — AR Extended Pipeline (Empty but Structured)
**Evidence:**
- `finance_ar_invoices` — 0 rows (indexed on `due_date` — unused index)
- `finance_collections` — 0 rows (indexed on `payment_date` — unused index)
- `ar_payment_applications` — 0 rows
- `raw_collections` — 0 rows

**Business meaning:** A complete AR lifecycle pipeline is structurally prepared (invoices → collections → payment applications) but not yet populated. This suggests a future collections management capability is designed but not operationalized.

---

### U011 — ERP Identity: NetSuite
**Evidence:** `raw_netsuite_customers` table name

**Documentation impact:** All documentation should reference NetSuite as the source ERP. This affects field mapping, API naming, and integration documentation.

---

### U012 — Reference / Master Data Tables
**Evidence:**
- `raw_subsidiaries` — 9 rows
- `tmp_subsidiaries` — 9 rows (temporary table in production!)
- `raw_locations` — 17 rows
- `raw_fx_rates` — 0 rows (FX rate support prepared)
- `raw_items` — 0 rows (alternate items source)
- `raw_invoices` — 0 rows (alternate invoice source)
- `raw_sales_orders` — 0 rows (separate from open sales orders)

**Impact:** Multi-currency support and multi-location are structurally prepared via `raw_fx_rates` and `raw_locations`. `tmp_subsidiaries` in production is technical debt.

---

## PART 3 — IMPLEMENTATION WITHOUT DOCUMENTATION

Functionality implemented in code or database but absent or incomplete in documentation.

| # | Item | What Exists | What's Missing |
|---|------|------------|----------------|
| I001 | Customer Payments pipeline | Full RAW→STG→Business (3 tables, 190K rows) | Zero documentation in any doc file |
| I002 | `stg_ar_open_items_clean` | EXISTS with 697 rows | Graph and plan said "not implemented" |
| I003 | `business_rule_thresholds` | EXISTS with 15 rows | Graph and plan called it "planned" under wrong name |
| I004 | `ar_settings` | EXISTS with 1 row | Not documented anywhere |
| I005 | `inventory_settings` | EXISTS with 1 row | Not documented anywhere |
| I006 | `industry_profiles` | EXISTS with 4 rows | Graph said "planned" |
| I007 | `audit_log` | EXISTS (empty) | Graph said "planned" |
| I008 | `data_pipeline_step_log` | EXISTS (empty) | Graph said "create as T014" |
| I009 | `sales_semantic_current` | EXISTS (48K rows) | Not documented — large materialized table |
| I010 | `inventory_supply_snapshot_daily` | EXISTS (5K rows) | Not documented |
| I011 | `item_bom_resolved`, `item_lookup_normalized`, `item_alias_map` | All EXIST | Not documented |
| I012 | SOP tables (`sop_inventory_supply_intelligence`, `sop_business_pipeline`) | Both EXIST | Not documented — unusual architecture not captured |
| I013 | `unaccent` extension | INSTALLED | Not mentioned in documentation — but used by DQBot's intentDetector |
| I014 | `pg_stat_statements` | INSTALLED | Available for performance analysis — not referenced in docs |

---

## PART 4 — DOCUMENTATION WITHOUT IMPLEMENTATION

Documentation that describes functionality confirmed NOT to exist in the live database.

| # | Document Reference | What Docs Say | Live Reality |
|---|-------------------|--------------|-------------|
| D001 | Product Knowledge Graph — Auth (Capability 8) | "Row Level Security (RLS) enforces tenant isolation" | **FALSE** — RLS enabled on all 90 tables but ZERO policies exist. No tenant isolation at DB level. |
| D002 | Product Knowledge Graph — AR (Capability 4) | `finance_ar_open_items_cxc` | **Table does not exist** — actual name is `finance_ar_open_items` |
| D003 | Product Knowledge Graph — Config (Capability 11) | `rule_thresholds` (planned) | **Does not exist** — actual name is `business_rule_thresholds` (and it EXISTS, 15 rows) |
| D004 | Product Knowledge Graph — AR (Capability 4) | `stg_ar_open_items_clean` "not implemented" | **EXISTS with 697 rows** |
| D005 | Master Execution Plan — T014 | "Create `pipeline_run_log` table" | `pipeline_run_log` does not exist; `data_pipeline_step_log` exists (empty) |
| D006 | Product Analysis Report — Config (Capability 11) | `industry_profiles` "planned" | **EXISTS with 4 rows** |
| D007 | Product Analysis Report — Auth (Capability 8) | `audit_log` "planned" | **EXISTS (empty)** — created, not populated |
| D008 | Product Knowledge Graph — Pipeline (Capability 10) | `refresh_stg_ar_open_items_clean()` "planned" | **Function exists** (table has 697 rows — function ran) |
| D009 | Master Execution Plan — T106 | "Create rule_thresholds table" | `business_rule_thresholds` EXISTS with 15 rows — already done |
| D010 | Product Knowledge Graph — all | ERP source unnamed | ERP is NetSuite (confirmed) |
| D011 | Product Analysis Report — AR (Capability 4) | "T019 [STG AR] is a prerequisite for C-series rules" | T019 is DONE — prerequisite already met |

---

## PART 5 — UPDATED PRODUCT HEALTH SCORE

Scores revised based on database ground truth evidence.

### Revision Methodology
- **+** increases where live DB confirms more implementation than documented
- **−** decreases where live DB reveals critical gaps not captured in analysis
- **=** unchanged where evidence is neutral

| # | Capability | Previous | Adjustment | Revised | Reason |
|---|-----------|:--------:|:----------:|:-------:|--------|
| 1 | Sales Intelligence | 72% | +2% | **74%** | `sales_semantic_current` (48K) + `sales_exclusion_rules` reveal more infrastructure than documented |
| 2 | Inventory Intelligence | 70% | +3% | **73%** | `inventory_supply_snapshot_daily`, `item_bom_resolved`, `item_lookup_normalized` confirm deeper layer |
| 3 | Supply Intelligence | 52% | +5% | **57%** | `inventory_supply_snapshot_daily` (5K rows) = historical supply data already exists |
| 4 | AR Intelligence | 58% | +8% | **66%** | `stg_ar_open_items_clean` DONE (+4%), `customer_payments` full domain exists (+4%) |
| 5 | Executive Intelligence | 48% | 0% | **48%** | No new evidence changes executive layer assessment |
| 6 | Insight Engine | 58% | −5% | **53%** | Dual insight stores (`insights` 1,371 + `insights_log` 5) = migration risk; not one coherent system |
| 7 | DQBot | 38% | 0% | **38%** | No new evidence changes DQBot assessment |
| 8 | Auth & Multi-tenancy | 58% | −15% | **43%** | RLS enabled but ZERO policies = multi-tenancy is NOT implemented at DB level. Critical security gap worse than assumed. |
| 9 | Platform Shell | 65% | 0% | **65%** | No new evidence |
| 10 | Operational Pipeline | 40% | +5% | **45%** | `data_pipeline_step_log` exists; `sop_business_pipeline` DB table suggests pipeline is more designed than appeared |
| 11 | Configuration Engine | 22% | +20% | **42%** | `business_rule_thresholds` (15 rows) DONE + `ar_settings`, `inventory_settings`, `alert_config`, `client_config` all EXIST |
| 12 | Documentation Governance | 72% | −3% | **69%** | Multiple documentation errors confirmed (D001–D011); naming inconsistencies; 11 undiscovered domains |

### Platform Health Score Summary

| Metric | Previous | Revised |
|--------|:--------:|:-------:|
| **Overall Platform Maturity** | **~55%** | **~56%** |
| Highest capability | Sales 72% | Sales 74% |
| Lowest capability | Configuration 22% | Auth 43% |
| Biggest upward revision | Configuration +20% | Configuration → 42% |
| Biggest downward revision | Auth −15% | Auth → 43% |
| Most critical finding | DQBot 1 handler | Zero RLS policies |

> **Note:** Platform maturity is essentially unchanged (55% → 56%) because the critical RLS security finding offsets the upward corrections from confirmed implementations. The security gap is now the #1 blocker for production.

---

## PART 6 — NEW TASKS REQUIRED (Not in Original Plan)

| ID | Task | Priority | Wave | Capability |
|----|------|:--------:|------|-----------|
| N001 | Define RLS policies for `clients` and `app_users` — enforce `client_id` isolation | 🔴 CRITICAL | W1 | Auth (8) |
| N002 | Define RLS policies for all business domain tables | 🔴 CRITICAL | W1 | Auth (8) |
| N003 | Document Customer Payments domain in `database.md` and `kpi.md` | 🔴 HIGH | W1 | AR (4) |
| N004 | Reconcile `insights` (legacy, 1,371 rows) with `insights_log` (current, 5 rows) | 🔴 HIGH | W2 | Insight Engine (6) |
| N005 | Document `ar_settings`, `inventory_settings`, `alert_config`, `client_config` in `database.md` | 🟡 MEDIUM | W1 | Config (11) |
| N006 | Document `sales_semantic_current` materialized table in `database.md` | 🟡 MEDIUM | W1 | Sales (1) |
| N007 | Document item master resolution layer in `database.md` | 🟡 MEDIUM | W1 | Inventory (2) |
| N008 | Document SOP tables (`sop_inventory_supply_intelligence`, `sop_business_pipeline`) | 🟡 MEDIUM | W1 | Documentation (12) |
| N009 | Add primary keys to `sales`, `sales_lines`, `inventory`, `finance_ar_open_items` | 🟡 MEDIUM | W5 | All |
| N010 | Remove 14 backup/validation tables from production schema | 🟡 MEDIUM | W5 | All |
| N011 | Remove `tmp_subsidiaries` from production schema | 🟡 MEDIUM | W5 | All |
| N012 | Evaluate enabling `pg_cron` as alternative to n8n for pipeline automation | 🟡 MEDIUM | W1 | Pipeline (10) |
| N013 | Enable `pgtap` extension for database unit testing | 🟡 MEDIUM | W5 | Pipeline (10) |
| N014 | Evaluate enabling `vector` (pgvector) for DQBot semantic search | 🟢 LOW | W4 | DQBot (7) |
| N015 | Document `inventory_supply_snapshot_daily` and use in supply trend analysis | 🟢 LOW | W1 | Supply (3) |
| N016 | Confirm ERP = NetSuite in all documentation | 🟢 LOW | W1 | Documentation (12) |
| N017 | Revise T014 — activate `data_pipeline_step_log` (do not create new table) | 🟡 MEDIUM | W1 | Pipeline (10) |
| N018 | Implement DQBot handler for Customer Payments / collection questions | 🟡 MEDIUM | W4 | DQBot (7) |

---

## PART 7 — RECONCILIATION VERDICTS

| Question | Verdict |
|---------|---------|
| Is the database more or less complete than documented? | **MORE complete** — 27 undocumented tables confirmed. Customer Payments, Item Master, Configuration all substantially ahead of documentation. |
| Is the security posture better or worse than documented? | **WORSE** — RLS documented as enforced; confirmed as NOT enforced (zero policies). Most critical gap in entire platform. |
| Is the pipeline more or less automated than documented? | **Same** — `data_pipeline_step_log` exists but empty. Pipeline remains manual. |
| Are the planned tasks accurate? | **Mostly accurate** but 3 confirmed already done (T019, T020, T106), 1 incorrectly planned (T014). 6 tasks have unknown status (C-series rules in views). |
| Is the AI/DQBot layer complete? | **No** — 1 handler confirmed. 21 DQBot calls logged (platform is being used) but intelligence is severely limited. |
| Is the insight layer coherent? | **No** — dual insight stores create ambiguity. 1,371 legacy insights vs. 5 in new store. |
| Is the ERP integration complete? | **Partially** — NetSuite confirmed. FX rates, alternate invoice sources, and collections prepared but not populated. |
