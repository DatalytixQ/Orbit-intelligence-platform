# ETL Orchestration Evaluation: n8n vs pg_cron

## Objective
Evaluate the most appropriate tool for scheduling and orchestrating the operational pipeline (ERP -> RAW -> STG -> Business -> Semantic).

## Options Evaluated

### Option A: pg_cron
`pg_cron` is a simple cron-based job scheduler for PostgreSQL that runs as an extension inside the database.

**Pros:**
- Native to PostgreSQL / Supabase.
- Zero additional infrastructure required.
- Extremely low latency (runs directly in the DB).
- Easy to manage via SQL.

**Cons:**
- Limited observability (basic log table).
- Difficult to handle complex retry logic or external API integrations (e.g., sending an email or Slack alert on failure, though webhooks exist).
- Harder to visualize dependencies visually.

### Option B: n8n
`n8n` is a fair-code, self-hosted or cloud-hosted workflow automation tool.

**Pros:**
- Visual workflow builder.
- Excellent observability and debugging UI.
- Native integrations with hundreds of external services (Slack, Email, ERP APIs).
- Easy conditional logic and branching.

**Cons:**
- Requires hosting a separate container/service.
- Adds network latency (external service connecting to the DB).
- Adds operational overhead (managing the n8n instance).

## Recommendation
Since the ERP Intelligence Foundation aims to be self-contained within Supabase as much as possible, and all ETL functions (`refresh_*`) are already encapsulated as PL/pgSQL functions within the database, **`pg_cron` is the recommended primary scheduler.**

`n8n` should only be introduced if/when the system needs to orchestrate external API calls (e.g., pulling data from an external REST API instead of reading from a replicated database schema) or requires complex external alerting that cannot be handled via Supabase Edge Functions.

### Implementation Next Steps (pg_cron)
1. Enable `pg_cron` extension in Supabase.
2. Schedule a master function `refresh_all()` or schedule individual domains.
3. Use the newly created `data_pipeline_step_log` to monitor execution success/failure instead of relying solely on `cron.job_run_details`.
