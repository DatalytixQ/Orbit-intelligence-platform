# Runtime Rules v1.2

1. **No Duplicate Execution:** Under no circumstances shall an artifact be rewritten or a SQL script re-executed if it is logged as COMPLETED in `execution_log.md`.
2. **Cheapest Model First:** The Supervisor MUST select Gemini 1.5 Flash unless the complexity (as defined in `execution_heuristics.yaml`) explicitly justifies an escalation. Every escalation must be documented.
3. **YAML Over Markdown:** When generating status or state updates, prefer YAML to minimize token parsing overhead.
4. **Mandatory Synchronization:** `checkpoint_state.yaml`, `runtime_state.yaml`, and `execution_log.md` must be synchronized sequentially. A failure to sync any one file invalidates the state transition.
5. **No Blind Resumes:** The Runtime Controller must verify the actual presence of files on disk before trusting the checkpoint state during a resume operation.
6. **Token Minimization:** Context injection is strictly governed by `context_routing.yaml`. Documents that have already been summarized into `execution_log.md` must not be reloaded in full.
