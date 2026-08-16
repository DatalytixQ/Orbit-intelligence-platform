# N002 Table Classification

**Task:** N002 — RLS policies for domain tables
**Wave:** 0C — Discovery & Security Classification
**Date:** 2026-07-10
**Source:** n002_security_architecture.md (live Supabase evidence)

---

## Classification Criteria

| Category | Definition | RLS Strategy | Schema Change? |
|----------|-----------|-------------|:--------------:|
| **A** | Has `client_id` — ready for RLS | `client_id = JWT.client_id` policy | NO |
| **B** | No `client_id` — requires schema evolution | Deferred until `ALTER TABLE ADD COLUMN` | YES |
| **C** | Reference / shared data — no tenant isolation | Exempt or public-read | NO |
| **D** | System / internal / backup / temporary | Backend-only or archive | NO |

---

## Category A — Has `client_id`, Ready for RLS (27 business tables)

These tables have a `client_id` column (type `text` unless noted), RLS already enabled, and zero policies. They can receive standard tenant-isolation policies immediately.

| # | Table | Rows | client_id Type | PK | Why Category A |
|---|-------|-----:|:---------:|-----|---------------|
| A1 | `sales` | 15,229 | text | — | Core sales header. Queried by sales.js, analytics.js. Direct client_id. |
| A2 | `sales_lines` | 54,232 | text | — | Sales line items. Queried by sales.js. High-volume. Direct client_id. |
| A3 | `finance_ar_open_items` | 1,061 | text | — | AR receivables. Used by finance.js via views. Direct client_id. |
| A4 | `customer_payments` | 36,798 | text | — | Payment records. Used by views. Direct client_id. |
| A5 | `insights` | 1,371 | text | id | Business insights. Queried by insights.js, businessInsights.js. Direct client_id. |
| A6 | `inventory_stock` | 7,853 | text | — | Stock levels. Used by inventory views. Direct client_id. |
| A7 | `items_master` | 4,539 | text | item_id | Product catalog. Used by 8+ views. Direct client_id. |
| A8 | `inventory_movements` | 97,941 | text | — | Inventory transactions. Highest volume table. Direct client_id. |
| A9 | `inbound_shipments` | 251 | text | — | Purchase orders in transit. Direct client_id. |
| A10 | `item_bom` | 3,548 | text | composite | Bill of materials. Direct client_id. |
| A11 | `item_bom_resolved` | 3,556 | text | — | Flattened BOM. Direct client_id. |
| A12 | `open_sales_order_demand` | 341 | text | — | Open order pipeline. Written by `refresh_open_sales_order_demand`. Direct client_id. |
| A13 | `item_alias_map` | 52 | text | — | Item name aliases. Direct client_id. |
| A14 | `insight_execution_context` | 1 | text | id | Insight engine state. Direct client_id. |
| A15 | `ai_usage_logs` | 21 | **uuid** ⚠️ | id | AI/DQBot usage. **Requires cast**: `client_id::text`. Written by ai.js. |
| A16 | `audit_log` | 0 | text | id | Change audit trail. Direct client_id. |
| A17 | `alert_config` | 3 | text | id | Alert settings per client. Direct client_id. |
| A18 | `business_review_rules` | 0 | text | rule_id | Client-specific business rules. Direct client_id. |
| A19 | `business_rule_thresholds` | 15 | text | id | Client-specific thresholds. Direct client_id. |
| A20 | `customer_segments` | 0 | text | id | Client-specific customer segments. Direct client_id. |
| A21 | `data_load_runs` | 0 | text | id | ETL run tracking per client. Direct client_id. |
| A22 | `inventory_category_settings` | 0 | text | id | Inventory config per client. Direct client_id. |
| A23 | `sync_runs` | 0 | text | id | Sync tracking per client. Direct client_id. |
| A24 | `ar_settings` | 1 | text | client_id (PK) | AR config. PK is client_id. |
| A25 | `client_config` | 1 | text | client_id (PK) | Client config. PK is client_id. |
| A26 | `inventory_settings` | 1 | text | client_id (PK) | Inventory config. PK is client_id. |
| A27 | `sales_settings` | 1 | text | client_id (PK) | Sales config. PK is client_id. |

**Total: 27 tables → 108 policies (4 per table: SELECT/INSERT/UPDATE/DELETE)**

---

## Category B — No `client_id`, Requires Schema Evolution (17 tables)

These tables contain tenant-specific data but lack a `client_id` column. They cannot receive RLS policies until the column is added and backfilled. Currently single-tenant (all data belongs to `vonderk`).

| # | Table | Rows | PK | Why No client_id | Proposed Resolution |
|---|-------|-----:|-----|-----------------|-------------------|
| B1 | `inventory` | 8,040 | — | ETL pipeline doesn't propagate client_id to this aggregation table | ADD `client_id text`, backfill `'vonderk'`, update ETL |
| B2 | `insights_log` | 5 | id | `generate_insights_snapshot` function doesn't set client_id | ADD column, update function |
| B3 | `actions_log` | 5 | id | Written by `generate_insights_snapshot` without client_id. Has FK to `insights` (which HAS client_id) | ADD column, update function |
| B4 | `insight_evolution` | 10 | id | Written by `generate_insights_snapshot` without client_id | ADD column, update function |
| B5 | `customers` | 727 | — | Cleaned customer master — ETL gap | ADD column, backfill from raw_customers |
| B6 | `finance_customer_risk_snapshot` | 683 | composite | Written by `refresh_finance_snapshots` | ADD column, update function |
| B7 | `finance_ar_snapshot_daily` | 2 | snapshot_date | Written by `refresh_finance_snapshots` | ADD column, update function |
| B8 | `customer_daily_snapshot` | 1 | snapshot_date | Daily aggregate without tenant scope | ADD column |
| B9 | `sales_semantic_current` | 48,605 | — | Semantic layer cache — no tenant scope | ADD column, update ETL |
| B10 | `inventory_bom_capacity_current` | 298 | — | Written by `refresh_inventory_supply_intelligence` | ADD column, update function |
| B11 | `inventory_supply_semantic_current` | 2,510 | — | Written by `refresh_inventory_supply_intelligence` | ADD column, update function |
| B12 | `inventory_supply_snapshot_daily` | 5,008 | — | Written by refresh functions | ADD column, update function |
| B13 | `item_lookup_normalized` | 4,505 | — | Normalized lookup cache | ADD column |
| B14 | `items_master_override` | 2 | item_id | Manual overrides table | ADD column |
| B15 | `sales_forecast_monthly` | 12 | id | Forecasting data | ADD column |
| B16 | `stg_customers_clean` | 727 | — | Staging table — ETL gap | ADD column |
| B17 | `ar_payment_applications` | 0 | — | Empty — payment applications | ADD column |

**Total: 17 tables → Requires separate schema migration wave (ALTER TABLE + backfill + function updates)**

---

## Category C — Reference / Shared Data, No Tenant Isolation (5 tables)

These tables contain system-wide reference data that is NOT tenant-specific. They should be readable by all tenants or accessible only by the backend.

| # | Table | Rows | PK | Why Category C |
|---|-------|-----:|-----|---------------|
| C1 | `business_rules` | 15 | rule_id | Global rule definitions shared across all tenants. Not client-specific (note: `business_rule_thresholds` IS client-specific and is in Cat A). |
| C2 | `industry_profiles` | 4 | industry_type | Industry benchmark data — shared reference for all clients. |
| C3 | `product_catalog` | 11 | object_name | Platform metadata — describes database objects. Internal only. |
| C4 | `financial_currency_field_catalog` | 0 | catalog_id | Currency field mapping — system reference. |
| C5 | `sales_exclusion_rules` | 3 | invoice_internal_id | Invoice exclusion list used by `refresh_stg_sales_clean`. Backend-only. |

**Strategy:** These tables will NOT receive tenant-based policies. Options:
- **Exempt from RLS** — keep RLS enabled (already is) with no policies → blocks anon/authenticated access by default (restrictive)
- **Public-read policy** — `CREATE POLICY ... FOR SELECT TO authenticated USING (true)` for tables that should be visible to all tenants
- **Backend-only** — leave as-is; only `postgres` role queries these

---

## Category D — System / Internal / Backup / Temporary (42 tables)

### D.1 — Raw ETL Tables (15 tables)

Only accessed by `refresh_*` functions running as `postgres` role. Never queried by SDK clients.

| # | Table | Rows | Why Category D |
|---|-------|-----:|---------------|
| D1 | `raw_ar_open_items` | 697 | Raw source data — ETL input |
| D2 | `raw_collections` | 0 | Raw source data — ETL input |
| D3 | `raw_customer_payments` | 76,531 | Raw source data — ETL input |
| D4 | `raw_customers` | 727 | Raw source data — ETL input |
| D5 | `raw_inbound_shipments` | 179 | Raw source data — ETL input |
| D6 | `raw_inventory` | 8,195 | Raw source data — ETL input |
| D7 | `raw_inventory_transactions` | 103,078 | Raw source data — ETL input |
| D8 | `raw_item_bom` | 3,587 | Raw source data — ETL input |
| D9 | `raw_items_master` | 32,895 | Raw source data — ETL input |
| D10 | `raw_locations` | 17 | Raw source data — ETL input |
| D11 | `raw_netsuite_customers` | 5 | Raw source data — ETL input |
| D12 | `raw_open_sales_orders` | 341 | Raw source data — ETL input |
| D13 | `raw_sales` | 15,915 | Raw source data — ETL input |
| D14 | `raw_sales_lines` | 56,967 | Raw source data — ETL input |
| D15 | `raw_subsidiaries` | 9 | Raw source data — ETL input |

### D.2 — Staging Tables (8 tables)

Intermediate transformation tables used by ETL functions.

| # | Table | Rows | Why Category D |
|---|-------|-----:|---------------|
| D16 | `stg_ar_open_items_clean` | 697 | Staging — cleaned by `refresh_stg_ar_open_items_clean` |
| D17 | `stg_customer_payments_clean` | 76,531 | Staging — cleaned by `refresh_stg_customer_payments_clean` |
| D18 | `stg_inbound_shipments_clean` | 179 | Staging |
| D19 | `stg_inventory_clean` | 8,195 | Staging — cleaned by `refresh_stg_inventory_clean` |
| D20 | `stg_inventory_transactions_clean` | 103,078 | Staging |
| D21 | `stg_items_master_clean` | 32,895 | Staging — cleaned by `refresh_stg_items_master_clean` |
| D22 | `stg_sales_clean` | 15,913 | Staging — cleaned by `refresh_stg_sales_clean` |
| D23 | `stg_sales_lines_clean` | 56,965 | Staging — cleaned by `refresh_stg_sales_lines_clean` |

### D.3 — Backup / Legacy / Temporary Tables (18 tables)

| # | Table | Rows | Why Category D |
|---|-------|-----:|---------------|
| D24 | `finance_ar_open_items_base_ok` | 1,099 | Legacy data snapshot |
| D25 | `finance_ar_open_items_ok_20260423` | 1,099 | Dated backup |
| D26 | `raw_sales_bak_20260423` | 13,695 | Dated backup |
| D27 | `raw_sales_lines_bak_20260423` | 48,540 | Dated backup |
| D28 | `sales_bak_20260423` | 13,695 | Dated backup |
| D29 | `sales_base_ok` | 13,762 | Legacy snapshot |
| D30 | `sales_lines_bak_20260423` | 48,540 | Dated backup |
| D31 | `sales_lines_base_ok` | 48,754 | Legacy snapshot |
| D32 | `sales_lines_ok_20260423` | 48,754 | Dated backup |
| D33 | `sales_ok_20260423` | 13,762 | Dated backup |
| D34 | `sales_scope_ar_ok` | 13,689 | AR scope backup |
| D35 | `kpi_finance_ar_aging_summary_ok` | 6 | KPI backup |
| D36 | `kpi_finance_current_snapshot_ok` | 1 | KPI backup |
| D37 | `raw_fx_rates` | 0 | Empty — unused |
| D38 | `raw_invoices` | 0 | Empty — unused |
| D39 | `raw_items` | 0 | Empty — unused |
| D40 | `raw_sales_orders` | 0 | Empty — unused |
| D41 | `tmp_subsidiaries` | 9 | Temporary ETL artifact |

### D.4 — System / Pipeline Tables (4 tables)

| # | Table | Rows | Why Category D |
|---|-------|-----:|---------------|
| D42 | `data_pipeline_step_log` | 0 | ETL pipeline logging — system internal |
| D43 | `data_quality_checks` | 1 | DQ results — system internal |
| D44 | `sop_business_pipeline` | 13 | SOP pipeline — system internal |
| D45 | `sop_inventory_supply_intelligence` | 11 | SOP supply intel — system internal |
| D46 | `finance_collections` | 0 | Empty future table — system |
| D47 | `finance_ar_invoices` | 0 | Empty future table — system |

**Strategy for Category D:** No policies. These tables are only accessed via `postgres` role (bypassrls). Current state (RLS enabled, zero policies) means anon/authenticated roles already cannot access them — which is the desired behavior.

---

## Summary

| Category | Tables | Policies Needed | Schema Change? | Status |
|:--------:|:------:|:--------------:|:--------------:|--------|
| **A** | 27 | 108 | NO | ✅ Ready for execution |
| **B** | 17 | ~68 | YES (ALTER TABLE) | ⏳ Deferred to separate wave |
| **C** | 5 | 0–5 (public-read only) | NO | ✅ Ready (document-only) |
| **D** | 47 | 0 | NO | ✅ No action required |
| **Total** | **96** | **~181** | | |

*Classification based on live Supabase MCP evidence collected 2026-07-10.*
