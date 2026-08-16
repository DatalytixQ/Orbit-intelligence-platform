# N002 Phase 3 — Readiness Review

**Task:** N002 Phase 3 (Config, Audit & AI Tables)
**Wave:** 0D
**Date:** 2026-07-13

---

## 1. Context & Scope

Phase 3 is the final step in securing the Category A tables (tables that natively contain a `client_id` column) before moving on to Phase 5 schema evolutions.

### Tables in Scope (8 tables, 32 policies)
1. `ar_settings`
2. `client_config`
3. `inventory_settings`
4. `sales_settings`
5. `alert_config`
6. `inventory_category_settings`
7. `audit_log`
8. `ai_usage_logs`

### Pre-requisites Status
- **N001 (clients, app_users):** ✅ COMPLETED (8 policies)
- **N002 Phase 1 (Core Business):** ✅ COMPLETED (40 policies)
- **N002 Phase 2 (Analytics & Intelligence):** ✅ COMPLETED (36 policies)
- **Total Policies in Database:** 84

---

## 2. Technical Assessment

### Standard Policy Application
For 7 of the 8 tables, the standard RLS policy expression is safe to use:
```sql
USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
```

### Exception Handling (`ai_usage_logs`)
The `ai_usage_logs` table requires special handling. As documented in the execution strategy, the `client_id` column in `ai_usage_logs` is of type `uuid`, not `text`. 

The `->>` operator on JSONB returns `text`. Comparing `uuid` to `text` directly will result in a PostgreSQL type mismatch error (`operator does not exist: uuid = text`). 

**Required Policy Adjustment:**
The `client_id` column must be explicitly cast to `text` in the policy definition for `ai_usage_logs` only:
```sql
USING (client_id::text = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
```

### Risk Profile
- **Severity:** 🟢 LOW (metadata only)
- **Rollback:** Instant via `DROP POLICY IF EXISTS`
- **Application Impact:** None (backend connects as `postgres` with `rolbypassrls = true`)

---

## 3. Engineering Verdict

### **VERDICT: GO WITH CONDITIONS**

Phase 3 is safe to execute, but the executor must strictly adhere to the following conditions:

1. **Type Safety on `ai_usage_logs`:** The SQL generation step MUST apply the `::text` cast to `client_id` for the `ai_usage_logs` table policies to prevent type mismatch errors.
2. **Apply & Rollback Files:** As with Phases 1 and 2, both `sql/n002_phase3_apply.sql` and `sql/n002_phase3_rollback.sql` must be generated and saved before execution.
3. **Table-by-Table Execution:** Execution must proceed table-by-table. If `ai_usage_logs` fails due to syntax or type errors, execution must stop immediately and the table must be rolled back.
4. **Final Validation Checkpoint:** After execution, a full validation run must be performed confirming exactly 116 total policies in the database (8 N001 + 40 Ph1 + 36 Ph2 + 32 Ph3).
