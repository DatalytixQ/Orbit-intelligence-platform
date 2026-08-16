# N002 Execution Plan

**Task:** N002 — RLS policies for domain tables
**Wave:** 0C → 0D (execution)
**Date:** 2026-07-10
**Status:** READY FOR EXECUTION (pending user approval per phase)
**Source:** n002_security_architecture.md, n002_table_classification.md

---

## Execution Overview

N002 is split into **5 independent phases**. Each phase can be approved and executed separately. Phases 1–3 create policies on Category A tables (have `client_id`). Phase 4 documents Category C/D tables (no policies needed). Phase 5 is a separate schema migration wave for Category B tables (no `client_id`).

```
Phase 1 ─── Core Business Tables ────── 10 tables ── 40 policies
Phase 2 ─── Analytics & Intelligence ── 9 tables ── 36 policies
Phase 3 ─── Config, Audit & AI ──────── 8 tables ── 32 policies
Phase 4 ─── Reference & System ──────── 52 tables ─ 0 policies (doc only)
Phase 5 ─── Schema Evolution ────────── 17 tables ─ ~68 policies (DEFERRED)
```

---

## Phase 1 — Core Business Tables

### Objective
Apply RLS policies to the 10 highest-impact business tables that store primary financial, sales, inventory, and insight data. These are the tables most commonly queried by backend routes.

### Estimated Duration: 30 minutes

### Affected Tables

| # | Table | Rows | Backend Routes | Views Depending |
|---|-------|-----:|---------------|:--------------:|
| 1 | `sales` | 15,229 | sales.js | 6+ |
| 2 | `sales_lines` | 54,232 | sales.js | 8+ |
| 3 | `finance_ar_open_items` | 1,061 | finance.js (via views) | 3+ |
| 4 | `customer_payments` | 36,798 | — (via views) | 2+ |
| 5 | `insights` | 1,371 | insights.js, businessInsights.js | 5+ |
| 6 | `inventory_stock` | 7,853 | inventory.js (via views) | 3+ |
| 7 | `items_master` | 4,539 | — (via views) | 8+ |
| 8 | `inventory_movements` | 97,941 | — | 0 |
| 9 | `inbound_shipments` | 251 | — | 0 |
| 10 | `open_sales_order_demand` | 341 | — | 0 |

### Policy Template (per table)
```sql
CREATE POLICY "n002_<table>_select_own_tenant" ON public.<table>
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_<table>_insert_own_tenant" ON public.<table>
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_<table>_update_own_tenant" ON public.<table>
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_<table>_delete_own_tenant" ON public.<table>
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
```

### Risks
| Risk | Level | Mitigation |
|------|:-----:|-----------|
| High-volume tables (inventory_movements: 97K, sales_lines: 54K) may have policy evaluation overhead | 🟢 LOW | Backend uses `postgres` (bypassrls) — policies are never evaluated for backend queries |
| Views depending on these tables may behave differently for SDK clients | 🟢 LOW | No SDK clients currently exist. Backend unaffected. |

### Rollback
```sql
-- Phase 1 Rollback: DROP 40 policies
DO $$ DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'sales','sales_lines','finance_ar_open_items','customer_payments',
    'insights','inventory_stock','items_master','inventory_movements',
    'inbound_shipments','open_sales_order_demand'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "n002_%s_select_own_tenant" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "n002_%s_insert_own_tenant" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "n002_%s_update_own_tenant" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "n002_%s_delete_own_tenant" ON public.%I', t, t);
  END LOOP;
END $$;
```

### Validation Queries
```sql
-- V1: Confirm 40 policies created
SELECT COUNT(*) AS policy_count FROM pg_policies
WHERE schemaname = 'public' AND policyname LIKE 'n002_%'
AND tablename IN ('sales','sales_lines','finance_ar_open_items','customer_payments',
  'insights','inventory_stock','items_master','inventory_movements',
  'inbound_shipments','open_sales_order_demand');
-- EXPECTED: 40

-- V2: postgres role can still read all rows
SELECT 'sales' AS tbl, COUNT(*) FROM public.sales
UNION ALL SELECT 'sales_lines', COUNT(*) FROM public.sales_lines
UNION ALL SELECT 'finance_ar_open_items', COUNT(*) FROM public.finance_ar_open_items
UNION ALL SELECT 'customer_payments', COUNT(*) FROM public.customer_payments
UNION ALL SELECT 'insights', COUNT(*) FROM public.insights
UNION ALL SELECT 'inventory_stock', COUNT(*) FROM public.inventory_stock
UNION ALL SELECT 'items_master', COUNT(*) FROM public.items_master
UNION ALL SELECT 'inventory_movements', COUNT(*) FROM public.inventory_movements
UNION ALL SELECT 'inbound_shipments', COUNT(*) FROM public.inbound_shipments
UNION ALL SELECT 'open_sales_order_demand', COUNT(*) FROM public.open_sales_order_demand;
-- EXPECTED: All counts > 0 (except possibly customer_segments)

-- V3: Backend join queries still work
SELECT COUNT(*) FROM public.sales s
JOIN public.sales_lines sl ON sl.invoice_id = s.invoice_internal_id LIMIT 1;
-- EXPECTED: 1 row, no error
```

---

## Phase 2 — Analytics & Intelligence Tables

### Objective
Apply RLS policies to BOM, demand, and analytics tables that support the intelligence engine and inventory analysis.

### Estimated Duration: 20 minutes

### Affected Tables

| # | Table | Rows | Purpose |
|---|-------|-----:|---------|
| 1 | `item_bom` | 3,548 | Bill of materials |
| 2 | `item_bom_resolved` | 3,556 | Flattened BOM |
| 3 | `item_alias_map` | 52 | Item name aliases |
| 4 | `insight_execution_context` | 1 | Insight engine state |
| 5 | `customer_segments` | 0 | Customer segmentation |
| 6 | `data_load_runs` | 0 | ETL run tracking |
| 7 | `sync_runs` | 0 | Sync tracking |
| 8 | `business_review_rules` | 0 | Client business rules |
| 9 | `business_rule_thresholds` | 15 | Client thresholds |

### Risks
| Risk | Level | Mitigation |
|------|:-----:|-----------|
| `item_bom` has composite PK (3 columns) | 🟢 LOW | PK structure doesn't affect RLS policy — policy only checks `client_id` |
| Several tables are empty | 🟢 LOW | Policies apply correctly on empty tables |

### Rollback
Same pattern as Phase 1 — `DROP POLICY IF EXISTS` for 36 policies.

### Validation Queries
```sql
-- V1: Confirm 36 policies
SELECT COUNT(*) FROM pg_policies WHERE policyname LIKE 'n002_%'
AND tablename IN ('item_bom','item_bom_resolved','item_alias_map',
  'insight_execution_context','customer_segments','data_load_runs',
  'sync_runs','business_review_rules','business_rule_thresholds');
-- EXPECTED: 36

-- V2: BOM query still works
SELECT COUNT(*) FROM public.item_bom;
-- EXPECTED: 3548
```

---

## Phase 3 — Configuration, Audit & AI Tables

### Objective
Apply RLS policies to per-client configuration tables, audit logging, alert configuration, and AI usage tracking.

### Estimated Duration: 15 minutes

### Affected Tables

| # | Table | Rows | client_id Type | Special Notes |
|---|-------|-----:|:---------:|--------------|
| 1 | `ar_settings` | 1 | text | PK = client_id |
| 2 | `client_config` | 1 | text | PK = client_id |
| 3 | `inventory_settings` | 1 | text | PK = client_id |
| 4 | `sales_settings` | 1 | text | PK = client_id |
| 5 | `alert_config` | 3 | text | — |
| 6 | `inventory_category_settings` | 0 | text | — |
| 7 | `audit_log` | 0 | text | — |
| 8 | `ai_usage_logs` | 21 | **uuid** ⚠️ | Requires cast in policy |

### Special: `ai_usage_logs` Policy (uuid cast)
```sql
-- ai_usage_logs.client_id is uuid, not text
-- Policy must cast to text for JWT comparison
CREATE POLICY "n002_ai_usage_logs_select_own_tenant" ON public.ai_usage_logs
  FOR SELECT TO authenticated
  USING (client_id::text = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
```

### Risks
| Risk | Level | Mitigation |
|------|:-----:|-----------|
| `ai_usage_logs.client_id` is `uuid` — requires cast | 🟡 MEDIUM | Policy uses `client_id::text` — verified that implicit cast works. Must test. |
| Settings tables have `client_id` as PK — UPDATE/DELETE policies needed | 🟢 LOW | Standard policies apply — PK is just another column for RLS purposes |

### Rollback
`DROP POLICY IF EXISTS` for 32 policies.

### Validation Queries
```sql
-- V1: Confirm 32 policies
SELECT COUNT(*) FROM pg_policies WHERE policyname LIKE 'n002_%'
AND tablename IN ('ar_settings','client_config','inventory_settings',
  'sales_settings','alert_config','inventory_category_settings',
  'audit_log','ai_usage_logs');
-- EXPECTED: 32

-- V2: ai_usage_logs readable (bypassrls)
SELECT COUNT(*) FROM public.ai_usage_logs;
-- EXPECTED: 21
```

---

## Phase 4 — Reference & System Tables (Documentation Only)

### Objective
Formally document the decision for all Category C (reference) and Category D (system/internal/backup) tables. NO policies created.

### Estimated Duration: 5 minutes (document update only)

### Affected Tables: 52 tables (5 reference + 47 system/internal)

### Action
- No SQL executed
- Update `n002_execution_report.md` to record exemption rationale
- All 52 tables remain in current state: RLS enabled, zero policies
- For `authenticated`/`anon` roles, these tables are effectively **blocked** (RLS on, no permissive policies = default deny)

### Category C — Potential Public-Read Policies (optional, requires decision)

| Table | Option A: Leave Blocked | Option B: Public Read |
|-------|:-----------------------:|:--------------------:|
| `business_rules` | ✅ Recommended — backend-only | Only if SDK client needs rules |
| `industry_profiles` | Only if SDK client needs benchmarks | ✅ Reasonable — reference data |
| `product_catalog` | ✅ Recommended — internal | Only for admin tools |
| `financial_currency_field_catalog` | ✅ Recommended — internal | — |
| `sales_exclusion_rules` | ✅ Recommended — backend-only | — |

**Recommendation:** Leave all Category C tables blocked. No SDK clients exist. Revisit when/if a Supabase SDK client is introduced.

### Risks
None — no changes are made.

---

## Phase 5 — Schema Evolution (DEFERRED)

### Objective
Add `client_id` column to 17 Category B tables, backfill with `'vonderk'`, update `refresh_*` functions to propagate `client_id`, then apply RLS policies.

### Estimated Duration: 2+ hours

### Status: ⛔ NOT READY — Requires separate wave approval

### Prerequisites
1. All Phase 1–3 policies must be validated
2. User must approve schema changes (ALTER TABLE)
3. `generate_insights_snapshot` function must be updated
4. `refresh_finance_snapshots` function must be updated
5. `refresh_inventory_supply_intelligence` function must be updated

### Affected Tables: 17 tables (see n002_table_classification.md Category B)

### Migration Pattern (per table)
```sql
-- Step 1: Add column
ALTER TABLE public.<table> ADD COLUMN client_id text;

-- Step 2: Backfill (single-tenant)
UPDATE public.<table> SET client_id = 'vonderk' WHERE client_id IS NULL;

-- Step 3: Add NOT NULL constraint
ALTER TABLE public.<table> ALTER COLUMN client_id SET NOT NULL;

-- Step 4: Create RLS policies (same as Phase 1 pattern)
CREATE POLICY ...
```

### Risks
| Risk | Level | Mitigation |
|------|:-----:|-----------|
| ALTER TABLE on large tables (sales_semantic_current: 48K rows) may lock briefly | 🟡 MEDIUM | ADD COLUMN is instant in PostgreSQL — no table rewrite. UPDATE for backfill may take seconds. |
| Function updates required BEFORE policies | 🔴 HIGH | Functions must be rewritten to propagate client_id. Requires code review. |
| Rollback is more complex — must DROP COLUMN | 🟡 MEDIUM | Separate rollback scripts needed per table. |

### This phase will be planned in a separate N002-B task when approved.

---

## Success Criteria (Phases 1–3)

| Criterion | How Verified |
|-----------|-------------|
| 108 policies created across 27 tables | `SELECT COUNT(*) FROM pg_policies WHERE policyname LIKE 'n002_%'` = 108 |
| All policies are PERMISSIVE | `SELECT DISTINCT permissive FROM pg_policies WHERE policyname LIKE 'n002_%'` = `PERMISSIVE` |
| All policies target `authenticated` role | `SELECT DISTINCT roles FROM pg_policies WHERE policyname LIKE 'n002_%'` = `{authenticated}` |
| `postgres` role reads all data unaffected | COUNT queries on all 27 tables return expected row counts |
| Backend routes return same results | Run key queries from finance.js, sales.js, insights.js via `execute_sql` |
| No function errors | Call `refresh_finance_snapshots()` and verify no error |
| Zero application downtime | Backend uses `postgres` (bypassrls) — zero impact |

---

## Risk Matrix (All Phases)

| # | Risk | Phase | Level | Impact | Probability | Mitigation |
|---|------|:-----:|:-----:|--------|:-----------:|-----------|
| R1 | Backend unaffected (bypassrls) | 1-3 | ✅ NONE | None | 0% | Architectural guarantee |
| R2 | Policy syntax error | 1-3 | 🟢 LOW | SDK clients blocked | Low | Validation queries; rollback < 1s |
| R3 | `ai_usage_logs` uuid cast fails | 3 | 🟡 MED | 1 table policy fails | Low | Test cast in validation query first |
| R4 | `refresh_*` functions fail after Phase 5 | 5 | 🔴 HIGH | ETL pipeline breaks | Medium | Functions updated before policies |
| R5 | View behavior change for SDK clients | 1-3 | 🟢 LOW | Future SDK queries affected | Low | No SDK clients exist today |
| R6 | `rls_auto_enable` event trigger interference | ALL | 🟢 LOW | New tables get RLS auto-enabled | Very Low | Function only enables RLS, doesn't create policies |

---

*Execution plan generated by Antigravity — Engineering Execution Agent*
*Based on live evidence from n002_security_architecture.md. No new database queries required.*
