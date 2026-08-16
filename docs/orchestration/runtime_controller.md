# Runtime Controller

**Role:** The mechanical engine responsible for low-level state persistence, recovery, and interrupt handling.

While the Execution Supervisor handles logic and task routing, the Runtime Controller enforces physical rules of execution.

## Responsibilities

1. **Interrupt Handling:** If execution stops unexpectedly (e.g., credit exhaustion, MCP timeout, network drop), the Runtime Controller ensures `runtime_state.yaml` is safely synced to disk before memory is flushed.
2. **State Integrity:** Enforces `state_integrity.md` rules, ensuring no YAML file becomes corrupted.
3. **Heartbeat Management:** Enforces `heartbeat_policy.md`, updating a timestamp lock every 5 minutes during long-running tasks.
4. **Rollback Execution:** If a validation failure occurs, the Runtime Controller executes the pre-defined rollback script exactly as instructed by the `task_contracts.yaml`, without requesting human permission for the rollback itself (unless it's a catastrophic data destruction risk).

## Recovery Workflow
On wake-up, the Runtime Controller:
1. Verifies the last modified timestamp of `checkpoint_state.yaml`.
2. Cross-references it against `execution_log.md`.
3. Ensures no artifacts defined in the contract are missing or partially written.
4. If corruption is detected, it falls back to the previous successful state and prompts a `Waiting Human` error.
