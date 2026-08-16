# COMPONENT RATIONALIZATION

## 1. Audit Framework
Every existing UI component has been evaluated against the Executive Decision Architecture and classified to enforce minimal cognitive load.

## 2. Component Inventory & Verdicts

### `AssistantPanel` (DQBot)
- **Classification**: Noise (in current fixed state).
- **Verdict**: **MOVE & COLLAPSE**. The fixed sidebar steals 25% of the horizontal grid. It will be converted into a Floating Action Button (FAB) that expands into a popover.

### `BusinessHealthScore` (Home)
- **Classification**: Mission Critical.
- **Verdict**: **KEEP but MODIFY**. The aggressive red/pink background is visually exhausting. It will be softened to a semantic tint while maintaining the large Level 1 KPI typography.

### `ExecutiveInsightsPanel` (Home)
- **Classification**: Useful.
- **Verdict**: **MERGE**. Combine the list of raw alerts into an aggregated "Action Required" counter, pushing the raw tables to a drill-down view.

### `SalesTrendChart` (Sales)
- **Classification**: Secondary.
- **Verdict**: **KEEP**. Expand width by utilizing the space recovered from DQBot. Demote visual weight of the legend.

### `InventoryKPI` / Top Inmovilizados
- **Classification**: Mission Critical.
- **Verdict**: **KEEP**. Horizontal width must be expanded to prevent truncation of critical SKUs. Add progressive disclosure (show top 5, hide the rest behind "View All").

### `FinanceAgingBarChart`
- **Classification**: Useful.
- **Verdict**: **KEEP**. But promote the "$ Risk" number to Level 1, leaving the chart as Level 5 proof.

## 3. Strict Deletion Rule
Any component marked as "Decorative" or "Duplicate" will be hard-deleted from the repository. We do not maintain dead code.
