# Database Ground Truth Report
**Source:** Supabase MCP live inspection — Project `ndruztnrxzcyyihafmtf` (erp-intelligence-foundation)
**Date:** 2026-07-03 | Mode: READ ONLY
**PostgreSQL:** 17.6.1 | Region: us-west-2 | Status: ACTIVE_HEALTHY | Created: 2026-03-24

> This report contains ground truth from the live Supabase instance.
> All discrepancies are relative to the Product Knowledge Graph (product_graph.md).
> The Product Knowledge Graph must be enriched with these findings.

---

## SECTION 1 — COMPLETE TABLE INVENTORY (Live)

**Total tables found: 90** (across all layers)

### Layer: RAW (ERP Source)
| Table | Rows | In Graph? | Notes |
|-------|-----:|:---------:|-------|
| `raw_sales` | 15,915 | ✅ | Confirmed |
| `raw_sales_lines` | 56,967 | ✅ | Confirmed |
| `raw_open_sales_orders` | 341 | ✅ | Confirmed |
| `raw_inventory` | 8,195 | ✅ | Confirmed |
| `raw_inventory_transactions` | 103,078 | ✅ | Confirmed |
| `raw_item_bom` | 3,587 | ✅ | Confirmed |
| `raw_inbound_shipments` | 179 | ✅ | Confirmed |
| `raw_ar_open_items` | 697 | ✅ | Confirmed |
| `raw_items_master` | 32,895 | ❌ | NOT in graph — raw items master |
| `raw_customers` | 727 | ❌ | NOT in graph — raw customers |
| `raw_netsuite_customers` | 5 | ❌ | NOT in graph — **reveals ERP = NetSuite** |
| `raw_customer_payments` | 76,531 | ❌ | NOT in graph — **full payments domain exists** |
| `raw_collections` | 0 | ❌ | NOT in graph — collections domain prepared |
| `raw_invoices` | 0 | ❌ | NOT in graph — alternate invoice source |
| `raw_sales_orders` | 0 | ❌ | NOT in graph — separate from open_sales_orders |
| `raw_fx_rates` | 0 | ❌ | NOT in graph — FX rate support prepared |
| `raw_items` | 0 | ❌ | NOT in graph — alternate items source |
| `raw_subsidiaries` | 9 | ❌ | NOT in graph — subsidiary master |
| `raw_locations` | 17 | ❌ | NOT in graph — location master |

### Layer: STG (Staging / Normalized)
| Table | Rows | In Graph? | Notes |
|-------|-----:|:---------:|-------|
| `stg_sales_clean` | 15,913 | ✅ | Confirmed |
| `stg_sales_lines_clean` | 56,965 | ✅ | Confirmed |
| `stg_inventory_clean` | 8,195 | ✅ | Confirmed |
| `stg_inventory_transactions_clean` | 103,078 | ✅ | Confirmed |
| `stg_inbound_shipments_clean` | 179 | ✅ | Confirmed |
| `stg_items_master_clean` | 32,895 | ✅ | Confirmed |
| `stg_ar_open_items_clean` | 697 | ⚠️ | **PLAN MISMATCH: Graph/Plan said "not implemented" (T019). LIVE with 697 rows. T019 is ALREADY DONE.** |
| `stg_customer_payments_clean` | 76,531 | ❌ | NOT in graph — customer payments STG layer exists |
| `stg_customers_clean` | 727 | ❌ | NOT in graph — customers STG layer exists |

### Layer: BUSINESS (Consolidated)
| Table | Rows | In Graph? | Notes |
|-------|-----:|:---------:|-------|
| `sales` | 15,229 | ✅ | Confirmed |
| `sales_lines` | 54,232 | ✅ | Confirmed |
| `sales_semantic_current` | 48,605 | ❌ | NOT in graph — **large materialized semantic table** |
| `open_sales_order_demand` | 341 | ✅ | Confirmed |
| `inventory` | 8,040 | ✅ | Confirmed (graph uses this layer) |
| `inventory_stock` | 7,853 | ❌ | NOT in graph — processed stock position |
| `inventory_movements` | 97,941 | ❌ | NOT in graph — processed movements |
| `inventory_supply_semantic_current` | 2,510 | ✅ | Confirmed |
| `inventory_bom_capacity_current` | 298 | ✅ | Confirmed |
| `inventory_supply_snapshot_daily` | 5,008 | ❌ | NOT in graph — daily supply snapshot history |
| `inbound_shipments` | 251 | ❌ | NOT in graph — processed inbound (>raw: 179→251) |
| `item_bom` | 3,548 | ❌ | NOT in graph — processed BOM (from raw_item_bom) |
| `item_bom_resolved` | 3,556 | ❌ | NOT in graph — BOM resolution table |
| `item_lookup_normalized` | 4,505 | ❌ | NOT in graph — item master normalization |
| `item_alias_map` | 52 | ❌ | NOT in graph — item alias/SKU mapping |
| `items_master` | 4,539 | ❌ | NOT in graph — processed item master |
| `items_master_override` | 2 | ❌ | NOT in graph — manual item overrides |
| `customers` | 727 | ❌ | NOT in graph — processed customer master |
| `customer_payments` | 36,798 | ❌ | NOT in graph — **payments domain exists, ~37K records** |
| `finance_ar_open_items` | 1,061 | ⚠️ | Graph calls this `finance_ar_open_items_cxc`. Actual name: `finance_ar_open_items`. 1,061 rows. |
| `finance_ar_invoices` | 0 | ❌ | NOT in graph — invoice reconciliation table (empty) |
| `finance_collections` | 0 | ❌ | NOT in graph — collections table (empty) |
| `finance_ar_snapshot_daily` | 2 | ✅ | Confirmed |
| `finance_customer_risk_snapshot` | 683 | ✅ | Confirmed |
| `ar_payment_applications` | 0 | ❌ | NOT in graph — payment application table (empty) |
| `customer_daily_snapshot` | 1 | ❌ | NOT in graph — customer daily snapshot |
| `sales_forecast_monthly` | 12 | ❌ | NOT in graph as a TABLE (graph treats forecast as a KPI object/view) |
| `product_catalog` | 11 | ❌ | NOT in graph — product catalog |
| `sync_runs` | 0 | ❌ | NOT in graph — ERP sync audit table |
| `data_load_runs` | 0 | ❌ | NOT in graph — data load audit |

### Layer: PIPELINE AUDIT
| Table | Rows | In Graph? | Notes |
|-------|-----:|:---------:|-------|
| `data_pipeline_step_log` | 0 | ❌ | NOT in graph — **but functionally equivalent to T014 (pipeline_run_log)**. T014 may already be partially satisfied. |
| `data_quality_checks` | 1 | ❌ | NOT in graph — data quality audit table |

### Layer: INSIGHT ENGINE
| Table | Rows | In Graph? | Notes |
|-------|-----:|:---------:|-------|
| `insights` | 1,371 | ⚠️ | NOT as documented — graph only mentions `insights_log`. `insights` table exists separately with 1,371 rows. **Two insight stores.** |
| `insights_log` | 5 | ✅ | Confirmed — new format, 5 rows |
| `insight_evolution` | 10 | ✅ | Confirmed |
| `actions_log` | 5 | ✅ | Confirmed |
| `insight_execution_context` | 1 | ✅ | Confirmed |

### Layer: AI / DQBOT
| Table | Rows | In Graph? | Notes |
|-------|-----:|:---------:|-------|
| `ai_usage_logs` | 21 | ✅ | Confirmed — 21 DQBot calls logged |

### Layer: CONFIGURATION
| Table | Rows | In Graph? | Notes |
|-------|-----:|:---------:|-------|
| `sales_settings` | 1 | ✅ | Confirmed |
| `ar_settings` | 1 | ❌ | NOT in graph — AR-specific settings (equivalent to `sales_settings` for finance) |
| `inventory_settings` | 1 | ❌ | NOT in graph — Inventory-specific settings |
| `inventory_category_settings` | 0 | ❌ | NOT in graph — Per-category inventory settings |
| `alert_config` | 3 | ❌ | NOT in graph — Alert configuration |
| `client_config` | 1 | ❌ | NOT in graph — Client-level configuration |
| `business_rules` | 15 | ✅ | Confirmed — 15 rules configured |
| `business_rule_thresholds` | 15 | ⚠️ | **PLAN MISMATCH: T106 planned to create this. LIVE with 15 rows. T106 is ALREADY DONE.** (Graph says "rule_thresholds" but actual name is `business_rule_thresholds`) |
| `business_review_rules` | 0 | ✅ | Confirmed |
| `sales_exclusion_rules` | 3 | ❌ | NOT in graph — Sales exclusion rules |
| `financial_currency_field_catalog` | 0 | ❌ | NOT in graph — Currency field catalog |
| `industry_profiles` | 4 | ⚠️ | Graph said "planned" — LIVE with 4 rows |
| `customer_segments` | 0 | ❌ | NOT in graph — Customer segmentation table |
| `product_catalog` | 11 | ❌ | NOT in graph — Product catalog |

### Layer: AUTH & TENANCY
| Table | Rows | In Graph? | Notes |
|-------|-----:|:---------:|-------|
| `clients` | 1 | ✅ | Confirmed — 1 client active |
| `app_users` | 1 | ✅ | Confirmed — 1 user |
| `audit_log` | 0 | ⚠️ | Graph said "planned" — table EXISTS but empty. Auth audit log is created, not yet populated. |

### Layer: SOP (Unusual — SOPs stored as tables)
| Table | Rows | Notes |
|-------|-----:|-------|
| `sop_inventory_supply_intelligence` | 11 | SOPs stored as database table rows — architectural anomaly |
| `sop_business_pipeline` | 13 | SOPs stored as database table rows — architectural anomaly |

### Layer: BACKUP / TECHNICAL DEBT
| Table | Rows | Notes |
|-------|-----:|-------|
| `sales_bak_20260423` | 13,695 | Backup table — 2026-04-23 |
| `sales_lines_bak_20260423` | 48,540 | Backup table |
| `raw_sales_bak_20260423` | 13,695 | Backup table |
| `raw_sales_lines_bak_20260423` | 48,540 | Backup table |
| `sales_ok_20260423` | 13,762 | Validation snapshot |
| `sales_lines_ok_20260423` | 48,754 | Validation snapshot |
| `finance_ar_open_items_ok_20260423` | 1,099 | Validation snapshot |
| `sales_base_ok` | 13,762 | Validation baseline |
| `sales_lines_base_ok` | 48,754 | Validation baseline |
| `finance_ar_open_items_base_ok` | 1,099 | Validation baseline |
| `sales_scope_ar_ok` | 13,689 | Scoped validation |
| `kpi_finance_current_snapshot_ok` | 1 | KPI validation snapshot |
| `kpi_finance_ar_aging_summary_ok` | 6 | KPI validation snapshot |
| `tmp_subsidiaries` | 9 | Temporary table in production schema |

---

## SECTION 2 — INSTALLED EXTENSIONS (Live)

| Extension | Version | Status | Relevance |
|-----------|---------|--------|----------|
| `plpgsql` | 1.0 | ✅ INSTALLED | All stored procedures |
| `unaccent` | 1.1 | ✅ INSTALLED | **DQBot uses this** — accent-stripping for Spanish keyword detection |
| `pg_stat_statements` | 1.11 | ✅ INSTALLED | Query performance monitoring available |
| `uuid-ossp` | 1.1 | ✅ INSTALLED | UUID generation for insight IDs |
| `pgcrypto` | 1.3 | ✅ INSTALLED | Cryptographic functions (bcrypt support) |
| `supabase_vault` | 0.3.1 | ✅ INSTALLED | Secrets management available |
| `pg_cron` | 1.6.4 | ❌ NOT INSTALLED | **Critical gap: Pipeline automation scheduler available but not enabled** |
| `vector` | 0.8.0 | ❌ NOT INSTALLED | pgvector available for semantic search — not yet enabled |
| `pgtap` | 1.3.3 | ❌ NOT INSTALLED | Database unit testing framework available |
| `pg_trgm` | 1.6 | ❌ NOT INSTALLED | Trigram similarity for improved text search |

---

## SECTION 3 — SECURITY ADVISORS (Live)

**Finding type:** `rls_enabled_no_policy` — RLS is enabled on all tables but **zero tables have RLS policies defined**.

| Severity | Count | Meaning |
|---------|------:|--------|
| INFO | 90 | All 90 tables have RLS enabled but NO row-level policies |

**Critical implication:** RLS is enabled as a flag but provides zero security protection because no policies exist. Any authenticated user can access any row in any table. The multi-tenancy claim (Row Level Security enforces tenant isolation) in the Product Knowledge Graph is **incorrect** — RLS is present structurally but not functionally implemented.

This is the **most critical security finding** from the live inspection. It means:
- Client isolation is not enforced at the database level
- The JWT `client_id` is not being used in any RLS policy
- If Supabase direct access were ever exposed, all client data would be visible to all users

---

## SECTION 4 — PERFORMANCE ADVISORS (Live)

### Unindexed Foreign Keys
| Table | Foreign Key | Impact |
|-------|------------|--------|
| `actions_log` | `actions_log_insight_id_fkey` | Joins to insights_log without index |
| `app_users` | `app_users_client_id_fkey` | Auth queries scan app_users without index |

### Tables Without Primary Keys (Critical for scale — 47 tables)
Highest-impact tables missing primary keys:
| Table | Rows | Business Impact |
|-------|-----:|----------------|
| `sales` | 15,229 | **Core business table — no PK** |
| `sales_lines` | 54,232 | **Core business table — no PK** |
| `raw_sales` | 15,915 | RAW layer — no PK |
| `raw_sales_lines` | 56,967 | RAW layer — no PK |
| `inventory` | 8,040 | Core business table — no PK |
| `inventory_supply_semantic_current` | 2,510 | Materialized semantic — no PK |
| `sales_semantic_current` | 48,605 | Large materialized table — no PK |
| `finance_ar_open_items` | 1,061 | AR business layer — no PK |
| `stg_ar_open_items_clean` | 697 | STG layer — no PK |
| `raw_ar_open_items` | 697 | RAW layer — no PK |
| `customer_payments` | 36,798 | Payments business layer — no PK |
| `raw_customer_payments` | 76,531 | RAW payments — no PK |
| `open_sales_order_demand` | 341 | Pipeline demand — no PK |
| `inventory_bom_capacity_current` | 298 | BOM capacity — no PK |
| `item_bom_resolved` | 3,556 | BOM resolution — no PK |

### Unused Indexes
| Index | Table | Action |
|-------|-------|--------|
| `insight_evolution_key_date_idx` | `insight_evolution` | Never used — candidate for removal |
| `finance_ar_invoices_due_date_idx` | `finance_ar_invoices` | Never used — table is empty |
| `finance_collections_payment_date_idx` | `finance_collections` | Never used — table is empty |
| `idx_item_lookup_sku` | `item_lookup_normalized` | Never used |
| `idx_item_lookup_name` | `item_lookup_normalized` | Never used |

---

## SECTION 5 — CRITICAL DISCREPANCIES vs. PRODUCT KNOWLEDGE GRAPH

### Tasks Already Completed (Master Execution Plan must be updated)

| Plan Task | Status in Plan | Live Reality |
|-----------|---------------|-------------|
| T019: Create `stg_ar_open_items_clean` | PLANNED | ✅ **EXISTS — 697 rows. DONE.** |
| T020: Create `refresh_stg_ar_open_items_clean()` | PLANNED | ✅ **Likely EXISTS (table is populated)** |
| T106: Create `rule_thresholds` table | PLANNED | ✅ **EXISTS as `business_rule_thresholds` — 15 rows. DONE.** |
| T014: Create `pipeline_run_log` | PLANNED | ⚠️ **`data_pipeline_step_log` EXISTS (0 rows) — may partially satisfy this** |

### Entire Domain Not in Graph: CUSTOMER PAYMENTS
| Table | Rows |
|-------|-----:|
| `raw_customer_payments` | 76,531 |
| `stg_customer_payments_clean` | 76,531 |
| `customer_payments` | 36,798 |

**Implication:** A complete Customer Payments domain exists (RAW → STG → Business), fully populated, not documented anywhere in the Product Knowledge Graph. This likely feeds into AR collection efficiency calculations. C-series rules may already have partial data infrastructure.

### ERP Identity Confirmed: NetSuite
`raw_netsuite_customers` table confirms the ERP system is **NetSuite**. This was not explicitly stated in the Product Knowledge Graph.

### Two Insight Stores (Not One)
| Table | Rows | Notes |
|-------|-----:|-------|
| `insights` | 1,371 | Old/legacy insight store |
| `insights_log` | 5 | New insight store (documented in graph) |

The legacy `insights` table has 1,371 rows and is not documented in the graph. This may be the data source for current frontend insight displays. Architecture migration from `insights` → `insights_log` may be in progress.

### Graph Naming Mismatch: AR Business Layer
| Graph Name | Actual Name | Rows |
|-----------|-------------|-----:|
| `finance_ar_open_items_cxc` | `finance_ar_open_items` | 1,061 |

### Configuration Richer Than Graph Shows
The graph documented 5 configuration tables. Live shows 11+ configuration tables including:
- `ar_settings` (1 row) — AR-specific thresholds
- `inventory_settings` (1 row) — Inventory-specific thresholds
- `inventory_category_settings` (0 rows) — Category-level inventory settings
- `alert_config` (3 rows) — Alert configuration
- `client_config` (1 row) — Client-level overrides

### SOPs Stored as Database Tables
Two SOP documents are stored as database table rows — an unusual architectural pattern:
- `sop_inventory_supply_intelligence` — 11 rows
- `sop_business_pipeline` — 13 rows

This suggests these SOPs are machine-readable procedure definitions, not just documentation.

### pg_cron Available but Not Installed
`pg_cron` is available in the Supabase environment but not installed. Enabling it would allow pipeline automation directly in PostgreSQL without n8n. This is a simpler alternative to the n8n approach for T016.

---

## SECTION 6 — PRODUCT KNOWLEDGE GRAPH ENRICHMENTS REQUIRED

The following corrections and additions must be applied to `product_graph.md`:

### Corrections
1. **AR Intelligence Capability 4:** `finance_ar_open_items_cxc` → `finance_ar_open_items`
2. **Capability 8 (Auth):** Remove "RLS policies enforce tenant isolation" — RLS IS ENABLED but NO POLICIES EXIST. This is a critical security gap, not a feature.
3. **Configuration Capability 11:** `rule_thresholds` → `business_rule_thresholds`. Table exists with 15 rows.
4. **Execution Plan T019, T106:** Mark as already completed.

### Additions
5. **New domain: CUSTOMER PAYMENTS** — `raw_customer_payments` (76K) → `stg_customer_payments_clean` (76K) → `customer_payments` (37K) — Complete pipeline, not documented anywhere.
6. **New tables:** `ar_settings`, `inventory_settings`, `inventory_category_settings`, `alert_config`, `client_config` — Configuration layer is richer than documented.
7. **New tables:** `sales_semantic_current` (48K rows materialized), `inventory_supply_snapshot_daily` (5K rows), `customer_daily_snapshot` — Snapshot layer exists.
8. **New tables:** `item_bom`, `item_bom_resolved`, `item_lookup_normalized`, `item_alias_map` — Item master resolution layer exists.
9. **Dual insight stores:** `insights` (1,371 rows, legacy) + `insights_log` (5 rows, current). Migration is in progress.
10. **ERP identity:** NetSuite (confirmed by `raw_netsuite_customers`).
11. **Extension opportunity:** `pg_cron` available — could replace n8n for pipeline scheduling.
12. **Extension opportunity:** `vector` (pgvector) available — could enable semantic search for DQBot.
13. **Technical debt:** 14 backup/validation tables in production schema — require cleanup.
14. **Security gap:** 90 tables with RLS enabled but zero RLS policies — multi-tenancy not enforced at DB level.
15. **Performance gap:** 47 tables without primary keys including core business tables (`sales`, `sales_lines`, `inventory`).

---

## SECTION 7 — LIVE DATABASE STATISTICS

| Metric | Value |
|--------|-------|
| Total tables | 90 |
| Tables with data (rows > 0) | 60 |
| Tables with 0 rows | 30 |
| Total approx. rows | ~820,000+ |
| Largest table | `raw_customer_payments` (76,531) |
| Tables with RLS enabled | 90 (100%) |
| Tables with RLS policies | 0 (0%) |
| Tables without primary key | 47 |
| Installed extensions | 6 |
| Available but unused extensions | 70+ |
| Backup/temp tables | 14 |
| AI DQBot calls logged | 21 |
| Active clients | 1 |
| Active users | 1 |
| ERP system | NetSuite |
