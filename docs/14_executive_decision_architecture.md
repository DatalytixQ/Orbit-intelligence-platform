# EXECUTIVE DECISION ARCHITECTURE

## 1. Objective
Transform every page from a "data display" into a focused "decision engine". Every page must answer exactly ONE executive question.

## 2. Page Architectures

### HOME
- **Primary Executive Persona**: CEO / Managing Director
- **Executive Question**: Should I worry about the business today?
- **Decision Supported**: Resource allocation and emergency intervention.
- **Primary KPI**: Business Health Score (0-100).
- **Secondary KPIs**: Active Critical Alerts, YTD Revenue vs Target.
- **Critical Actions**: Navigate to failing domain (e.g., Inventory if Health is low).
- **Business Risk**: Missing a macro-level catastrophe.
- **Recommended Next Action**: Drill down into the specific domain causing the lowest score.
- **Expected Decision Time**: < 10 seconds.
- **Expected Cognitive Load**: Low.

### FINANCE
- **Primary Executive Persona**: CFO
- **Executive Question**: Is cash flow at risk?
- **Decision Supported**: Freezing client accounts, authorizing expenditures.
- **Primary KPI**: Capital at Risk (>90 Days Overdue).
- **Secondary KPIs**: Total Open Balance, Max Days Overdue.
- **Critical Actions**: Lock credit for top offenders.
- **Business Risk**: Insolvency / Liquidity failure.
- **Expected Decision Time**: < 30 seconds.
- **Expected Cognitive Load**: Medium.

### SALES
- **Primary Executive Persona**: Commercial Director
- **Executive Question**: Will we achieve the commercial target?
- **Decision Supported**: Launching discounts, reallocating sales reps.
- **Primary KPI**: Target Gap (Run Rate vs Quota).
- **Secondary KPIs**: YTD Revenue, Top Client Concentration.
- **Critical Actions**: Alert Sales Team regarding top client drop-offs.
- **Business Risk**: Missing quarterly revenue commitments.
- **Expected Decision Time**: < 20 seconds.
- **Expected Cognitive Load**: Medium.

### INVENTORY
- **Primary Executive Persona**: Supply Chain Manager / CFO
- **Executive Question**: How much working capital is trapped?
- **Decision Supported**: Liquidating dead stock, halting production.
- **Primary KPI**: Immobilized Capital Value ($).
- **Secondary KPIs**: Stockout Risk Items, High Demand Coverage.
- **Critical Actions**: Issue liquidation orders for dead stock.
- **Business Risk**: Capital starvation due to dead inventory.
- **Expected Decision Time**: < 30 seconds.
- **Expected Cognitive Load**: High.

### SUPPLY
- **Primary Executive Persona**: Procurement Director
- **Executive Question**: Which sales are at risk because of supply?
- **Decision Supported**: Expediting freight, switching suppliers.
- **Primary KPI**: Revenue at Supply Risk ($).
- **Secondary KPIs**: Delayed POs, Pipeline Volume.
- **Critical Actions**: Escalate delayed containers.
- **Business Risk**: Failing to fulfill closed sales.
- **Expected Decision Time**: < 30 seconds.
- **Expected Cognitive Load**: Medium.
