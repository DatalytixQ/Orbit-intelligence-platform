# DESIGN DECISION LOG

## LOG-001: DQBot Sidebar Demotion
- **Date**: Stage 3.1
- **Decision**: Remove fixed right-sidebar. Convert to floating widget.
- **Rationale**: 25% horizontal space loss causes critical data truncation on Inventory and Sales pages. Cognitive load is increased by feeling 'squeezed'.
- **Status**: Approved. Awaiting Blueprint implementation.

## LOG-002: Semantic Alert Tints
- **Date**: Stage 3.1
- **Decision**: Strip solid `bg-red-500` fills from Health components. Replace with `bg-red-50` and `text-red-700`.
- **Rationale**: Solid primary color blocks cause alert fatigue and violate Stripe/Linear benchmark principles.
- **Status**: Approved. Awaiting Blueprint implementation.

## LOG-003: Typography Casing
- **Date**: Stage 3.1
- **Decision**: Remove ALL CAPS from KPI headers.
- **Rationale**: ALL CAPS disrupts natural reading flow and feels dated (legacy ERP style rather than modern SaaS).
- **Status**: Approved. Awaiting Blueprint implementation.
