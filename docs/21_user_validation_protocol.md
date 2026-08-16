# USER VALIDATION PROTOCOL

## 1. Objective
To guarantee that the MVP remains permanently working and executive-grade, no page implementation may continue without explicit User Approval.

## 2. Mandatory Validation Checklist
Before presenting a page to the Product Owner for approval, the Agent must autonomously verify:
- [ ] **Build**: `npm run build` passes.
- [ ] **TypeScript**: `npx tsc --noEmit` passes.
- [ ] **Lint**: `npm run lint` passes.
- [ ] **API Contracts**: 200 OK from Backend.
- [ ] **Runtime**: Next.js & Express active.
- [ ] **Playwright**: `npx playwright test` passes.
- [ ] **Browser**: No console errors or hydration mismatches.
- [ ] **Visual Diff**: Screenshots confirm structural integrity.
- [ ] **Regression**: Other pages did not break.

## 3. Executive Review Presentation
The agent must generate an Executive Validation Report for the user containing:
1. What changed.
2. Why it changed.
3. What executive problem was solved.
4. Expected decision improvement.
5. Expected reduction of cognitive load.
6. Before/After screenshots.

Only upon receiving an explicit "APPROVED" may the Agent advance to the next page.
