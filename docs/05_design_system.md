# DESIGN SYSTEM

## 1. Enterprise UX Philosophy
The user interface must project control, clarity, and precision. We discard generic palettes in favor of a strictly semantic, high-contrast structural system.

## 2. Typography
- **Primary Display**: `Geist` (clean geometric weight tracking for KPIs).
- **Secondary UI / Data**: `Inter` (optimal legibility for tables and dense grids).

## 3. Color Semantics (Slate + Indigo)
All classes must consume Tailwind semantic variables. Hardcoded HEX values are forbidden.
- **Background**: `bg-background` (Slate 50 / Slate 900)
- **Foreground Text**: `text-foreground`
- **Containers**: `bg-card border-border`
- **Brand/Primary**: `text-primary bg-primary` (Indigo 600)
- **Success/Deliverable**: Emerald 500
- **Risk/Overdue**: Rose 500 / Red 500
- **Warning/Pending**: Yellow 500

## 4. Spacing & Structure
- The system strictly adheres to an 8px grid (`p-4`, `p-6`, `gap-4`, `gap-6`).
- Floating elements use `shadow-sm` and `rounded-xl`. Extreme shadows are rejected.
- Data density is high but breathable, allowing complex dashboards to render cleanly without cognitive overload.

## 5. Premium Design Gap Analysis
> [!NOTE]
> This section is reserved for the upcoming Premium Enterprise UX Review. Execution awaits the provisioning of current application screenshots from the Product Owner. Future gap analysis will benchmark against Tableau, Power BI, Stripe Dashboard, Linear, Vercel, Notion, Retool, and Looker.
