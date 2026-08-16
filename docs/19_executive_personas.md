# EXECUTIVE PERSONAS

## 1. The Decision Makers
The platform is designed exclusively for C-Suite and Director-level operators. It does NOT cater to data entry clerks or mid-level analysts.

### Persona A: The CEO (Chief Executive Officer)
- **Goal**: Macro-level risk mitigation.
- **Primary Pages**: `/` (Home), `/insights`.
- **Tolerance for Noise**: Zero.
- **Required UX**: Binary status indicators (Healthy vs Critical). They do not want to read tables; they want to know who to call.

### Persona B: The CFO (Chief Financial Officer)
- **Goal**: Liquidity and Working Capital protection.
- **Primary Pages**: `/finance`, `/inventory`.
- **Tolerance for Noise**: Low.
- **Required UX**: Hard monetary figures ($). Aging buckets. Immediate visibility into large exposures.

### Persona C: The Commercial Director
- **Goal**: Revenue target attainment.
- **Primary Pages**: `/sales`.
- **Tolerance for Noise**: Medium.
- **Required UX**: Trends, run-rates, and gaps to target. Client concentration risks.

### Persona D: The Supply Chain Director
- **Goal**: Fulfillment without capital immobilization.
- **Primary Pages**: `/inventory`, `/supply`.
- **Tolerance for Noise**: High (requires complex tables).
- **Required UX**: Lead times, stockout risks, overstock values. 

## 2. Global Constraint
If a component does not explicitly serve one of these four personas, it is considered technical debt and must be removed.
