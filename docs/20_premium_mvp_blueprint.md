# PREMIUM MVP BLUEPRINT

## 1. Objective
This Blueprint synthesizes the Executive Decision Architecture, Visual Hierarchy, Component Rationalization, Navigation Strategy, and Premium Benchmarks into a concrete Execution Plan.

> [!WARNING]
> No code implementation will begin until this Blueprint is formally APPROVED by the Executive User.

## 2. Information Architecture Restructuring
Currently, the application treats domains (Sales, Finance, Supply) as isolated peer tabs. 
**Future State**: A Hub-and-Spoke drill-down architecture.
- **Hub**: `/` (Home Dashboard) containing Level 1 KPIs for all domains.
- **Spokes**: `/sales`, `/finance`, `/inventory`, `/supply` will act as Level 5 deep-dives specifically engineered to resolve the alerts raised on the Hub.

## 3. Global Layout Architecture
### Current State
`[Left Sidebar (250px)] | [Data Content] | [DQBot Sidebar (300px)]`
*Result: Extreme horizontal compression and dense, hard-to-read charts.*

### Future Premium State (Vercel/Linear Benchmark)
`[Left Navigation (200px)] | [Expansive Data Content (Max-Width 1400px)]`
- **DQBot Integration**: Transitioned from a 300px DOM reservation into an Intercom-style Floating Action Button (FAB) at `bottom-6 right-6`. Keyboard shortcut `CMD+K` or `/` opens a responsive chat overlay.
- **Progressive Disclosure**: Detailed tabular data (like Inventory SKUs) will hide rows beyond the Top 5. An "Expand Table" or "View All Details" button will be introduced.

## 4. Page Hierarchy Execution Mapping

### A. HOME
- **Level 1**: Business Health Score (Softened UI).
- **Level 2**: Sales Run-Rate / Cash Flow Summary.
- **Level 3 & 4**: "Alert: Inventory Turnover dropped 15% -> [Drill to Inventory]".
- **Level 5**: Remove existing raw alert tables from Home entirely.

### B. SALES
- **Level 1**: "Gap a Meta Mensual" (Target Gap).
- **Level 5**: Expand the `SalesTrendChart` to 100% width. Reduce the visual weight of the bar chart legends.

### C. FINANCE
- **Level 1**: Capital at Risk (>90 Days Overdue).
- **Level 5**: Demote the raw aging buckets bar chart. Promote the "Risk Customers" table.

### D. INVENTORY & SUPPLY
- **Level 1**: Immobilized Capital ($) / Revenue at Supply Risk ($).
- **Level 5**: Exploit the reclaimed DQBot space to render the 6-column `Estado de cobertura` table without text wrapping or truncation.

## 5. Interaction Model
- **Alert Fatigue**: Eradicate all instances of `bg-red-500` fills. Use `bg-red-50` with `border-red-200` and `text-red-700`.
- **Typography**: Eliminate ALL CAPS headers. Scale `Geist` up for Level 1 metrics and scale `Inter` down for Level 5 tables.

> [!IMPORTANT]
> **EXECUTIVE APPROVAL REQUIRED**
> Review this Premium MVP Blueprint. Once APPROVED, execution will proceed page-by-page starting exclusively with **HOME**, followed by a strict STOP validation.
