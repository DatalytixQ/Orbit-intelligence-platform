# Standard Operating Procedure: Accounts Receivable (AR) Intelligence

**Document Version:** 1.0
**Domain:** Finance / Accounts Receivable
**Status:** Active

## 1. Overview
The Accounts Receivable (AR) Intelligence capability tracks open balances, overdue items, Days Sales Outstanding (DSO), and customer risk profiles to optimize cash flow and collection efficiency.

## 2. Technical Architecture

### 2.1 Database Layer
- **Raw Tables:** `raw_ar_open_items`, `raw_customer_payments`, `raw_collections`, `raw_invoices`
- **Staging Tables:** `stg_ar_open_items_clean`, `stg_customer_payments_clean`
- **Business Tables:** `finance_ar_open_items`, `customer_payments`, `finance_ar_snapshot_daily`, `finance_customer_risk_snapshot`
- **Configuration:** `ar_settings`

### 2.2 Backend & API Services
- **Routing:** `routes/finance.js` (Core AR endpoints)
- **Services:** `services/financeRisk.js` (In-memory cache for risk analysis)
- **Key API Endpoints:**
  - `GET /api/kpi/finance/current`
  - `GET /api/kpi/finance/ar-aging-summary`
  - `GET /api/kpi/finance/dso-analytics`
  - `GET /api/kpi/finance/risk-summary`

### 2.3 Frontend Dashboards
- **Executive Home:** Embedded aging widget via `app/page.tsx`
- **Finance Hub:** `app/finance/page.tsx`
- **DSO Analytics Drilldown:** `app/finance/dso-analytics/`

## 3. Business Rules (C-Series)
*Note: Currently marked as planned for implementation.*
- **C001 (Overdue Receivables Risk):** Identifies critical thresholds for aging accounts.
- **C002 (DSO Deterioration):** Tracks velocity slowdowns in collections.
- **C003 (Customer Credit Risk):** Flags customers exceeding credit limits or risk scoring metrics.
- **C004 (Collection Forecast Risk):** Anticipates cash flow shortfalls.
- **C005 (Critical Overdue Documents):** Alerts on high-value stranded invoices.

## 4. Key Performance Indicators (KPIs)
- **AR001:** Open Balance
- **AR002:** Overdue Balance
- **AR003:** DSO (Days Sales Outstanding)
- **AR004:** Customer Risk Score

## 5. Maintenance & Support
- **Data Refresh:** Snapshots are refreshed daily via `finance_ar_snapshot_daily`. Manual override available at `POST /api/admin/finance/refresh-snapshots`.
- **Known Technical Debt:** `financeRisk.js` relies on a 5-minute TTL in-memory cache, which must be scaled to Redis or a robust caching tier in future architectural evolutions.
