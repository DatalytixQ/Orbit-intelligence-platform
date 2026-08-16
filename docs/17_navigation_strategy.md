# EXECUTIVE NAVIGATION STRATEGY

## 1. The Executive Entry Point
- **Start Location**: The CEO always starts at `/` (Home).
- **The 3-Minute Rule**: An executive must understand the entire company's operational status within 3 minutes of opening the app. If they need to click into a sub-module to find a fire, the Home Dashboard has failed.

## 2. Click Efficiency Audit
- **Identify a business problem**: Currently 1 click (visible on Home).
- **Identify root cause**: Currently 2-3 clicks + scanning dense tables.
- **Identify corrective action**: Currently undefined (relies on human intuition).

## 3. Future Navigation Model (The "Drill-Down" Pattern)
Instead of treating `/sales` and `/inventory` as isolated tools, they act as Level 2 drill-downs from Level 1 Home alerts.

- **Level 1 (Home)**: "Health is 35/100. Inventory is failing."
- **Level 2 (Inventory)**: *Clicks Inventory Alert*. Lands on `/inventory` pre-filtered to the failing KPIs (e.g., Immobilized Stock).
- **Level 3 (Action)**: *Clicks 'View Top 5 Critical'* -> Opens an actionable modal or deep-links into the ERP to liquidate.

## 4. Sidebar Optimization
The left navigation sidebar will remain fixed but will strip all non-essential items. "Insights" and "DSO Analytics" will be nested or accessed contextually to reduce visual bloat.
