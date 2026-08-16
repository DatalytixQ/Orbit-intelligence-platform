# N002 Security Architecture

**Task:** N002 — RLS policies for domain tables
**Wave:** 0C — Discovery & Security Classification
**Status:** 📋 DESIGN COMPLETE — Awaiting approval per batch
**Date:** 2026-07-10
**Author:** Antigravity — Engineering Execution Agent

---

## Executive Summary

N002 covers all remaining public schema tables beyond `clients` and `app_users` (already secured by N001). The database contains **93 base tables** and **143 views** in the public schema. After classification:

- **45 tables** have `client_id` and are candidates for standard tenant policies
- **30 tables** lack `client_id` — requiring alternative strategies
- **18 tables** are backups/temporary/demo and should be archived or exempted
- **143 views** inherit RLS from underlying tables — no policies needed on views
- **0 triggers** exist — no trigger-based complications
- **14 functions** operate on domain tables — all execute as `postgres` (bypassrls)

**Critical architectural fact:** The backend connects as `postgres` role with `rolbypassrls: true`. RLS policies will ONLY affect connections through the Supabase SDK (anon/authenticated roles). The backend is completely unaffected by any policy we create.

The `rls_auto_enable` function is an **event trigger** that automatically enables RLS on any new table created in the `public` schema. This is why all 93 tables already have `rowsecurity: true`. It does NOT create policies.

---

## TASK 1 — Table Classification

### Category A: Business Tables WITH `client_id` (45 tables)

These are the primary candidates for standard `client_id`-based RLS policies.

| Table | Est. Rows | client_id Type | PK | FK | RLS Enabled |
|-------|-------:|---------|------|------|:-----:|
| `ai_usage_logs` | 21 | **uuid** ⚠️ | id | — | ✅ |
| `alert_config` | 3 | text | id | — | ✅ |
| `ar_settings` | 1 | text | client_id | — | ✅ |
| `audit_log` | 0 | text | id | — | ✅ |
| `business_review_rules` | 0 | text | rule_id | — | ✅ |
| `business_rule_thresholds` | 15 | text | id | — | ✅ |
| `client_config` | 1 | text | client_id | — | ✅ |
| `customer_payments` | 36,798 | text | — | — | ✅ |
| `customer_segments` | 0 | text | id | — | ✅ |
| `data_load_runs` | 0 | text | id | — | ✅ |
| `finance_ar_open_items` | 1,061 | text | — | — | ✅ |
| `inbound_shipments` | 251 | text | — | — | ✅ |
| `insight_execution_context` | 1 | text | id | — | ✅ |
| `insights` | 1,371 | text | id | — | ✅ |
| `inventory_category_settings` | 0 | text | id | — | ✅ |
| `inventory_movements` | 97,941 | text | — | — | ✅ |
| `inventory_settings` | 1 | text | client_id | — | ✅ |
| `inventory_stock` | 7,853 | text | — | — | ✅ |
| `item_alias_map` | 52 | text | — | — | ✅ |
| `item_bom` | 3,548 | text | (bom_id,parent_item_id,component_item_id) | — | ✅ |
| `item_bom_resolved` | 3,556 | text | — | — | ✅ |
| `items_master` | 4,539 | text | item_id | — | ✅ |
| `open_sales_order_demand` | 341 | text | — | — | ✅ |
| `sales` | 15,229 | text | — | — | ✅ |
| `sales_lines` | 54,232 | text | — | — | ✅ |
| `sales_settings` | 1 | text | client_id | — | ✅ |
| `sync_runs` | 0 | text | id | — | ✅ |

**Raw/Staging tables with `client_id`:**

| Table | Est. Rows | Category |
|-------|-------:|---------|
| `raw_ar_open_items` | 697 | Raw ETL |
| `raw_collections` | 0 | Raw ETL |
| `raw_customer_payments` | 76,531 | Raw ETL |
| `raw_customers` | 727 | Raw ETL |
| `raw_inbound_shipments` | 179 | Raw ETL |
| `raw_inventory` | 8,195 | Raw ETL |
| `raw_inventory_transactions` | 103,078 | Raw ETL |
| `raw_item_bom` | 3,587 | Raw ETL |
| `raw_items_master` | 32,895 | Raw ETL |
| `raw_locations` | 17 | Raw ETL |
| `raw_netsuite_customers` | 5 | Raw ETL |
| `raw_open_sales_orders` | 341 | Raw ETL |
| `raw_sales` | 15,915 | Raw ETL |
| `raw_sales_lines` | 56,967 | Raw ETL |
| `raw_subsidiaries` | 9 | Raw ETL |
| `stg_ar_open_items_clean` | 697 | Staging |
| `stg_customer_payments_clean` | 76,531 | Staging |
| `stg_inbound_shipments_clean` | 179 | Staging |
| `stg_inventory_clean` | 8,195 | Staging |
| `stg_inventory_transactions_clean` | 103,078 | Staging |
| `stg_items_master_clean` | 32,895 | Staging |
| `stg_sales_clean` | 15,913 | Staging |
| `stg_sales_lines_clean` | 56,965 | Staging |
| `tmp_subsidiaries` | 9 | Temporary |

### Category B: Business Tables WITHOUT `client_id` (19 tables)

| Table | Est. Rows | PK | Purpose | Tenant Strategy Required |
|-------|-------:|-----|---------|:-----:|
| `actions_log` | 5 | id | Insight-driven actions tracker | FK to `insights` |
| `customers` | 727 | — | Cleaned customer master | Needs `client_id` |
| `inventory` | 8,040 | — | Current inventory position | Needs `client_id` |
| `insight_evolution` | 10 | id | Trend tracking per insight | FK to `insights_log` |
| `insights_log` | 5 | id | Insight log/history | Needs `client_id` |
| `finance_customer_risk_snapshot` | 683 | (customer_id,snapshot_date) | Risk scoring snapshot | Needs `client_id` |
| `finance_ar_snapshot_daily` | 2 | snapshot_date | Daily AR aggregate | Needs `client_id` |
| `customer_daily_snapshot` | 1 | snapshot_date | Customer health aggregate | Needs `client_id` |
| `sales_semantic_current` | 48,605 | — | Semantic layer cache | Needs `client_id` |
| `inventory_bom_capacity_current` | 298 | — | BOM capacity snapshot | Needs `client_id` |
| `inventory_supply_semantic_current` | 2,510 | — | Supply intelligence cache | Needs `client_id` |
| `inventory_supply_snapshot_daily` | 5,008 | — | Daily supply snapshot | Needs `client_id` |
| `item_lookup_normalized` | 4,505 | — | Item name normalization | Needs `client_id` |
| `items_master_override` | 2 | item_id | Manual item overrides | Needs `client_id` |
| `sales_forecast_monthly` | 12 | id | Sales forecast data | Needs `client_id` |
| `stg_customers_clean` | 727 | — | Cleaned staging customers | Needs `client_id` |
| `data_pipeline_step_log` | 0 | step_id | ETL pipeline steps | System table |
| `data_quality_checks` | 1 | id | DQ check results | System table |
| `ar_payment_applications` | 0 | — | Payment applications | Empty — needs `client_id` |

### Category C: System Tables (5 tables)

| Table | Est. Rows | Purpose | RLS Strategy |
|-------|-------:|---------|-------------|
| `business_rules` | 15 | Global rule definitions | Backend-only (no tenant scope) |
| `industry_profiles` | 4 | Industry benchmark data | Public read |
| `product_catalog` | 11 | Platform object catalog | Internal metadata |
| `financial_currency_field_catalog` | 0 | Currency field mapping | Internal metadata |
| `sales_exclusion_rules` | 3 | Invoice exclusion rules | Backend-only |

### Category D: Audit Tables (1 table — already in Cat A)

| Table | Purpose | Notes |
|-------|---------|-------|
| `audit_log` | Change tracking (has `client_id`) | Already in Category A |

### Category E: Configuration Tables (already in Cat A)

| Table | Purpose | Notes |
|-------|---------|-------|
| `ar_settings` | AR module config per client | PK = `client_id` |
| `client_config` | Client-level settings | PK = `client_id` |
| `inventory_settings` | Inventory config per client | PK = `client_id` |
| `sales_settings` | Sales config per client | PK = `client_id` |
| `alert_config` | Alert configuration | Has `client_id` |

### Category F: Temporary / Legacy / Backup (18 tables)

| Table | Est. Rows | Purpose | Strategy |
|-------|-------:|---------|---------|
| `finance_ar_open_items_base_ok` | 1,099 | Legacy snapshot | Archive / exempt |
| `finance_ar_open_items_ok_20260423` | 1,099 | Dated backup | Archive / exempt |
| `raw_sales_bak_20260423` | 13,695 | Sales backup | Archive / exempt |
| `raw_sales_lines_bak_20260423` | 48,540 | Sales lines backup | Archive / exempt |
| `sales_bak_20260423` | 13,695 | Sales backup | Archive / exempt |
| `sales_base_ok` | 13,762 | Legacy snapshot | Archive / exempt |
| `sales_lines_bak_20260423` | 48,540 | Sales lines backup | Archive / exempt |
| `sales_lines_base_ok` | 48,754 | Legacy snapshot | Archive / exempt |
| `sales_lines_ok_20260423` | 48,754 | Sales lines backup | Archive / exempt |
| `sales_ok_20260423` | 13,762 | Sales backup | Archive / exempt |
| `sales_scope_ar_ok` | 13,689 | AR scope backup | Archive / exempt |
| `kpi_finance_ar_aging_summary_ok` | 6 | KPI backup | Archive / exempt |
| `kpi_finance_current_snapshot_ok` | 1 | KPI backup | Archive / exempt |
| `raw_fx_rates` | 0 | Empty FX rates | Archive / exempt |
| `raw_invoices` | 0 | Empty raw invoices | Archive / exempt |
| `raw_items` | 0 | Empty raw items | Archive / exempt |
| `raw_sales_orders` | 0 | Empty raw orders | Archive / exempt |
| `sop_business_pipeline` | 13 | SOP pipeline | Backend-only |
| `sop_inventory_supply_intelligence` | 11 | SOP supply intel | Backend-only |

### Category G: Derived Snapshots (included in Categories A & B above)

Snapshot tables that are populated by `refresh_*` functions — see dependency graph.

### Category H: Views (143 views)

Views do NOT need RLS policies. PostgreSQL views inherit RLS from their underlying base tables. Since all backend queries use the `postgres` role (bypassrls), views are unaffected. Views are listed in the dependency graph below.

### Category I: Materialized Views

No materialized views exist in the public schema. Some tables reference `mv_kpi_finance_dso_action_list` in backend routes — this object may not yet exist (finance.js line 148).

### Category J: Internal Supabase Objects

The `rls_auto_enable` function is an **event trigger** function (`SECURITY DEFINER`) that automatically enables RLS on any new table created in `public`. It does NOT create policies. It is safe and should not be modified.

---

## TASK 2 — Detailed Table Profiles

### Key Domain Tables

| Table | Purpose | Owner | Used By | Referenced By | PK | FK | Tenant | RLS | Should RLS? | Must NOT RLS? | Alt. Strategy |
|-------|---------|-------|---------|---------------|----|----|--------|-----|:-----------:|:-------------:|--------------|
| `sales` | Cleaned sales headers | Finance | sales.js, analytics.js | Views: 6+ | — | — | ✅ client_id | ✅ on | ✅ YES | — | client_id policy |
| `sales_lines` | Cleaned sales line items | Finance | sales.js, views | Views: 8+ | — | — | ✅ client_id | ✅ on | ✅ YES | — | client_id policy |
| `finance_ar_open_items` | AR open receivables | Finance | finance.js | Views: 3+ | — | — | ✅ client_id | ✅ on | ✅ YES | — | client_id policy |
| `customer_payments` | Payment records | Finance | — | Views: 2+ | — | — | ✅ client_id | ✅ on | ✅ YES | — | client_id policy |
| `insights` | Generated business insights | Analytics | insights.js, businessInsights.js | Views: 5+ | id | — | ✅ client_id | ✅ on | ✅ YES | — | client_id policy |
| `inventory_stock` | Current stock levels | Operations | inventory.js | Views: 3+ | — | — | ✅ client_id | ✅ on | ✅ YES | — | client_id policy |
| `items_master` | Item/product catalog | Operations | — | Views: 8+ | item_id | — | ✅ client_id | ✅ on | ✅ YES | — | client_id policy |
| `inventory` | Inventory position (no client_id) | Operations | — | Views: 1+ | — | — | ❌ none | ✅ on | ⚠️ DEFERRED | — | Needs `client_id` added |
| `insights_log` | Insight history (no client_id) | Analytics | insights.js | fn: generate_insights_snapshot | id | — | ❌ none | ✅ on | ⚠️ DEFERRED | — | Needs `client_id` added |
| `actions_log` | Action items (no client_id) | Analytics | insights.js | — | id | insight_id→insights | ❌ none | ✅ on | ⚠️ DEFERRED | — | FK-based or add `client_id` |
| `business_rules` | Global rule definitions | System | — | — | rule_id | — | ❌ none | ✅ on | — | ✅ Must NOT | Backend-only / exempt |
| `industry_profiles` | Industry benchmarks | System | — | — | industry_type | — | ❌ none | ✅ on | — | ✅ Must NOT | Public read / exempt |

---

## TASK 3 — Dependency Graph

### Views → Base Tables

| View | Depends On (base tables) |
|------|------------------------|
| `finance_ar_open_items_cxc` | `finance_ar_open_items`, `sales_lines` |
| `finance_ar_open_items_enriched` | `finance_ar_open_items`, `sales` |
| `core_inventory_coverage` | `inventory_stock` |
| `inventory_position_v` | `inventory_stock` |
| `items_master_v` | `items_master` |
| `kpi_inventory_coverage` | `items_master` |
| `kpi_inventory_slow_moving` | `items_master` |
| `kpi_inventory_item_snapshot` | `inventory` (no client_id) |
| `kpi_item_demand_3m` | `sales_lines` |
| `kpi_sales_category_monthly` | `sales_lines`, `items_master` |
| `kpi_ventas_mensuales` | `sales_lines` |
| `v_bom_demand_component_coverage` | `inventory_stock` |
| `v_kpi_sales_base` | `sales_lines`, `items_master` |
| `vw_home_executive_summary` | `insights` |
| `vw_inventory_demand_profile` | `sales_lines`, `sales`, `items_master` |
| `vw_inventory_items_semantic` | `items_master` |
| `vw_inventory_master_alerts` | `items_master` |
| `vw_item_bom_resolved` | `items_master` |
| `vw_item_master_cost_quality_alerts` | `items_master` |
| `vw_priority_engine` | `insights`, `clients` |
| `vw_sales_customer_concentration` | `sales` |
| `vw_sales_insights` | `sales` |
| `vw_sales_item_performance` | `sales_lines`, `items_master` |
| `vw_sales_projection_current` | `sales` |
| `vw_stg_inventory_enriched` | `items_master` |
| `sales_lines_ar_demo` | `sales_lines` |
| `kpi_sales_top_10_customer_participation_2026` | `sales` |
| `kpi_top_10_customer_sales_participation_2026` | `sales` |
| `kpi_current_insights_base` | `sales` |

### Functions → Tables (Write Dependencies)

| Function | Reads From | Writes To |
|----------|-----------|----------|
| `refresh_stg_ar_open_items_clean` | `raw_ar_open_items` | `stg_ar_open_items_clean` (TRUNCATE+INSERT) |
| `refresh_stg_customer_payments_clean` | `raw_customer_payments` | `stg_customer_payments_clean` (TRUNCATE+INSERT) |
| `refresh_stg_sales_clean` | `raw_sales`, `sales_exclusion_rules` | `stg_sales_clean` (TRUNCATE+INSERT) |
| `refresh_stg_sales_lines_clean` | `raw_sales_lines`, `stg_sales_clean` | `stg_sales_lines_clean` (TRUNCATE+INSERT) |
| `refresh_stg_inventory_clean` | `raw_inventory` | `stg_inventory_clean` (TRUNCATE+INSERT) |
| `refresh_stg_items_master_clean` | `raw_items_master` | `stg_items_master_clean` (TRUNCATE+INSERT) |
| `refresh_open_sales_order_demand` | `raw_open_sales_orders` | `open_sales_order_demand` (TRUNCATE+INSERT) |
| `refresh_ar_actuals` | — | Calls: `refresh_stg_ar_open_items_clean`, `refresh_stg_customer_payments_clean` |
| `refresh_sales_actuals` | — | Calls: `refresh_stg_sales_clean`, `refresh_stg_sales_lines_clean` |
| `refresh_finance_snapshots` | `vw_finance_ar_open_items_semantic` | `finance_ar_snapshot_daily`, `finance_customer_risk_snapshot` (DELETE+INSERT) |
| `refresh_inventory_supply_intelligence` | `vw_inventory_coverage_semantic`, `inventory_bom_capacity_current`, `vw_inventory_inbound_semantic` | `inventory_bom_capacity_current`, `inventory_supply_semantic_current`, `inventory_supply_snapshot_daily` (TRUNCATE+INSERT) |
| `refresh_inventory_supply_snapshot` | `vw_inventory_supply_coverage_semantic` | `inventory_supply_snapshot_daily` (DELETE+INSERT) |
| `generate_insights_snapshot` | `kpi_current_insights_base`, `insights_log`, `actions_log` | `insights_log`, `insight_evolution`, `actions_log` (INSERT/UPDATE) |
| `rls_auto_enable` | — | Event trigger: enables RLS on new tables |

### Backend Routes → Tables (SQL queries)

| Route | Tables/Views Queried |
|-------|---------------------|
| `auth.js` | `app_users` ✅, `clients` ✅ |
| `ai.js` | `ai_usage_logs` (INSERT) |
| `analytics.js` | Views: `kpi_finance_current_snapshot`, `kpi_finance_ar_aging_summary`, `kpi_ventas_mensuales`, `kpi_top_clientes`, `kpi_sales_category_monthly`, `kpi_inventory_*` |
| `businessInsights.js` | Views: `vw_home_premium`, `vw_home_executive_summary`, `vw_business_insights`, `vw_priority_engine` |
| `finance.js` | Views: `kpi_finance_*`, `finance_ar_open_items_cxc`, `finance_customer_risk_snapshot`, `finance_ar_snapshot_daily`, `kpi_customer_health_*`; Fn: `refresh_finance_snapshots` |
| `insights.js` | `insights_log`, `insight_evolution`, `actions_log`; Fn: `generate_insights_snapshot` |
| `inventory.js` | Views: `kpi_inventory_*` |
| `sales.js` | Views: `kpi_ventas_*`, `kpi_sales_*`, `kpi_top_*`; Table: `sales_lines` |

### Triggers

**Zero triggers** exist in the public schema. The only trigger-like mechanism is the `rls_auto_enable` event trigger, which fires on `CREATE TABLE` DDL events.

---

## TASK 4 — Security Architecture: Recommended Strategy Per Table

### Strategy Legend

| Code | Strategy | Description |
|------|----------|-------------|
| **P1** | `client_id` policy | Standard: `USING (client_id = JWT.client_id)` |
| **P2** | Backend-only | No policy needed — only accessed via `postgres` role |
| **P3** | Exempt (archive) | Backup/legacy table — no policy, restrict access |
| **P4** | Public read | System reference data — SELECT for all roles |
| **P5** | Deferred (needs schema change) | Table lacks `client_id` — add column before policy |

### Category A Tables — Strategy P1

All 27 non-raw, non-staging business tables with `client_id`:

| Table | Strategy | Why |
|-------|---------|-----|
| `ai_usage_logs` | **P1** (cast required) | Has `client_id` as **uuid** — need `client_id::text = JWT.client_id` |
| `alert_config` | **P1** | Direct client_id match |
| `ar_settings` | **P1** | PK = client_id |
| `audit_log` | **P1** | Direct client_id match |
| `business_review_rules` | **P1** | Direct client_id match |
| `business_rule_thresholds` | **P1** | Direct client_id match |
| `client_config` | **P1** | PK = client_id |
| `customer_payments` | **P1** | High-volume — direct client_id match |
| `customer_segments` | **P1** | Direct client_id match |
| `data_load_runs` | **P1** | Direct client_id match |
| `finance_ar_open_items` | **P1** | Direct client_id match |
| `inbound_shipments` | **P1** | Direct client_id match |
| `insight_execution_context` | **P1** | Direct client_id match |
| `insights` | **P1** | Direct client_id match |
| `inventory_category_settings` | **P1** | Direct client_id match |
| `inventory_movements` | **P1** | Highest volume (97K rows) — direct client_id match |
| `inventory_settings` | **P1** | PK = client_id |
| `inventory_stock` | **P1** | Direct client_id match |
| `item_alias_map` | **P1** | Direct client_id match |
| `item_bom` | **P1** | Direct client_id match |
| `item_bom_resolved` | **P1** | Direct client_id match |
| `items_master` | **P1** | Direct client_id match |
| `open_sales_order_demand` | **P1** | Direct client_id match |
| `sales` | **P1** | Direct client_id match |
| `sales_lines` | **P1** | High-volume (54K) — direct client_id match |
| `sales_settings` | **P1** | PK = client_id |
| `sync_runs` | **P1** | Direct client_id match |

### Raw/Staging Tables — Strategy P2 (Backend-only)

| Table | Strategy | Why |
|-------|---------|-----|
| All `raw_*` tables (15) | **P2** | Only accessed by `refresh_*` functions running as `postgres`. Never queried by SDK clients. |
| All `stg_*` tables (8) | **P2** | Only accessed by `refresh_*` functions running as `postgres`. Never queried by SDK clients. |
| `tmp_subsidiaries` | **P2** | Temporary ETL artifact |

### Category B Tables — Strategy P5 (Deferred)

| Table | Strategy | Why | Proposed Resolution |
|-------|---------|-----|-------------------|
| `inventory` | **P5** | 8,040 rows, no `client_id`. Used by `kpi_inventory_item_snapshot` view. | ADD `client_id` column, backfill from single-tenant data |
| `insights_log` | **P5** | 5 rows. Written by `generate_insights_snapshot`. | ADD `client_id` column |
| `actions_log` | **P5** | 5 rows. Written by `generate_insights_snapshot`. FK to `insights`. | ADD `client_id` column (or inherit from `insights` via JOIN policy) |
| `insight_evolution` | **P5** | 10 rows. Written by `generate_insights_snapshot`. | ADD `client_id` column |
| `customers` | **P5** | 727 rows. Cleaned customer master. | ADD `client_id` column, backfill |
| `finance_customer_risk_snapshot` | **P5** | 683 rows. Written by `refresh_finance_snapshots`. | ADD `client_id` column |
| `finance_ar_snapshot_daily` | **P5** | 2 rows. Written by `refresh_finance_snapshots`. | ADD `client_id` column |
| `customer_daily_snapshot` | **P5** | 1 row. | ADD `client_id` column |
| `sales_semantic_current` | **P5** | 48,605 rows. Semantic cache. | ADD `client_id` column |
| `inventory_bom_capacity_current` | **P5** | 298 rows. Written by `refresh_inventory_supply_intelligence`. | ADD `client_id` column |
| `inventory_supply_semantic_current` | **P5** | 2,510 rows. Written by `refresh_inventory_supply_intelligence`. | ADD `client_id` column |
| `inventory_supply_snapshot_daily` | **P5** | 5,008 rows. Written by refresh functions. | ADD `client_id` column |
| `item_lookup_normalized` | **P5** | 4,505 rows. | ADD `client_id` column |
| `items_master_override` | **P5** | 2 rows. | ADD `client_id` column |
| `sales_forecast_monthly` | **P5** | 12 rows. | ADD `client_id` column |
| `stg_customers_clean` | **P5** | 727 rows. | ADD `client_id` column |
| `ar_payment_applications` | **P5** | 0 rows. | ADD `client_id` column |
| `finance_collections` | **P5** | 0 rows. | ADD `client_id` column |
| `finance_ar_invoices` | **P5** | 0 rows. | ADD `client_id` column |
| `data_pipeline_step_log` | **P2** | System ETL logging — backend-only |
| `data_quality_checks` | **P2** | System DQ checking — backend-only |

### Category C Tables — Strategy P2/P4 (System)

| Table | Strategy | Why |
|-------|---------|-----|
| `business_rules` | **P2** | Global rule definitions, no tenant scope. Backend-only. |
| `industry_profiles` | **P4** | Reference data for all tenants. Public read. |
| `product_catalog` | **P2** | Internal metadata. Backend-only. |
| `financial_currency_field_catalog` | **P2** | Internal metadata. Backend-only. |
| `sales_exclusion_rules` | **P2** | Used by `refresh_stg_sales_clean`. Backend-only. |

### Category F Tables — Strategy P3 (Archive/Exempt)

| Table | Strategy | Why |
|-------|---------|-----|
| All 18 backup/dated tables | **P3** | Legacy snapshots. Not queried by application. Should be moved to `archive` schema or dropped after data validation. |

---

## Risks

| # | Risk | Level | Mitigation |
|---|------|:-----:|-----------|
| R1 | **19 tables need `client_id` added before policies** | 🔴 HIGH | Requires `ALTER TABLE ADD COLUMN` + backfill. Must be done in a separate wave BEFORE policies. All current data belongs to `vonderk`. |
| R2 | **`ai_usage_logs.client_id` is `uuid` not `text`** | 🟡 MEDIUM | Policy must cast: `client_id::text = JWT.client_id`. Type mismatch with all other tables. |
| R3 | **`generate_insights_snapshot` writes to 3 tables without `client_id`** | 🟡 MEDIUM | Function must be updated to pass `client_id` when inserting into `insights_log`, `insight_evolution`, `actions_log`. |
| R4 | **`refresh_finance_snapshots` writes to tables without `client_id`** | 🟡 MEDIUM | Function must be updated to populate `client_id` in `finance_ar_snapshot_daily` and `finance_customer_risk_snapshot`. |
| R5 | **18 backup tables clutter the policy scope** | 🟢 LOW | Recommend moving to `archive` schema. Not blocking N002. |
| R6 | **`mv_kpi_finance_dso_action_list` referenced in `finance.js` but does not exist** | 🟡 MEDIUM | Backend will error on DSO endpoints. Not related to N002 but should be flagged. |

---

## Migration Order

1. **Batch 1:** Tables with `client_id` that are DIRECTLY queried by backend routes
2. **Batch 2:** Tables with `client_id` that are ONLY read through views
3. **Batch 3:** Configuration/settings tables with `client_id`
4. **Batch 4:** Raw/staging tables (backend-only strategy)
5. **Batch 5 (DEFERRED):** Tables requiring schema change (`ALTER TABLE ADD COLUMN client_id`)

---

## Rollback Strategy

Each batch generates its own `n002_batchN_rollback.sql` containing `DROP POLICY IF EXISTS` for every policy in that batch. Rollback is instantaneous, metadata-only, zero data loss.

---

## Validation Strategy

After each batch:
1. Verify `policy_count` matches expected number
2. Verify `postgres` role still reads all rows (bypassrls)
3. Run the same backend route queries via `execute_sql` to confirm no errors
4. Verify no function errors by calling `refresh_*` functions (dry-run)

---

## Approval Requirements

| Batch | Approval |
|-------|---------|
| Batch 1 | User explicit approval |
| Batch 2 | User explicit approval |
| Batch 3 | User explicit approval |
| Batch 4 | User explicit approval (optional — P2 = no policy) |
| Batch 5 | **Requires separate schema migration approval** |

---

## Estimated Complexity & Duration

| Batch | Tables | Policies | Complexity | Est. Duration |
|-------|:------:|:--------:|:----------:|:------------:|
| Batch 1 | 10 | 40 | MEDIUM | 30 min |
| Batch 2 | 9 | 36 | MEDIUM | 20 min |
| Batch 3 | 8 | 32 | LOW | 15 min |
| Batch 4 | 0 | 0 | N/A | 5 min (doc only) |
| Batch 5 | 19 | ~76 | HIGH | 2+ hours (schema changes) |
| **Total** | **46** | **~184** | | |

---

*Report generated by Antigravity — Engineering Execution Agent*
*Source: Live Supabase MCP queries (READ ONLY). No schema modifications made.*
