# Framework Cleanup Report

**Date:** 2026-07-13
**Reviewer:** Chief Software Architect / Autonomous Orchestrator

## Legacy Documentation Review & Classification

This document details the cleanup and classification of the legacy `docs/agents/platform/product-intelligence/` directory.

| File | Classification | Reason | Migration Path | Risk |
|------|----------------|--------|----------------|------|
| `master_execution_plan_v2.md` | **DEPRECATE** | Replaced by `execution_manifest.yaml`. | Use YAML manifest for routing. | Low |
| `wave_execution_map.md` | **DEPRECATE** | Logic moved to manifest dependencies. | Use manifest allowed_transitions. | Low |
| `project_state.md` | **DEPRECATE** | State now lives in `checkpoint_state.yaml`. | Use checkpoint for current task tracking. | Low |
| `execution_queue.md` | **DEPRECATE** | Queuing handled by manifest and state transitions. | Use manifest status fields. | Low |
| `orchestrator_task_schema.md` | **ARCHIVE** | Task schema replaced by `task_contracts.yaml`. | Archive for historical reference. | Low |
| `execution_authorization.md` | **ARCHIVE** | Approvals replaced by `gate_definitions.md`. | Archive for compliance history. | Low |
| `execution_readiness_review.md` | **ARCHIVE** | Replaced by `prompt_templates/readiness_prompt.md`. | Archive for compliance history. | Low |
| `n001_execution_report.md` (and other legacy reports) | **ARCHIVE** | Reports stored for execution history but not actively routed. | Summarized in `execution_log.md`. | Low |
| `database_ground_truth.md` | **ACTIVE** | Pure contextual intelligence. | Injected via `context_routing.yaml`. | None |
| `unified_product_graph.md` | **ACTIVE** | Master context for product capability. | Injected via `context_routing.yaml`. | None |
| `reconciliation_report.md` | **ACTIVE** | Master gap analysis. | Injected via `context_routing.yaml`. | None |
| `n002_security_architecture.md` | **ACTIVE** | Security blueprint for execution reference. | Retained for Wave 0 execution context. | None |
| `framework_gap_analysis.md` | **ARCHIVE** | One-time analysis document superseded by this report. | Archive. | Low |

### Actions Taken
- Appended DEPRECATION headers to legacy state and planning files, redirecting future agent invocations to the orchestration folder.
- Retained context files as ACTIVE for prompt injection.
- Archived reports to preserve execution history without polluting context limits.
- No files were deleted.
