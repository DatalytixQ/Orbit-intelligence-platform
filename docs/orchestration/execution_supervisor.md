# Execution Supervisor

**Role:** The overarching intelligence governing the orchestration loop.

The Execution Supervisor replaces the manual step-by-step dispatch. It is the ONLY component authorized to execute roadmap tasks.

## Operational Lifecycle

1. **Read Checkpoint:** Interrogates `checkpoint_state.yaml` for the current position in the roadmap.
2. **Read Runtime State:** Interrogates `runtime_state.yaml` for the live environment conditions.
3. **Acquire Execution Lock:** Consults `execution_lock.md` to guarantee mutual exclusion and prevent race conditions or double-execution.
4. **Preflight Validation:** Evaluates `preflight_checklist.yaml` to guarantee dependencies, MCP connectivity, and model availability.
5. **Cost Estimation:** Approximates token limits and credit thresholds before launching the prompt based on `execution_budget.yaml`.
6. **Context Assembly:** Aggregates context based exactly on `context_routing.yaml`.
7. **Model Selection:** Forces the cheapest available model (Gemini Flash default) as per `model_routing.yaml`.
8. **Execute Task:** Dispatches the bounded prompt to the selected LLM.
9. **Validate Outputs:** Automatically evaluates the outputs against the `task_contracts.yaml`.
10. **State Commitment:** Updates `checkpoint_state.yaml`, `runtime_state.yaml`, and `execution_log.md`.
11. **Next Task Dispatch:** Automatically determines and queues the next step unless a Human Gate is hit.
