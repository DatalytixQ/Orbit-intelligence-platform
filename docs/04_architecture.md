# SYSTEM ARCHITECTURE

## 1. High-Level Topology
```mermaid
graph TD
    User[Executive Persona] --> |Browser| Next[Next.js App Router]
    Next --> |Client Components| SWR[SWR Data Fetching]
    SWR --> |Next API Route| Proxy[/api/*]
    Proxy --> |HTTP| Express[Node.js Express :3000]
    
    Express --> RouterSales[routes/sales.js]
    Express --> RouterFinance[routes/finance.js]
    Express --> RouterInventory[routes/inventory.js]
    Express --> RouterSupply[routes/supply.js]
    Express --> RouterExecutive[routes/executive.js]
    
    RouterSales --> DB[(PostgreSQL)]
    RouterFinance --> DB
    RouterInventory --> DB
    RouterSupply --> DB
    RouterExecutive --> DB
```

## 2. Infrastructure Layer
- **Frontend Engine**: Next.js 14, React 18, TailwindCSS v4.
- **Backend Engine**: Node.js 20+, Express.
- **Data Engine**: PostgreSQL 15+.
- **Authentication**: JWT-based session abstraction via HTTP-only headers.

## 3. Directory Layout
- `frontend/`: Full Next.js React ecosystem.
- `backend/`: Express.js proxy and controller logic.
- `tests/e2e/`: Playwright visual and navigation guards.
- `docs/`: Product Operating System.
