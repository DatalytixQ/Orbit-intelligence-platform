# Retry Policy

This document defines how the Orchestrator mitigates failures automatically.

## 1. If Credits Exhausted
- **Action:** Halt immediately.
- **State Update:** `checkpoint_state.yaml` status set to `Waiting Human`.
- **Mitigation:** Wait for developer to resume via the `resume_prompt.md`. Do not attempt to retry autonomously.

## 2. If MCP Timeout or Network Error
- **Action:** Retry.
- **State Update:** Status remains `Running`.
- **Mitigation:** Implement exponential backoff. Maximum 3 retries.
- **Failure Condition:** After 3 retries, set status to `Failed` and `Waiting Human`.

## 3. If Validation Fails
- **Action:** Rollback.
- **State Update:** Status set to `Failed`.
- **Mitigation:** 
  1. Automatically execute the `current_rollback_file` defined in `checkpoint_state.yaml`.
  2. Verify rollback success.
  3. Set status to `Waiting Human`.
  4. Output failure reason and rollback confirmation to user.

## 4. If Documentation Fails (Formatting/Linting)
- **Action:** Resume documentation only.
- **State Update:** Status remains `Running`.
- **Mitigation:** Do not rollback code or database changes. Retry the documentation generation step using a higher-tier model (e.g., Claude 3.5 Sonnet) to correct formatting errors. Maximum 2 retries.

## 5. If Schema Lock / Concurrency Error
- **Action:** Wait and Retry.
- **Mitigation:** Wait 5 seconds, attempt up to 3 times. If persistent, rollback and `Waiting Human`.
