# State Integrity 

**Purpose:** Ensure YAML and Markdown orchestration files remain uncorrupted during multi-agent concurrent access.

## Validation Mandates
1. **YAML Parsing:** Every write to `checkpoint_state.yaml`, `runtime_state.yaml`, or `execution_manifest.yaml` MUST result in valid YAML. The Runtime Controller must verify parsing immediately after a write.
2. **Atomic Writes:** Updates to state files must be written entirely; partial writes are not allowed.
3. **Log Truncation Prevention:** `execution_log.md` is strictly append-only. Any attempt to overwrite or delete historical lines is a framework violation.
4. **Context Boundary:** `context_routing.yaml` defines the maximum allowable state context. If a file exceeds 1000 lines, it must be summarized, and the raw file shifted to `ARCHIVED` status to protect token limits.
