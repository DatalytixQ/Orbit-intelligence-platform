# Datalytix Quest - Website Knowledge Base & Guidelines

## 1. Project Overview
- **Domain:** datalytixquest.com
- **Core Value Proposition:** We are NOT traditional ERP implementers. We are "Architects of Operational Intelligence". We build intelligence layers (Dashboards, AI, Automation) on top of existing ERPs without disruption.
- **Tech Stack:** Next.js 16 (App Router), TailwindCSS, Framer Motion, TypeScript.
- **Languages:** i18n implemented via dictionary pattern (English `/en` and Spanish `/es`).

## 2. Copywriting & Tone (B2B Premium)
- **Target Audience:** CTOs, CIOs, CFOs, and ERP Managers in the US and LatAm.
- **Tone:** Consultative, authoritative, concise, and action-oriented.
- **B2B US Market Standards:** Use high-intent, punchy phrases (e.g., "Book a Strategy Call", "Operational Friction", "End-to-End Operational Insights").
- **Avoid:** Generic terms like "accounting software", "ERP implementation partner", or overly long paragraphs. Focus on "Operational Ecosystems".

## 3. SEO & Marketing Strategy
- **Keywords (EN):** AI automation for legacy ERPs, Operational intelligence consulting for ERP.
- **Keywords (ES):** Consultoría en automatización de ERP con IA, Inteligencia operativa para ERP LatAm.
- **Technical SEO:**
  - Dynamic `generateMetadata` in `app/[lang]/layout.tsx`.
  - Hreflang alternates properly configured in `app/sitemap.ts` for `/en` and `/es`.
  - Content must be indexable (SSR/SSG preferred for core pages).
- **Traffic Strategy:** Focus on LinkedIn direct outreach to decision-makers and highly targeted cold email campaigns offering the "ERP Operational Intelligence Assessment".

## 4. Technical Constraints & Patterns
- **i18n Implementation:** Never hardcode text in components. Always use the `dict` prop passed down from the localized dictionaries (`en.json`, `es.json`).
- **Next.js Features:** Use Server Components by default. Use `"use client"` only for interactive components (like Framer Motion animations or the Assessment Wizard).
- **Avoid:** Do not run simple `cat` or `grep` commands for file operations; use the specific agent tools available. Do not overwrite decisions recorded in this knowledge base without explicit user approval.
