# PRODUCT GOVERNANCE

## 1. Product Tenets
1. **Evidence-Based Decisions**: Every architectural, UX/UI, or data decision MUST be backed by objective evidence (Playwright, TS compiler, DB schemas).
2. **Business Alignment**: No feature exists purely for technology's sake. Every dashboard must serve an executive persona (CEO, CFO, Supply Manager).
3. **Data Integrity**: The database is the absolute source of truth. The application layer is strictly a presentation and execution mechanism.

## 2. Feature Authorization
- **No Rogue Development**: New pages or endpoints may only be created if they fulfill an explicit requirement defined in `08_product_backlog.md`.
- **Zero Debt Tolerance**: Technical debt (console warnings, unused variables, `any` types) is strictly prohibited and must be eradicated during the active Stage, before Certification.

## 3. Product Modifications
- Modifications to existing business logic are prohibited unless explicitly triggered by a dedicated Wave.
- Visual modifications must respect the Enterprise Baseline (Slate + Indigo, 8px grid constraint).

## 4. Recommendation Governance
- **Review, Not Execute**: The system recommends reviews based on business rules; it does not issue execution commands.
- **Explainability**: Every UI recommendation must explain the triggering logic, confidence level, and data source.
- **Exception Framework**: Customer and supplier-specific exceptions always override global heuristics.
