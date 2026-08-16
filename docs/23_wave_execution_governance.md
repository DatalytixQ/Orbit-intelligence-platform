# WAVE EXECUTION GOVERNANCE

## 1. Sequential Constraints
The Product evolves strictly page-by-page. Simultaneous multi-page refactoring is globally forbidden to prevent cascade regressions.

## 2. The Implementation Sequence
1. `Home` (`/`)
   - STOP -> User Validation
2. `Sales` (`/sales`)
   - STOP -> User Validation
3. `Finance` (`/finance`)
   - STOP -> User Validation
4. `Inventory` (`/inventory`)
   - STOP -> User Validation
5. `Supply` (`/supply`)
   - STOP -> User Validation
6. `Insights` (`/insights`)
   - STOP -> User Validation
7. `Product Maturity` (`/admin/product-maturity`)
   - STOP -> User Validation

## 3. The STOP Protocol
A "STOP" means the Agent ceases all code modification, compiles all Playwright/Build evidence, requests human feedback, and halts operations. 
**No autonomous continuation without human signal.**
