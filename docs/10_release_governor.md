# RELEASE GOVERNOR

## 1. Master Release Policy
No branch, feature, or stage can be authorized for release into Continuous Product Operation unless the following Quality Gates are mathematically verified.

## 2. Quality Gates Checklist
- [x] **Lint Pass**: `npm run lint` yields 0 errors.
- [x] **Type Safety**: `npx tsc --noEmit` yields 0 errors.
- [x] **Build Integrity**: `npm run build` succeeds without warnings.
- [x] **E2E Playwright**: `npx playwright test` covers all primary routes and yields 0 failures.
- [x] **Hydration Check**: Console interception catches 0 React Hydration mismatches.
- [x] **API Health**: No frontend route receives an HTTP 404, 401, or 500 response during initial load.

## 3. Governance Override
Any manual override of these gates immediately triggers **MVP RECOVERY MODE**.
