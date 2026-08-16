# Recovery & Resumption Protocol

This document defines exactly how execution resumes following an interruption, crash, pause, or human gate.

## The Prime Directive
- **No duplicated work:** The Orchestrator MUST NEVER re-execute a task, SQL script, or document generation that has already completed successfully.
- **Single Source of Truth:** `checkpoint_state.yaml` dictates the exact point of resumption.

## Resumption Sequence

1. **Read Checkpoint:** The Orchestrator reads `checkpoint_state.yaml`.
2. **Read Log:** The Orchestrator reads the last 5 entries of `execution_log.md` to gain context.
3. **Verify State:** 
   - If the checkpoint claims a file was generated, the Orchestrator MUST verify the file exists on disk.
   - If the checkpoint claims SQL was executed, the Orchestrator MUST NOT re-run it. It assumes success based on the log, or runs a non-mutating validation query.
4. **Identify Next Step:** Based on `step` in the checkpoint, load the next instruction from the prompt templates.
5. **Resume:** Change status from `Waiting Human` or `Paused` to `Running` and dispatch the task.

## Rules for Code & SQL
- **Never rerun completed SQL:** If `n002_phase2_apply.sql` is marked complete in the execution log, do not run it again.
- **Never regenerate completed documents:** If `n002_phase2_validation.md` exists and is marked complete, do not rewrite it unless specifically instructed by a new task.

## Corrupted State Recovery
If `checkpoint_state.yaml` is corrupted or out of sync with actual files/database:
1. Halt execution.
2. Alert the user with a `State Mismatch` warning.
3. Require manual user intervention to reconcile the checkpoint with reality.
