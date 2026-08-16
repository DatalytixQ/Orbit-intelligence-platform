# EXECUTIVE VISUAL HIERARCHY

## 1. The 5-Level Rule
Every screen must adhere to a strict 5-level visual hierarchy. Elements that do not fall into these levels must be removed or hidden behind progressive disclosure.

### Level 1: Primary KPI (The Anchor)
- **Purpose**: Instantly answers the page's core Executive Question.
- **Visuals**: Largest typography (e.g., `text-5xl`), extreme font weight contrast (`font-bold tracking-tight`), isolated in the top-left or top-center of the workspace.
- **Example**: "Gap a meta mensual: $ 356.2 M".

### Level 2: Supporting KPIs (The Context)
- **Purpose**: Provides variance, trends, or secondary drivers to the Primary KPI.
- **Visuals**: Medium typography (`text-2xl`), softer colors (`text-muted-foreground`), aligned horizontally adjacent to the Primary KPI.
- **Example**: "Run rate: $ 19957.4 M (+12% vs last month)".

### Level 3: Executive Insight (The AI/System Conclusion)
- **Purpose**: Translates data into a human-readable sentence.
- **Visuals**: Distinct semantic background tint (e.g., `bg-blue-50 text-blue-900`), standard reading size (`text-base`).
- **Example**: "At the current run rate, Q2 target will be missed by 8%."

### Level 4: Recommended Action (The Fix)
- **Purpose**: The actionable button or link to correct the insight.
- **Visuals**: High-contrast button (`bg-primary text-white`), positioned directly below or adjacent to the Insight.
- **Example**: [Review Top 5 Declining Clients] button.

### Level 5: Detail Tables / Charts (The Proof)
- **Purpose**: The raw data supporting the insight. Only consumed if the executive disputes or wishes to investigate the Insight.
- **Visuals**: Standard table/chart UI. Positioned below the fold. Muted headers. Highly dense but breathable.
- **Example**: The 30-row "Estado de cobertura" table.

## 2. Enforcement
If a component demands Level 1 attention (e.g., a massive bright red chart) but only contains Level 5 data, it is a **visual violation** and must be demoted.
