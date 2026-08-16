# INTELLIGENCE PLATFORM PRODUCT OPERATING SYSTEM

## 1. Vision & Mission
**Vision**: To operate as a zero-latency, zero-debt Enterprise Intelligence platform that transforms raw financial and supply chain data into executive action.
**Mission**: Eliminate assumptions from decision-making through empirical, continuously validated data presentation.

## 2. Global Architecture
A decoupled monolith enforcing strict separation of concerns:
- **Presentation**: Next.js App Router (React Server Components)
- **Proxy**: Next.js API Routes (`/api`)
- **Service Layer**: Node.js Express Server
- **Data Engine**: PostgreSQL Materialized Views

## 3. Product Lifecycle & Governance
- **Wave Execution Policy**: Development is orchestrated in macroscopic Waves representing major business values (e.g., MVP, Premium UX, AI Integration).
- **Stage Execution Policy**: Waves are subdivided into precise Stages. No Stage may commence until the prior Stage produces an empirical Certification.
- **Continuous Product Operation**: Default mode of the repository when no active Wave is in progress. The application must remain 100% stable, fully built, and deployable at all times.

## 4. Executive Decision Principles
1. **Decision Support**: The platform supports executive decisions; it does not replace executive judgment.
2. **Explainability**: Recommendations must be fully explainable.
3. **Configurability**: Recommendations must be configurable via business policies.
4. **Policy Supremacy**: Business policies override generic heuristics.
5. **Exception Supremacy**: Customer-specific exceptions always take precedence over generic rules.
6. **Recommendation Structure**: Every recommendation must include: Why, Evidence, Confidence, and Business impact.
7. **AI Integration**: Future AI modules will consume the same policy framework instead of embedding business rules in prompts or code.

## 5. Campaign & Release Principles
8. **Campaign-Driven**: Development is Campaign-driven, not prompt-driven.
9. **Release Membership**: Every Campaign belongs to one Release.
10. **Acceptance Criteria**: Every Release has measurable acceptance criteria.
11. **Decision Logging**: Every important architectural or product decision must be documented in the Decision Log.
12. **Rollback Traceability**: Every Campaign produces a documented rollback checkpoint.
13. **Living Roadmap**: The roadmap is a living document, reflecting Now, Next, Later, Future.
14. **Heuristic Override**: Business policies override generic heuristics.
15. **Configuration Supremacy**: Customer configuration overrides generic behavior.
16. **Recommendation Verbs**: Recommendations explain evidence; they never issue commands.

## 6. Portfolio Management Principles
17. **Release Value**: Every Release must deliver measurable business value.
18. **Continuous Prioritization**: The Roadmap is continuously reprioritized.
19. **Campaign Mobility**: Campaigns may move between Releases as priorities shift.
20. **Traceable Cancellations**: Cancelled Campaigns remain historically traceable in the Archive.
21. **Executive Summaries**: Executive summaries must exist for every Release.
## 7. Campaign Execution Principles
22. **Manual Validation**: Every Campaign requires manual human validation in the browser.
23. **Visual Validation**: Every Campaign requires real screenshots from the running product.
24. **AI Visual Review**: Every Campaign requires AI visual review against Expected vs Actual results.
25. **Executive Sign-off**: Every Campaign requires executive approval before closure.
26. **Business Validation**: Campaigns close only after business validation, not just passing tests.
27. **Automated Documentation**: Documentation is updated automatically.
28. **Cumulative Knowledge**: The Knowledge Base is cumulative.
29. **Mandatory Rollback**: A Rollback checkpoint is mandatory for every Campaign.
30. **Database-First**: A relational database is the future source of truth. Markdown becomes generated documentation.

## 8. Policy Matrix
| Policy | Definition |
|--------|------------|
| **Quality Gates** | No commit merges without 0 Lint errors, 0 TS errors, 0 Console errors, and 100% Playwright passes. |
| **Recovery Policy** | If any gate fails, all feature development freezes. The agent enters MVP RECOVERY MODE. |
| **Rollback Policy** | If a visual or functional change breaks a route during a Stage, only the offending changes are reverted. The build MUST remain green. |
| **Release Policy** | Governed by `10_release_governor.md`. Requires 100% E2E test passage. |
| **Design Policy** | Governed by `05_design_system.md`. No inline styles. Strict usage of Semantic Tailwind Tokens. |
| **API Policy** | Governed by `06_api_contracts.md`. Strict Type bounding. No `any` casting allowed. |
| **Database Policy** | Governed by `07_database_ground_truth.md`. Application must only query Views (`vw_*`), never raw tables. |
| **UX Policy** | Action-first dashboards. Every chart must answer an executive question. |
| **Documentation Policy** | Zero redundant reports. Documentation represents the Operating System, not a history log. |
| **Regression Policy** | Every fix requires a full automated regression loop (`npm run build && npx playwright test`). |
| **Wave Execution Policy** | Modify ONLY one page per Wave. Simultaneous mass modifications are globally forbidden. |
| **Mandatory STOP Policy** | After each page is executed, the agent MUST STOP and request explicit User validation before continuing. |
| **Executive Information Budget** | Every page is capped at: 3 Primary KPIs, 2 Charts, 1 Table, 3 Alerts. Excess data MUST be drill-down. |
| **Validation Assets Policy** | Screenshots, Runtime validation, Build, Playwright, and Rollback points are strictly required before asserting a Wave is complete. |
| **AI Agent Policy** | Autonomous executions must respect all Quality Gates. No human intervention requested unless a catastrophic unresolvable blocker is encountered. |
