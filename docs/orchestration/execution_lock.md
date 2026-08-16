# Execution Lock

**Purpose:** Prevents race conditions and duplicate executions by ensuring only one Orchestrator thread/agent can modify state at a given time.

## Lock Acquisition
Before modifying `checkpoint_state.yaml` or dispatching a prompt:
1. The Supervisor reads `runtime_state.yaml` -> `execution_lock_holder`.
2. If `None`, the Supervisor writes its Agent ID / Thread ID to `execution_lock_holder`.
3. If not `None`, the Supervisor checks `last_heartbeat`. If `last_heartbeat` is older than 15 minutes, the lock is assumed stale (dead agent) and can be forcibly acquired.

## Lock Release
Upon completing a state transition, saving a file, or hitting a Human Gate:
1. The Supervisor resets `execution_lock_holder` to `None`.
2. The Runtime Controller syncs the file to disk.

**CRITICAL:** Failure to release a lock will stall the autonomous pipeline.
