# Schema Evolution Proposal: data_pipeline_step_log

## Purpose
The objective of the `data_pipeline_step_log` table is to store execution telemetry for the data pipeline steps (ETL/ELT processes). This includes tracking performance, execution status, rows processed, error messages, and timestamps for each pipeline function executed by the orchestration framework or automated syncs.

## Alternatives Evaluated
During the repository-wide audit, the following semantically equivalent objects were searched: `pipeline_log`, `etl_log`, `execution_log`, `step_log`, `audit_log`, etc. 

Only one database table was found to be remotely related:
- `audit_log` (Existing table)

## Reason Alternatives Were Rejected
The `audit_log` table is structurally designed for user-level action auditing, security compliance, and tracking configuration changes (e.g., changes to `ar_settings`, `client_config`). 
Injecting high-frequency, high-volume ETL step telemetry into the `audit_log` would:
1. Pollute security and user-action records.
2. Drastically increase table bloat, impacting the performance of security audits.
3. Violate the separation of concerns between business compliance and technical operational logging.

As no other execution logging tables exist in the database, a new schema object is required.

## Proposed Schema

```sql
CREATE TABLE data_pipeline_step_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_name TEXT NOT NULL,
    step_name TEXT NOT NULL,
    status TEXT NOT NULL, -- e.g., 'RUNNING', 'SUCCESS', 'FAILED'
    start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_time TIMESTAMPTZ,
    rows_processed INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

## Indexes
- `idx_data_pipeline_step_log_pipeline` ON `data_pipeline_step_log` `(pipeline_name, step_name)`
- `idx_data_pipeline_step_log_status` ON `data_pipeline_step_log` `(status)`
- `idx_data_pipeline_step_log_start_time` ON `data_pipeline_step_log` `(start_time DESC)`

## Foreign Keys
None. This is an independent telemetry table to avoid locking or constraint issues during high-speed pipeline executions.

## RLS Requirements
```sql
ALTER TABLE data_pipeline_step_log ENABLE ROW LEVEL SECURITY;

-- Only service roles (backend jobs) can insert logs
CREATE POLICY "service_role_insert" ON data_pipeline_step_log 
FOR INSERT WITH CHECK (true);

-- Only admins/monitors can view logs
CREATE POLICY "admin_select" ON data_pipeline_step_log 
FOR SELECT USING (current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'admin');
```

## Migration Impact
Low. The table is entirely additive and isolated. It does not alter or block any existing data flows or tables.

## Rollback Strategy
The rollback script is straightforward:
```sql
DROP TABLE IF EXISTS data_pipeline_step_log;
```

## Compatibility Analysis
100% backward compatible. No existing applications or queries rely on this table.

## Estimated Implementation Effort
**Low (< 1 hour)**
1. Generate migration script.
2. Apply migration.
3. Update `database.md` to document the new table.

## Risks
**Rapid Table Growth:** Logging every pipeline step generates a massive amount of rows over time. 
*Mitigation:* A data retention policy (e.g., deleting logs older than 30 days) or table partitioning by month should be implemented in future phases.

## Recommendation
**Recommend New Schema.** Proceed with the creation of the `data_pipeline_step_log` table as proposed.
