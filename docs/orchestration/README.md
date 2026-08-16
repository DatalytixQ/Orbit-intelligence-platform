# Antigravity Orchestration Framework v1

This directory contains the permanent orchestration framework for Antigravity, transforming it from a sequential task executor into a state-driven autonomous system.

## Components

- **`execution_manifest.yaml`**: The source of truth for the entire roadmap, dependencies, waves, and completion criteria.
- **`checkpoint_state.yaml`**: The live, resumable state file of the current execution.
- **`model_routing.yaml`**: Intelligent mapping of task types to LLM tiers based on capability vs cost.
- **`execution_rules.md`**: Core operational logic for running, verifying, and recovering execution.
- **`gate_definitions.md`**: Human-in-the-loop approval definitions.
- **`retry_policy.md`**: Error handling and mitigation logic.
- **`recovery.md`**: Strict instructions for resuming safely without duplicate work.
- **`execution_log.md`**: Append-only log of historical operations.
- **`prompt_templates/`**: Standardized prompts for specific agentic actions (execution, validation, rollback).

## Operating Principle

1. Agents never choose what to do next based on unstructured text analysis.
2. The Orchestrator reads `checkpoint_state.yaml` to determine exactly where it left off.
3. The Orchestrator reads `execution_manifest.yaml` to find the next valid transition.
4. The Orchestrator checks `gate_definitions.md` to ensure human approval constraints are met.
5. The Orchestrator dispatches a specific template from `prompt_templates/` mapped to the model defined in `model_routing.yaml`.
6. Results are validated. Success updates `checkpoint_state.yaml` and `execution_log.md`. Failure triggers `retry_policy.md`.
