# Heartbeat Policy

**Purpose:** To prevent the orchestration loop from hanging indefinitely due to silent agent failures or MCP timeouts.

## Rules

1. **Heartbeat Interval:** During any execution task that is expected to take longer than 1 minute, the Runtime Controller MUST update `runtime_state.yaml` `last_heartbeat` every 5 minutes.
2. **Stale Execution Detection:** If the `last_heartbeat` is older than 15 minutes and the state is NOT `Waiting Human` or `Paused`, the Execution Supervisor will flag a `Fatal Error` and forcibly release the `execution_lock`.
3. **Dead Letter Queue:** Any task that triggers a stale heartbeat twice in a row is automatically marked as `Failed` in `checkpoint_state.yaml` and skipped, with a warning raised to the Human Gate.
