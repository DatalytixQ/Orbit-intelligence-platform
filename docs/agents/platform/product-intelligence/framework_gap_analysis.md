# Orchestration Framework Gap Analysis

**Date:** 2026-07-13
**Purpose:** Compare the new Orchestration Framework v1 (`docs/orchestration/`) against the existing legacy execution documents (`docs/agents/platform/product-intelligence/`) to identify redundancies, obsolescence, and merge candidates.

## 1. Duplicates & Overlaps

- **`project_state.md` vs. `checkpoint_state.yaml` + `execution_log.md`**
  - **Issue:** `project_state.md` manually tracks the current active phase and completed milestones. This is now fully duplicated by the machine-readable `checkpoint_state.yaml` (for active state) and `execution_log.md` (for history).
- **`execution_queue.md` vs. `execution_manifest.yaml`**
  - **Issue:** The queue is a Markdown table representing tasks. The manifest handles this natively in YAML, allowing programmatic state transitions.

## 2. Obsolete Documents (To Archive)

The following documents represent manual orchestration patterns that are replaced by the new automated framework:

- **`master_execution_plan_v2.md`**: Superseded entirely by `execution_manifest.yaml`.
- **`wave_execution_map.md`**: Superseded by the `dependencies` and `allowed_transitions` logic in `execution_manifest.yaml`.
- **`orchestrator_task_schema.md`**: Superseded by the implicit schema of `execution_manifest.yaml` and the rules in `execution_rules.md`.
- **`execution_authorization.md`**: A manual artifact replaced by the standardized `gate_definitions.md` and `prompt_templates/gate_prompt.md`.
- **`execution_readiness_review.md`**: A manual artifact replaced by the standardized `prompt_templates/readiness_prompt.md`.

## 3. Recommended Merges

- **Legacy Execution Reports & Validations (`n001_*`, `n002_*`)**
  - **Action:** Merge summaries into `execution_log.md` and archive the individual markdown files to clean up the directory. The framework relies on `validation_file` outputs defined in the manifest.
- **Product Architecture Documents (`database_ground_truth.md`, `unified_product_graph.md`, `reconciliation_report.md`, `n002_security_architecture.md`)**
  - **Action:** Do not merge. These remain valid system context documents that the Orchestrator will feed to the `execution_prompt.md` depending on the active task.

## 4. Missing Documentation in New Framework

- **Context Feeding Strategy:** The framework lacks a defined mechanism (`context_routing.yaml`) to specify *which* background documents (e.g., `unified_product_graph.md`) should be injected into the `execution_prompt.md` for specific tasks.
- **Agent Roles:** While `model_routing.yaml` defines LLMs, there is no explicit mapping of the legacy "Agent" (e.g., Database Agent, Backend Agent) to the new prompt templates.

## Summary Conclusion
The legacy `product-intelligence` folder contains 5 major planning/state documents that should be frozen and migrated to the `docs/orchestration/` YAML definitions. Future execution should rely exclusively on the `execution_manifest.yaml` and `checkpoint_state.yaml`.
