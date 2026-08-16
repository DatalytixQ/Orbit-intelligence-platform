# Orchestration Framework v1.6 Release Notes

## Autonomous Schema Evolution Edition

### Overview
Framework v1.6 introduces fully autonomous schema evolution capabilities and a formalized Runtime Decision Engine, shifting the framework from static schema dependency to dynamic schema evolution management.

### Key Additions
1. **Schema Contracts (`schema_contracts.yaml`)**
   - Standardizes the format and lifecycle of schema evolution operations.
2. **Schema Workflow (`schema_workflow.yaml`)**
   - Defines the 8-step pipeline from discovery to proposal, approval, generation, execution, validation, documentation, and resumption.
3. **Runtime Decision Engine (`runtime_decision_engine.yaml`)**
   - Removes all implicit orchestrator behavior. Every decision (continue, retry, rollback, resume, stop, wait, request_schema_evolution) is explicitly mapped.
4. **Schema Governance (`schema_governance.yaml`)**
   - Establishes the hard boundaries of what the orchestrator can do to the database autonomously vs. what requires human intervention.
5. **Validation, Documentation & Rollback Policies**
   - Formalized scripts and rules for verifying and undoing schema changes seamlessly.

### Breaking Changes
- None. All v1.5 contracts remain valid.

### Security Notes
- Row Level Security (RLS) is now enforced programmatically for any newly created tables via `schema_governance.yaml`.
