# API CONTRACTS

## 1. Protocol Definition
The Express backend acts exclusively as a read-only translation layer between the PostgreSQL Materialized Views and the Next.js Frontend.

## 2. Core Endpoints
| Frontend Fetcher | Backend Mount | Source View | Type Signature Enforcement |
|------------------|---------------|-------------|----------------------------|
| `/api/executive/health-score` | `routes/executive.js` | `vw_sales_kpi` / `vw_finance_kpi` | `{ score: number, status: string }` |
| `/api/kpi/sales/ytd-net-revenue` | `routes/sales.js` | `vw_sales_kpi` | `{ total: number, forecast: number }` |
| `/api/kpi/finance/open-balance` | `routes/finance.js` | `vw_finance_kpi` | `Array<{ bucket: string, amount: number }>` |
| `/api/supply/pipeline-vs-supply` | `routes/supply.js` | `vw_supply_pipeline` | `Array<{ item_id: string, deliverable_revenue: number, revenue_at_supply_risk: number }>` |

## 3. Strict Safety Policy
- **No `any` Returns**: Every payload must be explicitly typed in the React components consuming the payload.
- **Graceful Fallbacks**: Every array mapped in React MUST have an `|| []` fallback to prevent hydration crashes prior to resolution.
- **Zero Mismatch Tolerance**: If a database column renames `revenue_at_supply_risk` to `risk_rev`, the entire pipeline must be refactored synchronously. Mismatches immediately trigger MVP RECOVERY.
