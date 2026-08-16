# Execution Authorization
**File:** `docs/agents/platform/product-intelligence/execution_authorization.md`
**Purpose:** Formal authorization record for Wave 0 Backend Track execution.
**Date:** 2026-07-04
**Authorized by:** User (explicit approval)
**Authorized agent:** Antigravity

---

## Authorization Statement

The user has explicitly approved execution of Wave 0 Backend Track tasks on 2026-07-04.

> *"I explicitly approve Wave 0 execution with the following constraint: START ONLY WITH BACKEND TRACK"*

---

## Authorized Scope

| Task | Title | File(s) Affected | Authorized |
|------|-------|-----------------|:----------:|
| **T001** | Extract `clientId` from JWT in `routes/ai.js` | `backend/routes/ai.js` | ✅ |
| **T002** | Extract `requireAuth` to `backend/middleware/auth.js` | `backend/middleware/auth.js` (NEW), `backend/routes/auth.js` | ✅ |
| **T005** | Validate `JWT_SECRET` at startup | `backend/app.js` | ✅ |

---

## Explicitly Excluded Scope

| Task | Title | Reason |
|------|-------|--------|
| **N001** | RLS policies on clients + app_users | ❌ NOT AUTHORIZED — awaiting separate approval |
| **N002** | RLS policies on all domain tables | ❌ NOT AUTHORIZED — awaiting separate approval |
| Any Supabase operation | — | ❌ NOT AUTHORIZED — no migrations, no schema changes |
| Any Wave 1–5 task | — | ❌ NOT AUTHORIZED — sequential gate not met |

---

## Pre-Execution Findings (from Readiness Review)

| Finding | Impact on Execution |
|---------|-------------------|
| `requireAuth` is defined ONLY in `routes/auth.js` — no other route uses it | T002 scope is clean: extract from one file, one existing usage to update |
| No other route file imports or defines `requireAuth` | T002 will NOT break any other route |
| `/api/ai/chat-v2` has NO auth middleware currently | T001 must add `requireAuth` as middleware AND read `req.user.client_id` |
| `clientId` fallback `\|\| "vonderk"` exists in `routes/ai.js` line 35 | T001 removes this fallback entirely |
| JWT_SECRET in `.env` is custom (not default) | T005 validation will pass on current environment |

---

## Acceptance Criteria (per execution_queue.md)

### T001
- [ ] `'vonderk'` string absent from `routes/ai.js`
- [ ] `req.user.client_id` used as `clientId` source
- [ ] Route is protected by `requireAuth` middleware
- [ ] Unauthenticated request to `/api/ai/chat-v2` returns 401

### T002
- [ ] `backend/middleware/auth.js` exists and exports `requireAuth`
- [ ] `routes/auth.js` imports `requireAuth` from middleware (no local definition)
- [ ] All routes that use `requireAuth` import from the shared module
- [ ] `PATCH /api/auth/change-password` still requires auth (regression check)

### T005
- [ ] Server logs a fatal error and exits if `JWT_SECRET === 'dev_secret_change_me'`
- [ ] Server logs a fatal error and exits if `JWT_SECRET` is undefined or empty
- [ ] Server starts normally with current `.env` JWT_SECRET value

---

## Execution Order

```
Step 1: T002 — Create backend/middleware/auth.js (prerequisite for T001)
Step 2: T001 — Update routes/ai.js (uses middleware from T002)
Step 3: T005 — Update backend/app.js (independent — JWT startup validation)
```

---

## Rollback Plan

| Task | Rollback Method |
|------|----------------|
| T001 | `git revert` or restore original `routes/ai.js` |
| T002 | Delete `backend/middleware/auth.js`, restore original `routes/auth.js` |
| T005 | `git revert` or restore original `backend/app.js` |

No database changes are made. Rollback is git-only.

---

## Post-Execution Gate

After T001, T002, T005 are complete:

- This document will be updated with execution results
- `project_state.md` will be updated
- **User must provide explicit approval before N001/N002 begin**
- N001/N002 (RLS policies) remain BLOCKED pending separate authorization

---

## Authorization Audit Trail

| Event | Timestamp | Actor |
|-------|-----------|-------|
| Wave 0 validation completed | 2026-07-04T07:35 | Antigravity |
| Readiness Review completed | 2026-07-04T07:49 | Antigravity |
| User approval received | 2026-07-04T08:01 | User |
| Execution authorization document created | 2026-07-04T08:02 | Antigravity |
| T002 executed | — | Antigravity |
| T001 executed | — | Antigravity |
| T005 executed | — | Antigravity |
| Post-execution report delivered | — | Antigravity |
