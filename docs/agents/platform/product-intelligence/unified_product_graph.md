# Unified Product Graph — v2
**Supersedes:** product_graph.md
**Verified against:** Live Supabase instance `ndruztnrxzcyyihafmtf` (2026-07-03)
**ERP Source:** NetSuite
**PostgreSQL:** 17.6.1 | Region: us-west-2 | Status: ACTIVE_HEALTHY

> **Verification legend:**
> ✅ Confirmed live in Supabase | ⚠️ Exists but differs from docs | ❌ Not confirmed | 📌 New — was undocumented

---

## CAPABILITY 1 — SALES INTELLIGENCE

```
FRONTEND
  app/sales/page.tsx                     Sales Intelligence Dashboard
  app/page.tsx                           Executive Home (sales section)
  components/SalesTrendChart.tsx         Monthly revenue trend
  components/SalesCategoryChart.tsx      Revenue by category
  components/TopCustomersBarChart.tsx    Top 10 customers
  services/analytics/sales/diagnostics  Sales status evaluation
  services/analytics/sales/drivers      Sales driver extraction
  services/analytics/sales/alerts       Sales alert generation
  services/analytics/sales/actions      Sales recommended actions
  services/aiService.js → getExecutiveSummary()
    ↓
API
  GET /api/kpi/sales/total
  GET /api/kpi/sales/monthly
  GET /api/kpi/sales/by-category
  GET /api/kpi/sales/top-customers
  GET /api/kpi/sales/by-subsidiary
  GET /api/kpi/sales/forecast-monthly
  GET /api/kpi/sales/forecast-quarterly
  GET /api/kpi/sales/top-participation-2026
  GET /api/kpi/home/commercial-summary    ⚠️ Contains inline SQL — not using KPI view
  GET /api/kpi/home/sales-vs-last-year    ⚠️ Contains inline SQL — not using KPI view
  GET /api/analytics/sales
  GET /api/analytics/executive           (includes sales)
    ↓
BACKEND
  routes/sales.js
  routes/analytics.js
  services/analyticsEngine.js → buildExecutiveAnalytics()
    ↓
DATABASE (all verified ✅ unless noted)
  RAW (NetSuite source)
    raw_sales ✅                          15,915 rows
    raw_sales_lines ✅                    56,967 rows  NO PRIMARY KEY ⚠️
    raw_open_sales_orders ✅              341 rows
    raw_invoices ✅ 📌                    0 rows (alternate invoice source — undocumented)
    raw_sales_orders ✅ 📌                0 rows (separate from open_sales_orders)
    raw_subsidiaries ✅ 📌                9 rows
    raw_fx_rates ✅ 📌                    0 rows (multi-currency prepared)
  STG
    stg_sales_clean ✅                    15,913 rows  NO PRIMARY KEY ⚠️
    stg_sales_lines_clean ✅              56,965 rows  NO PRIMARY KEY ⚠️
  BUSINESS
    sales ✅                              15,229 rows  NO PRIMARY KEY ⚠️
    sales_lines ✅                        54,232 rows  NO PRIMARY KEY ⚠️
    sales_semantic_current ✅ 📌          48,605 rows  NO PRIMARY KEY ⚠️
                                         Large materialized semantic table — not in original graph
    open_sales_order_demand ✅            341 rows  NO PRIMARY KEY ⚠️
    sales_forecast_monthly ✅ 📌          12 rows (TABLE — not just a view)
    sales_exclusion_rules ✅ 📌           3 rows
  CONFIGURATION
    sales_settings ✅                     1 row
  BACKUP TABLES (technical debt)
    sales_bak_20260423 ✅ 📌              13,695 rows — backup
    sales_lines_bak_20260423 ✅ 📌        48,540 rows — backup
    raw_sales_bak_20260423 ✅ 📌          13,695 rows — backup
    raw_sales_lines_bak_20260423 ✅ 📌    48,540 rows — backup
    sales_ok_20260423 ✅ 📌               13,762 rows — validation
    sales_lines_ok_20260423 ✅ 📌         48,754 rows — validation
    sales_base_ok ✅ 📌                   13,762 rows — baseline
    sales_lines_base_ok ✅ 📌             48,754 rows — baseline
    sales_scope_ar_ok ✅ 📌               13,689 rows — scoped validation
    ↓
BUSINESS RULES
  V001  Forecast Achievement Risk        Projected < Target × 89%   → HIGH
  V002  Forecast Deviation               Actual vs Forecast < -10%  → HIGH
  V003  Commercial Trend                 MoM growth < -10%          → HIGH
  V004  Customer Concentration           Top 10 > 70% revenue       → HIGH
  V005  Product Concentration            Top products > 70%         → HIGH
    ↓
KPIs
  S001  Monthly Sales
  S002  Previous Month Sales
  S003  Sales Growth MoM
  S004  Forecast Achievement %
  S005  Projected Revenue (Actual + Deliverable)
  S006  Pipeline Revenue
  S007  Deliverable Revenue
  S008  Revenue at Supply Risk
  S009  Pipeline Margin
  S010  Customer Concentration
  S011  Product Concentration
    ↓
DOCUMENTATION
  docs/business/functional.md           ✅
  docs/business/database.md             ⚠️ Missing: sales_semantic_current, sales_exclusion_rules
  docs/business/kpi.md                  ✅ S001–S011
  docs/business/rules-engine.md         ✅ V001–V005
  docs/business/api.md                  ⚠️ May not reflect all 11 endpoints
  docs/sop/sop_sales_intelligence.md    ✅ v2.0 complete
```

---

## CAPABILITY 2 — INVENTORY INTELLIGENCE

```
FRONTEND
  app/inventory/page.tsx                 Inventory Intelligence Dashboard
  app/page.tsx                           Executive Home (critical demand mix)
  services/analytics/inventory/*
    ↓
API
  GET /api/kpi/inventory/commercial-stock
  GET /api/kpi/inventory/commercial-valuation
  GET /api/kpi/inventory/critical-demand-mix
  GET /api/kpi/inventory/critical-stock
  GET /api/kpi/inventory/by-class
  GET /api/kpi/inventory/total-valuation
  GET /api/kpi/inventory/coverage
  GET /api/kpi/inventory/top-critical
  GET /api/kpi/inventory/slow-moving
  GET /api/kpi/inventory/slow-moving-summary
  GET /api/kpi/inventory/critical-items-count
  GET /api/kpi/inventory/critical-value
  GET /api/analytics/inventory
    ↓
BACKEND
  routes/inventory.js
  routes/analytics.js
  services/analyticsEngine.js
    ↓
DATABASE (all verified ✅ unless noted)
  RAW
    raw_inventory ✅                      8,195 rows  NO PRIMARY KEY ⚠️
    raw_inventory_transactions ✅         103,078 rows  NO PRIMARY KEY ⚠️
    raw_item_bom ✅                       3,587 rows  NO PRIMARY KEY ⚠️
    raw_items_master ✅ 📌                32,895 rows  NO PRIMARY KEY ⚠️ (undocumented raw layer)
    raw_items ✅ 📌                       0 rows (alternate items source)
    raw_locations ✅ 📌                   17 rows
  STG
    stg_inventory_clean ✅               8,195 rows  NO PRIMARY KEY ⚠️
    stg_inventory_transactions_clean ✅  103,078 rows  NO PRIMARY KEY ⚠️
    stg_items_master_clean ✅            32,895 rows  NO PRIMARY KEY ⚠️
  BUSINESS / ITEM RESOLUTION LAYER 📌 (all undocumented)
    items_master ✅ 📌                   4,539 rows
    items_master_override ✅ 📌          2 rows (manual item overrides)
    item_bom ✅ 📌                       3,548 rows (processed BOM)
    item_bom_resolved ✅ 📌              3,556 rows  NO PRIMARY KEY ⚠️
    item_lookup_normalized ✅ 📌         4,505 rows  NO PRIMARY KEY ⚠️ (unused indexes)
    item_alias_map ✅ 📌                 52 rows  NO PRIMARY KEY ⚠️
    inventory ✅                         8,040 rows  NO PRIMARY KEY ⚠️
    inventory_stock ✅ 📌                7,853 rows  NO PRIMARY KEY ⚠️
    inventory_movements ✅ 📌            97,941 rows  NO PRIMARY KEY ⚠️
    inventory_bom_capacity_current ✅    298 rows  NO PRIMARY KEY ⚠️
    inventory_supply_semantic_current ✅ 2,510 rows  NO PRIMARY KEY ⚠️
    inventory_supply_snapshot_daily ✅ 📌 5,008 rows  NO PRIMARY KEY ⚠️
                                         Daily snapshots — ALREADY has historical data
    inbound_shipments ✅ 📌              251 rows  NO PRIMARY KEY ⚠️
    stg_inbound_shipments_clean ✅       179 rows
  CONFIGURATION
    inventory_settings ✅ 📌             1 row (undocumented)
    inventory_category_settings ✅ 📌    0 rows (undocumented)
    ↓
BUSINESS RULES
  I001  Critical Inventory Coverage      Coverage months < 1         → HIGH
  I002  Inventory Immobilization         Stock > 0 AND low rotation  → HIGH
  I003  Supply Capacity Risk             Revenue at Risk > 25%       → HIGH (HANDLER EXISTS)
  I004  BOM Capacity Constraint          Critical component          → HIGH
  I005  Inventory Data Quality           Missing cost for high revenue → HIGH
    ↓
KPIs
  I001  Total Stock
  I002  Total Inventory Valuation
  I003  Coverage Months
  I004  Critical Stock Items
  I005  Slow Moving Inventory
    ↓
DOCUMENTATION
  docs/business/functional.md           ✅
  docs/business/database.md             ⚠️ Missing: item resolution layer, inventory_stock,
                                           inventory_movements, snapshot_daily, inbound_shipments
  docs/business/kpi.md                  ✅ I001–I005
  docs/business/rules-engine.md         ✅ I001–I005
  docs/sop/sop_inventory_supply_intelligence.md  ✅
```

---

## CAPABILITY 3 — SUPPLY INTELLIGENCE

```
FRONTEND
  [NO dedicated dashboard — data surfaces via Inventory and Executive]
    ↓
API
  [NO dedicated /api/supply/* routes — CRITICAL GAP]
  Supply data accessible only via:
    GET /api/analytics/executive
    GET /api/analytics/inventory
    ↓
BACKEND
  [NO dedicated routes/supply.js — CRITICAL GAP]
  routes/analytics.js
  services/analyticsEngine.js
    ↓
DATABASE
  RAW
    raw_inbound_shipments ✅             179 rows  NO PRIMARY KEY ⚠️
    raw_item_bom ✅                      3,587 rows (shared with Inventory)
  STG
    stg_inbound_shipments_clean ✅       179 rows  NO PRIMARY KEY ⚠️
  BUSINESS
    inbound_shipments ✅ 📌              251 rows (more rows than RAW — aggregation or additional data)
    item_bom_resolved ✅ 📌              3,556 rows (shared — BOM resolution for supply calc)
    inventory_supply_semantic_current ✅ 2,510 rows
    inventory_supply_snapshot_daily ✅ 📌 5,008 rows — DAILY HISTORY EXISTS
  SEMANTIC VIEWS (unconfirmable from table list — expected to exist)
    vw_sales_pipeline_vs_supply         ❌ Cannot confirm — view not in table list
    vw_sales_pipeline_supply_executive_summary ❌ Cannot confirm
    vw_item_bom_resolved                ❌ Cannot confirm (may be materialized as item_bom_resolved)
    vw_sales_pipeline_risk              ❌ Cannot confirm
    vw_sales_pipeline_supply_risk_customers ❌ Cannot confirm
    vw_sales_open_demand_monthly        ❌ Cannot confirm
    ↓
BUSINESS RULES
  I003  Supply Capacity Risk   → HIGH (DQBOT HANDLER: i003.handler.js EXISTS)
  I004  BOM Capacity Constraint → HIGH
    ↓
KPIs
  SUP001  Supply Available Qty
  SUP002  Deliverable Revenue
  SUP003  Revenue at Supply Risk
  SUP004  Deliverable Revenue %
    ↓
DOCUMENTATION
  docs/business/database.md             ✅ Supply semantic views documented
  docs/business/kpi.md                  ✅ SUP001–SUP004
  docs/business/rules-engine.md         ✅ I003, I004
  docs/sop/sop_inventory_supply_intelligence.md ✅
  ⚠️ Missing: inventory_supply_snapshot_daily documentation
  ⚠️ Missing: Supply dedicated API and dashboard (not yet built)
```

---

## CAPABILITY 4 — ACCOUNTS RECEIVABLE INTELLIGENCE

```
FRONTEND
  app/finance/page.tsx                   Finance Dashboard
  app/finance/dso-analytics/            DSO drill-down
  app/page.tsx                           Executive Home (aging widget)
  components/AgingDonutChart.tsx
  components/FinanceAgingBarChart.tsx
  components/FinanceRiskRadar.tsx
  components/FinanceIntelligenceSummary.tsx
  components/FinanceActionTable.tsx
  services/analytics/finance/*
    ↓
API
  GET /api/kpi/finance/current
  GET /api/kpi/finance/ar-aging-summary
  GET /api/kpi/finance/ar-open-items
  GET /api/kpi/finance/special-receivables
  GET /api/kpi/finance/special-receivables-detail
  GET /api/kpi/finance/top-risk-customers
  GET /api/kpi/finance/risk-summary
  GET /api/kpi/finance/risk-bundle
  GET /api/kpi/finance/dso-analytics
  GET /api/kpi/finance/dso-customers
  GET /api/kpi/finance/risk-trend        ⚠️ Contains 40-line inline CTE SQL
  GET /api/kpi/customers/health-summary
  GET /api/kpi/customers/health-detail
  GET /api/analytics/finance
  POST /api/admin/finance/refresh-snapshots
    ↓
BACKEND
  routes/finance.js                      359 lines, 15 endpoints
  routes/analytics.js
  services/financeRisk.js                In-memory cache (5 min TTL) ⚠️ Not production-grade
  services/analyticsEngine.js → buildFinanceAnalysis()
    ↓
DATABASE (all verified ✅ unless noted)
  RAW
    raw_ar_open_items ✅                  697 rows  NO PRIMARY KEY ⚠️
    raw_customer_payments ✅ 📌           76,531 rows  NO PRIMARY KEY ⚠️
                                         COMPLETE PAYMENTS DOMAIN — UNDOCUMENTED
    raw_collections ✅ 📌                0 rows (collections domain prepared)
    raw_invoices ✅ 📌                   0 rows (alternate invoice source)
  STG
    stg_ar_open_items_clean ✅            697 rows  NO PRIMARY KEY ⚠️
                                         ⚠️ Was "NOT IMPLEMENTED" in graph — CONFIRMED DONE
    stg_customer_payments_clean ✅ 📌    76,531 rows  NO PRIMARY KEY ⚠️
                                         UNDOCUMENTED — matches raw_customer_payments exactly
  BUSINESS
    finance_ar_open_items ✅              1,061 rows  NO PRIMARY KEY ⚠️
                                         ⚠️ Graph called this `finance_ar_open_items_cxc` — WRONG
    finance_ar_invoices ✅ 📌            0 rows (invoice reconciliation — prepared)
    finance_collections ✅ 📌            0 rows (collections — prepared)
    finance_ar_snapshot_daily ✅         2 rows
    finance_customer_risk_snapshot ✅    683 rows
    customer_payments ✅ 📌              36,798 rows  NO PRIMARY KEY ⚠️
                                         UNDOCUMENTED business-layer payments table
    ar_payment_applications ✅ 📌        0 rows  NO PRIMARY KEY ⚠️
    customer_daily_snapshot ✅ 📌        1 row
    kpi_finance_current_snapshot_ok ✅ 📌  1 row (validation snapshot)
    kpi_finance_ar_aging_summary_ok ✅ 📌  6 rows (validation snapshot)
    finance_ar_open_items_ok_20260423 ✅ 📌  1,099 rows (validation)
    finance_ar_open_items_base_ok ✅ 📌  1,099 rows (baseline)
  SEMANTIC VIEWS (unconfirmable from table list)
    vw_ar_aging_summary                  ❌ Cannot confirm — expected to exist
    vw_ar_customer_risk                  ❌ Cannot confirm
    vw_ar_review_documents               ❌ Cannot confirm
    vw_ar_open_items_detail              ❌ Cannot confirm
    vw_ar_dso                            ❌ NOT CONFIRMED — planned in T022
    vw_collection_efficiency             ❌ NOT CONFIRMED — planned in T023
  KPI OBJECTS (unconfirmable from table list — expected to exist as views or functions)
    mv_kpi_finance_dso_action_list       ❌ Cannot confirm
    kpi_finance_current_snapshot         ❌ Cannot confirm
    kpi_finance_ar_aging_summary         ❌ Cannot confirm
    kpi_finance_customer_risk            ❌ Cannot confirm
  CONFIGURATION
    ar_settings ✅ 📌                    1 row — undocumented AR configuration
    ↓
BUSINESS RULES
  C001  Overdue Receivables Risk         ❌ NOT IMPLEMENTED (C-series all pending)
  C002  DSO Deterioration               ❌ NOT IMPLEMENTED
  C003  Customer Credit Risk            ❌ NOT IMPLEMENTED
  C004  Collection Forecast Risk        ❌ NOT IMPLEMENTED
  C005  Critical Overdue Documents      ❌ NOT IMPLEMENTED
    ↓
KPIs
  AR001  Open Balance
  AR002  Overdue Balance
  AR003  DSO
  AR004  Customer Risk Score
  [+ UNLOCKED: Collection Efficiency (C004) now has data via customer_payments 36K rows]
    ↓
DOCUMENTATION
  docs/business/functional.md           ✅ (partial AR definition)
  docs/business/database.md             ⚠️ MULTIPLE ERRORS:
                                           - Says `finance_ar_open_items_cxc` → real: `finance_ar_open_items`
                                           - Missing: customer_payments, stg_customer_payments_clean,
                                             finance_collections, ar_payment_applications, ar_settings
  docs/business/kpi.md                  ⚠️ AR001–AR004 partially documented
  docs/business/rules-engine.md         ✅ C001–C005 specified but NOT implemented
  docs/sop/sop_ar_intelligence.md       ❌ DOES NOT EXIST — CRITICAL GAP
```

---

## CAPABILITY 5 — EXECUTIVE INTELLIGENCE

```
FRONTEND
  app/page.tsx                           Executive Home — command center
  components/ExecutiveInsightsPanel.tsx  Priority engine decisions
  components/insights/InsightsPanel.jsx  ⚠️ JSX not TSX
  app/insights/page.tsx                  ⚠️ Stub (987 bytes)
    ↓
API
  GET /api/analytics/executive
  GET /api/home-premium
  GET /api/home-executive-summary
  GET /api/business-insights
  GET /api/business-insights/top
    ↓
BACKEND
  routes/businessInsights.js
  routes/analytics.js
  services/analyticsEngine.js → buildExecutiveAnalytics()
    ↓
DATABASE
  SEMANTIC (unconfirmable from table list)
    vw_home_premium                      ❌ Cannot confirm
    vw_home_executive_summary            ❌ Cannot confirm
    vw_business_insights                 ❌ Cannot confirm
    vw_priority_engine                   ❌ Cannot confirm
  TABLES
    insights ✅ 📌                       1,371 rows — LEGACY insight store (undocumented)
    insights_log ✅                       5 rows — CURRENT insight store (documented)
    insight_evolution ✅                  10 rows
    actions_log ✅                        5 rows
    insight_execution_context ✅          1 row
    ⚠️ DUAL INSIGHT STORES: migration from `insights` → `insights_log` appears in progress
    ↓
BUSINESS RULES
  E-Series                               ❌ NOT DEFINED — E-series section is empty
    ↓
KPIs
  EX001  Executive Priority Score        ⚠️ Partially implemented
  EX002  Business Health Score           ❌ NOT built
    ↓
DOCUMENTATION
  docs/business/functional.md           ✅ Business Health Model defined
  docs/business/rules-engine.md         ⚠️ E-series reserved but empty
  docs/business/kpi.md                  ⚠️ EX001 partial, EX002 not specified
  ❌ Missing: Executive SOP
```

---

## CAPABILITY 6 — INSIGHT ENGINE

```
FRONTEND
  app/insights/page.tsx                  ⚠️ Stub — 987 bytes
  components/insights/InsightsPanel.jsx  ⚠️ JSX not TSX
    ↓
API
  GET /api/insights/current
  GET /api/insights/evolution
  GET /api/insights/actions
  POST /api/insights/generate
  POST /api/insights/actions/:id/status
    ↓
BACKEND
  routes/insights.js
    ↓
DATABASE
  FUNCTION
    generate_insights_snapshot()         ❌ Cannot confirm from table list
  TABLES
    insights ✅ 📌                       1,371 rows — LEGACY (undocumented in graph)
    insights_log ✅                       5 rows — CURRENT
    insight_evolution ✅                  10 rows
    actions_log ✅                        5 rows (FK to insights_log; FK missing index ⚠️)
    insight_execution_context ✅          1 row
    data_quality_checks ✅ 📌            1 row — data quality audit (undocumented)
  SOP TABLES (unusual pattern) 📌
    sop_inventory_supply_intelligence ✅ 11 rows — SOP steps as DB rows
    sop_business_pipeline ✅             13 rows — pipeline SOP as DB rows
    ↓
BUSINESS RULES
  [V001–V005 and I001–I005 feed into engine — C-series NOT YET generating]
    ↓
DOCUMENTATION
  docs/business/rules-engine.md         ✅
  docs/business/database.md             ⚠️ Missing: legacy `insights` table, SOP tables,
                                           data_quality_checks
```

---

## CAPABILITY 7 — DQBOT

```
FRONTEND
  app/page.tsx                           DQBot embedded in Executive Home
  components/layout/AssistantPanel.tsx   Side panel
  services/aiService.js → askDQBot()     POST /api/ai/chat-v2
    ↓
API
  POST /api/ai/chat-v2
    Request:  { question, clientId? }
    ⚠️ clientId defaults to 'vonderk' (hardcoded) — SECURITY DEFECT
    Response: { ok, mode, answer, data[], suggestedQuestions[], usage, durationMs }
    ↓
BACKEND
  routes/ai.js                           ⚠️ clientId hardcoded as 'vonderk'
  services/dqbotRouter.js                DQBOT_MODE: heuristic | ai | hybrid
  services/dqbotHeuristicEngine.js
  services/dqbot/intentDetector.js       Uses `unaccent` extension ✅ (INSTALLED)
  services/dqbot/handlers/i003.handler.js  ONLY HANDLER — all others missing
  services/dqbot/fieldCatalog.js
  services/dqbot/formatters.js
  services/aiProvider.js                 OpenAI client
    ↓
DATABASE
  CONSUMED (read-only)
    vw_priority_engine                   ❌ Cannot confirm — fallback data source
  AUDIT
    ai_usage_logs ✅                     21 rows — 21 DQBot calls made (platform IS being used)
  CONVERSATION (not yet built)
    [No conversation_sessions table]
    [No conversation_messages table]
    ↓
BUSINESS RULES
  I003 handler: ✅ IMPLEMENTED          Inventory supply risk queries
  ALL OTHERS:   ❌ NOT IMPLEMENTED      Falls back to top-3 alerts
    ↓
DOCUMENTATION
  docs/architecture/dqbot_architecture.md ✅
  docs/agents/specifications/dqbot-agent.md ✅
  docs/agents/runtime/dqbot-agent.md    ✅
  docs/agents/prompts/                  ❌ EMPTY — zero prompt governance
```

---

## CAPABILITY 8 — AUTHENTICATION & MULTI-TENANCY

```
FRONTEND
  app/login/
  app/account/
  app/account/password/
  app/admin/
  app/admin/users/
    ↓
API
  GET /api/auth/test
  POST /api/auth/bootstrap-admin
  POST /api/auth/login
  PATCH /api/auth/change-password
    ↓
BACKEND
  routes/auth.js                         requireAuth middleware defined in route (not shared)
  bcryptjs                               10 rounds
  jsonwebtoken                           JWT 8h expiry
  JWT_SECRET                             ⚠️ Defaults to 'dev_secret_change_me'
    ↓
DATABASE
  TABLES
    clients ✅                           1 row
    app_users ✅                         1 row (FK to clients — NO COVERING INDEX ⚠️)
    audit_log ✅ 📌                      0 rows — EXISTS but empty
  SECURITY STATUS (CRITICAL) ⚠️
    RLS enabled on ALL 90 tables:        ✅ (flag enabled)
    RLS POLICIES on ANY table:           ❌ ZERO POLICIES EXIST
    ⚠️ CRITICAL: Multi-tenancy is NOT enforced at DB level.
    ⚠️ The Product Knowledge Graph statement "RLS enforces tenant isolation" is FALSE.
    ↓
BUSINESS RULES
  [Auth is platform security — no business rules domain]
  [requireAuth middleware = sole security enforcement mechanism]
    ↓
DOCUMENTATION
  docs/architecture/technology-stack.md ✅
  docs/architecture/project-governance.md ✅
  ⚠️ Critical error: documentation claims RLS enforces isolation — this is false
```

---

## CAPABILITY 9 — PLATFORM SHELL & NAVIGATION

```
FRONTEND
  app/layout.tsx                         Next.js root layout
  app/globals.css
  components/layout/AppShell.tsx
  components/layout/Sidebar.tsx
  components/layout/AssistantPanel.tsx
  components/TopNav.tsx
  components/BrandHeader.tsx
  lib/api.ts → fetchFromApi()            ⚠️ Likely missing auth token injection
    ↓
API
  GET /api/health
    ↓
BACKEND
  routes/health.js
  app.js                                 CORS: origin=http://localhost:3001
    ↓
DATABASE
  [None]
    ↓
DOCUMENTATION
  docs/architecture/technology-stack.md ✅
  docs/architecture/repository-structure.md ✅
```

---

## CAPABILITY 10 — OPERATIONAL PIPELINE

```
FRONTEND
  [No pipeline management UI]
    ↓
API
  POST /api/admin/finance/refresh-snapshots  (token-protected)
  POST /api/insights/generate
    ↓
BACKEND
  routes/finance.js → refresh-snapshots
  routes/insights.js → generate
    ↓
DATABASE
  AUDIT TABLES 📌
    data_pipeline_step_log ✅ 📌         0 rows — EXISTS but NOT INSTRUMENTED
                                         ⚠️ Plan had T014 to CREATE this — it already exists
    data_load_runs ✅ 📌                 0 rows
    data_quality_checks ✅ 📌            1 row
    sync_runs ✅ 📌                      0 rows
  SOP TABLES (machine-readable SOPs) 📌
    sop_business_pipeline ✅ 📌          13 rows — pipeline SOP stored as DB rows
    sop_inventory_supply_intelligence ✅ 11 rows — inventory SOP stored as DB rows
  PIPELINE FUNCTIONS (expected — cannot confirm from table list)
    refresh_stg_sales_clean()            ❌ Cannot confirm
    refresh_stg_sales_lines_clean()      ❌ Cannot confirm
    refresh_stg_inventory_clean()        ❌ Cannot confirm
    refresh_stg_inventory_transactions_clean() ❌ Cannot confirm
    refresh_stg_inbound_shipments_clean() ❌ Cannot confirm
    refresh_stg_ar_open_items_clean()    ✅ CONFIRMED (stg_ar_open_items_clean has 697 rows)
    refresh_stg_items_master_clean()     ❌ Cannot confirm
    refresh_stg_customer_payments_clean() 📌 LIKELY EXISTS (76,531 rows in stg_customer_payments_clean)
    refresh_sales_actuals()              ❌ Cannot confirm
    refresh_open_sales_order_demand()    ❌ Cannot confirm
    refresh_inventory_supply_intelligence() ❌ Cannot confirm
    refresh_finance_snapshots()          ❌ Cannot confirm
    generate_insights_snapshot()         ❌ Cannot confirm
  AUTOMATION
    n8n workflow:                        ❌ NOT IMPLEMENTED
    pg_cron extension:                   ✅ AVAILABLE (not installed) 📌
                                         Alternative to n8n — enables in-DB scheduling
    ↓
DOCUMENTATION
  docs/business/database.md             ✅ Sections 13–14
  ⚠️ Missing: data_pipeline_step_log documentation
  ⚠️ T014 incorrectly planned (table already exists)
```

---

## CAPABILITY 11 — CONFIGURATION ENGINE

```
FRONTEND
  [No configuration UI]
    ↓
API
  [No configuration API endpoints]
    ↓
BACKEND
  [Configuration read directly by SQL views and rules engine]
  DQBOT_MODE env var — configures DQBot mode
  AI_MODEL env var — configures AI model
  ADMIN_REFRESH_TOKEN env var
    ↓
DATABASE
  IMPLEMENTED TABLES (all verified ✅)
    sales_settings ✅                    1 row — commercial targets, tolerance, currency
    ar_settings ✅ 📌                    1 row — AR thresholds (UNDOCUMENTED)
    inventory_settings ✅ 📌             1 row — inventory parameters (UNDOCUMENTED)
    inventory_category_settings ✅ 📌    0 rows — per-category settings (UNDOCUMENTED)
    alert_config ✅ 📌                   3 rows — alert thresholds (UNDOCUMENTED)
    client_config ✅ 📌                  1 row — client-level overrides (UNDOCUMENTED)
    business_rules ✅                    15 rows — rule catalog
    business_rule_thresholds ✅ 📌       15 rows — threshold values
                                         ⚠️ Plan called this `rule_thresholds` — actual name different
                                         ⚠️ Plan T106 was to CREATE this — it already EXISTS
    insight_execution_context ✅         1 row
    business_review_rules ✅             0 rows
    industry_profiles ✅ 📌              4 rows (plan said "planned" — already EXISTS)
    customer_segments ✅ 📌              0 rows (prepared for segmentation)
    product_catalog ✅ 📌               11 rows (undocumented product catalog)
    sales_exclusion_rules ✅ 📌          3 rows (sales scope rules)
    financial_currency_field_catalog ✅ 📌  0 rows (FX field mapping)
    ↓
DOCUMENTATION
  docs/business/database.md             ⚠️ SIGNIFICANTLY INCOMPLETE:
                                           - Misnames `business_rule_thresholds` as `rule_thresholds`
                                           - Missing: ar_settings, inventory_settings,
                                             alert_config, client_config, industry_profiles,
                                             customer_segments, sales_exclusion_rules
```

---

## CAPABILITY 12 — DOCUMENTATION GOVERNANCE

```
DOCUMENTATION SSOT
  docs/README.md                         ✅
  docs/documentation-index.md            ✅ (canonical reading order)
  docs/AGENTS.md                         ✅ (AI operating contract)
  docs/business/functional.md            ✅
  docs/business/database.md              ⚠️ MULTIPLE ERRORS — see D001-D011
  docs/business/kpi.md                   ⚠️ Partial (AR, Executive incomplete)
  docs/business/rules-engine.md          ⚠️ C-series not implemented; E-series empty
  docs/business/api.md                   ⚠️ May not reflect all current endpoints
  docs/architecture/technology-stack.md  ✅
  docs/architecture/dqbot_architecture.md ⚠️ Filename inconsistency (underscore vs dash)
  docs/architecture/repository-structure.md ✅
  docs/architecture/migration-plan.md    ✅
  docs/architecture/project-governance.md ✅ (but RLS claim is incorrect)
  docs/operating-model/*                 ✅
  docs/agents/specifications/ (×10)      ✅
  docs/agents/runtime/ (×10)             ✅
  docs/agents/prompts/                   ❌ EMPTY
  docs/agents/platform/                  ❌ EMPTY
  docs/sop/sop_sales_intelligence.md     ✅ v2.0 complete
  docs/sop/sop_inventory_supply_intelligence.md ✅
  docs/sop/sop_ar_intelligence.md        ❌ DOES NOT EXIST

GOVERNANCE RULES (from AGENTS.md)
  R001–R010                              ✅ Defined
  ⚠️ R001 violated: api.md may not reflect current endpoints
  ⚠️ R004 violated: database.md missing 27+ confirmed objects
  ⚠️ R009 violated: Implementation ahead of documentation in multiple areas
```

---

## DATABASE EXTENSIONS INSTALLED

| Extension | Status | Version | Platform Use |
|-----------|--------|---------|-------------|
| `plpgsql` | ✅ INSTALLED | 1.0 | All stored procedures |
| `unaccent` | ✅ INSTALLED | 1.1 | DQBot intentDetector accent-stripping |
| `pg_stat_statements` | ✅ INSTALLED | 1.11 | Query performance monitoring |
| `uuid-ossp` | ✅ INSTALLED | 1.1 | UUID generation |
| `pgcrypto` | ✅ INSTALLED | 1.3 | bcrypt password hashing |
| `supabase_vault` | ✅ INSTALLED | 0.3.1 | Secrets management |
| `pg_cron` | ❌ NOT INSTALLED | 1.6.4 | AVAILABLE — pipeline scheduling |
| `vector` | ❌ NOT INSTALLED | 0.8.0 | AVAILABLE — pgvector semantic search |
| `pgtap` | ❌ NOT INSTALLED | 1.3.3 | AVAILABLE — DB unit testing |
| `pg_trgm` | ❌ NOT INSTALLED | 1.6 | AVAILABLE — improved text similarity |

---

## LIVE DATABASE STATISTICS

| Metric | Value |
|--------|-------|
| Project | erp-intelligence-foundation |
| Project ID | ndruztnrxzcyyihafmtf |
| ERP System | **NetSuite** |
| PostgreSQL | 17.6.1 |
| Region | us-west-2 |
| Status | ACTIVE_HEALTHY |
| Total tables | 90 |
| Documented tables | ~63 |
| Undocumented tables | ~27 |
| Tables with data | 60 |
| Total approximate rows | ~820,000+ |
| Core tables without PK | 47 (including sales, sales_lines, inventory) |
| Tables with RLS enabled | 90 (100%) |
| RLS policies defined | **0 (0%)** — CRITICAL |
| Unindexed foreign keys | 2 |
| Unused indexes | 5 |
| Backup/temp tables | 14 |
| Active clients | 1 |
| Active users | 1 |
| DQBot calls logged | 21 |
| Installed extensions | 6 |

---

## CROSS-CAPABILITY DEPENDENCY MAP (VERIFIED)

```
                   ┌──────────────────────────────────┐
                   │  CONFIGURATION ENGINE (11)        │
                   │  sales_settings ✅ · ar_settings ✅📌│
                   │  inventory_settings ✅📌            │
                   │  business_rules ✅ (15 rows)       │
                   │  business_rule_thresholds ✅📌 (15) │
                   │  alert_config ✅📌 · client_config ✅📌│
                   └──────────────┬───────────────────┘
                                  │ parameterizes
        ┌─────────────────────────▼──────────────────────────┐
        │              OPERATIONAL PIPELINE (10)              │
        │  ERP(NetSuite) → RAW → STG → Business → Semantic   │
        │  → KPI → Rules → Insights → Priority               │
        │  data_pipeline_step_log ✅📌 (empty — not armed)    │
        │  sop_business_pipeline ✅📌 (13 rows — machine SOP) │
        └──┬──────┬──────┬──────┬───────────────────────────┘
           │      │      │      │
  ┌────────▼─┐ ┌──▼────┐ ┌─▼──┐ ┌▼──────────────────────────┐
  │SALES (1) │ │INV (2)│ │SUP │ │   AR INTELLIGENCE (4)      │
  │sales ✅  │ │inv ✅  │ │(3) │ │   customer_payments ✅📌   │
  │48K sem.✅│ │supply │ │no  │ │   stg_ar_clean ✅ (DONE)   │
  │         │ │snap ✅📌│ │API │ │   C-series ❌ not running   │
  └────┬─────┘ └──┬────┘ └─┬──┘ └────────────┬──────────────┘
       │          │        │                   │
       └──────────┴────────┴───────────────────┘
                           │ feeds
                  ┌────────▼──────────────────┐
                  │  INSIGHT ENGINE (6)         │
                  │  insights ✅📌 (1,371 legacy)│
                  │  insights_log ✅ (5 current)│  ← DUAL STORES ⚠️
                  │  insight_evolution ✅ (10)  │
                  │  actions_log ✅ (5)         │
                  └────────┬──────────────────┘
                           │ feeds
                  ┌────────▼──────────────────┐
                  │  EXECUTIVE INTELLIGENCE (5) │
                  │  vw_priority_engine ❌?     │
                  │  E-series ❌ not defined    │
                  └────┬──────────────┬────────┘
                       │              │
            ┌──────────▼──┐   ┌───────▼──────────┐
            │  DQBOT (7)   │   │ DASHBOARDS (1-5)  │
            │  21 calls ✅  │   │ app/*.tsx         │
            │  1 handler   │   │                   │
            │  hardcoded   │   │                   │
            │  clientId ⚠️ │   │                   │
            └─────────────┘   └───────────────────┘
                       │              │
                  ┌────▼──────────────▼──────┐
                  │   PLATFORM SHELL (9)      │
                  │   AppShell · Sidebar      │
                  └──────────────────────────┘
                       │
                  ┌────▼────────────────────────┐
                  │  AUTH & TENANCY (8)          │
                  │  clients ✅ (1)              │
                  │  app_users ✅ (1)            │
                  │  RLS enabled ✅              │
                  │  RLS policies: ZERO ❌ CRITICAL│
                  └─────────────────────────────┘
```
