# DATABASE GROUND TRUTH

## 1. Principle
The `erp_data` schema in the PostgreSQL database is the single immutable source of truth. The application is strictly a lens to view this data.

## 2. Core Entities (Raw Tables)
- `customers`
- `items`
- `sales_orders`
- `purchase_orders`
- `inventory`

## 3. Analytical Interface (Materialized Views)
The application MUST query these views, never the raw tables, to ensure analytical consistency and query performance.

| View | Purpose | Owner |
|------|---------|-------|
| `vw_sales_kpi` | Aggregates YTD net revenue, gross margin, and pipeline. | Sales Module |
| `vw_finance_kpi` | Groups AR/AP balances into 30/60/90+ day aging buckets. | Finance Module |
| `vw_inventory_kpi` | Calculates stock valuation and classifies slow-moving risk. | Inventory Module |
| `vw_supply_pipeline` | Joins sales demand against incoming purchase orders. | Supply Module |

## 4. Integrity Constraints
- The `id` primary keys map directly to React component keys.
- Currency is natively stored and returned as numeric ARS.
- Dates follow ISO 8601 formatting.
