# Gate Definitions

Human-in-the-loop gates represent mandatory pauses in autonomous execution. The Orchestrator MUST halt, set state to `Waiting Human`, and await explicit confirmation.

## 1. Approve Execution (Gate Type: `execution`)
- **When used:** Before starting any new Wave, or before starting a High/Critical complexity task.
- **Trigger:** `human_gate` defined in `task_contracts.yaml` or `requires_user_approval: true` in `execution_manifest.yaml`
- **User Action:** User must reply with "Approve execution", "GO", or equivalent.

## 2. Approve Migration (Gate Type: `migration`)
- **When used:** Before applying DDL or schema evolution changes.
- **Trigger:** Tasks categorized as Phase 5 Schema Evolution.
- **User Action:** User must review the generated `.sql` artifact and reply with "Approve migration".

## 3. Approve Schema (Gate Type: `schema`)
- **When used:** When a new table or structural architectural change is proposed.
- **Trigger:** Document generation of architecture specifications.
- **User Action:** User must reply with "Approve schema".

## 4. Approve Production (Gate Type: `production`)
- **When used:** Before merging branches or finalizing major deployments.
- **Trigger:** End of Milestone / End of Wave.
- **User Action:** User must reply with "Approve production".

## Standard Responses (Overrides)
At any human gate, the user may issue the following command overrides:
- **Stop:** Halts the Orchestrator entirely. State remains `Paused`.
- **Rollback:** Instructs the Orchestrator to immediately execute the rollback mechanism for the current context.
- **Continue:** Equivalent to approval, proceeds with the current default path.
