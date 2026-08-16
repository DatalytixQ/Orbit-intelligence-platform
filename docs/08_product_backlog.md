# PRODUCT BACKLOG & DEBT REGISTRY

## 1. TECHNICAL DEBT (To be addressed in Campaign 10/11)
- **Hardcoded References**: Several backend views and frontend queries currently use mocked thresholds or static dates (e.g. `current_date - interval '30 days'`) instead of dynamically reading from `config_business_policies`.
- **API Modularity**: The backend currently serves highly specific aggregated views rather than modular queries.
- **Missing Contexts / 404s**: Some navigation links from the Executive Home drill-downs lead to missing components (to be resolved in Campaign 09: DQBot & Contexts).

## 2. UX / DESIGN DEBT (To be addressed in Campaign 13)
- **Responsive Integrity**: Deep-dive tables (Level 5) are not fully optimized for mobile viewports.
- **Slide-overs**: Detailed slide-over panels are missing across multiple campaigns (e.g. Sales, Finance). Users are redirected to raw tables instead of contextual side-panels.
- **Legacy Components**: Some legacy Tailwind components (from pre-Release 1.0) need refactoring to match the Premium MVP standard.

## 3. PENDING CAPABILITIES (Future Phases)
**Campaign 06 & 03.5 Follow-ups:**
- Refine Supply Proactive Risk Management thresholds (60 days vs backlog).
- Implement interactive drill-downs in DSO Analytics Executive View.

**Campaign 07 & 09 (AI Integration):**
- Activate the `DQBot` persistent assistant globally using the floating action button (FAB).
- Implement the AI recommendation engine evaluating real-time exception frameworks from the database.
