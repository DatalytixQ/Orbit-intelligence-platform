# Framework Validation Report

**Date:** 2026-07-13
**Purpose:** Detect and report inconsistencies across the orchestration framework configuration files.

## 1. Identified Inconsistencies

### A. Gate Definitions vs Execution Manifest
- **Location:** `gate_definitions.md` (Gate 1: Approve Execution)
- **Issue:** The trigger rule states `requires_user_approval: true in master_execution_plan_v2.md`.
- **Inconsistency:** `master_execution_plan_v2.md` is deprecated. The rule should point to `execution_manifest.yaml` (e.g., checking if a task has a `human_gate` defined in `task_contracts.yaml`).

### B. Model Routing vs Prompt Templates
- **Location:** `model_routing.yaml` and `prompt_templates/`
- **Issue:** `model_routing.yaml` defines activities like "Planning", "Validation", "Large documentation", etc. However, the system prompts are named `execution_prompt.md`, `validation_prompt.md`, `documentation_prompt.md`, `resume_prompt.md`.
- **Inconsistency:** There is no strict 1:1 binding between the activity names in the model router and the prompt templates used by the orchestrator.

### C. Execution Manifest vs Checkpoint State
- **Location:** `execution_manifest.yaml` vs `checkpoint_state.yaml`
- **Issue:** `execution_manifest.yaml` defines tasks as strings (e.g., "N002"). `checkpoint_state.yaml` defines the task location as `task: "N002"`. This is technically consistent, but the manifest does not explicitly map `step` (like "Phase 3 Execution"), leaving `step` definitions implicit.

### D. Recovery vs Retry Policy
- **Location:** `recovery.md` and `retry_policy.md`
- **Issue:** Both documents mention checking the log and handling resumes. `retry_policy.md` states "Wait for developer to resume via the `resume_prompt.md`", whereas `recovery.md` implies the orchestrator can autonomously reload the checkpoint state. They are functionally compatible but slightly overlapping in scope regarding human resumption.

## 2. Conclusion
The framework is structurally sound but requires minor reference updates (especially removing legacy mentions of `master_execution_plan_v2.md` from `gate_definitions.md`). The Prompt Template to Model Routing connection needs a formal mapping layer (which could be handled by `context_routing.yaml` or an updated `model_routing.yaml`).
