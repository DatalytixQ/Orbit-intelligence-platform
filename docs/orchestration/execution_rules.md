# Execution Rules

These rules govern the autonomous execution of the Antigravity Orchestrator.

## 1. How Execution Works
- The Orchestrator does not guess what to do next. It reads `checkpoint_state.yaml`.
- If the state is `Running`, it executes the current Task.
- If the state is `Waiting Human`, it halts and prompts the user.
- If the state is `Completed`, it looks up the next valid transition in `execution_manifest.yaml`.

## 2. How Checkpoints Work
- Before any file write or SQL execution, `checkpoint_state.yaml` MUST be updated.
- Updates must include the exact filenames of artifacts about to be generated (e.g., `current_rollback_file`).
- Checkpoints act as the only source of truth for resumption.

## 3. How Resumptions Work
- When invoked, the Orchestrator first loads `checkpoint_state.yaml`.
- It cross-references the current step with `execution_log.md` to avoid duplicating work.
- It loads context strictly mapped to the current task in `execution_manifest.yaml`.
- See `recovery.md` for detailed rules.

## 4. How Failures Work
- Any error (SQL failure, test failure, lint failure, MCP timeout) immediately updates `checkpoint_state.yaml` status to `Failed`.
- The Orchestrator references `retry_policy.md` to determine if automatic mitigation is allowed.
- If automatic mitigation fails or is not allowed, it halts and changes state to `Waiting Human`.

## 5. How Validation Works
- Every task MUST define a validation criterion.
- Database tasks MUST execute `SELECT` counts or test inserts.
- Backend tasks MUST run tests or verify endpoint responses.
- Documentation tasks MUST pass markdown linting.
- Validation results are written to the file specified in `execution_manifest.yaml` (e.g., `validation_file`).

## 6. How Rollback Works
- All destructive operations (DDL, DML, file replacements) MUST have a corresponding rollback mechanism generated *before* execution.
- If execution fails mid-task, the Orchestrator MUST execute the rollback file specified in `checkpoint_state.yaml`.
- The rollback must be idempotent (e.g., `DROP POLICY IF EXISTS`).
- A successful rollback resets the task status to `Not Started` and the overall state to `Waiting Human`.
