# Banking UX Reference — Tutorial Series

A step-by-step guide to building a production-grade online banking reference application with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **MSW**.

The app ships as four complete bank brands — NovaBank, Meridian, Verdant, and Aurum — all driven by a single codebase and a CSS-variable theme system. Every design decision reflects choices you would make in a real banking product.

Each tutorial section maps to one implementation session. Code and explanation grow together.

---

## Sections

| # | Title | Status |
|---|-------|--------|
| [01](./01-what-we-are-building.md) | What We Are Building | ✅ Complete |
| [02](./02-foundation.md) | Foundation — Scaffold, Themes, Shell & Mock API | ✅ Complete |
| 03 | Dashboard Page | 🔜 Next |
| 04 | Accounts Page | 🔜 Upcoming |
| 05 | Transactions Page | 🔜 Upcoming |
| 06 | Transfer Page | 🔜 Upcoming |
| 07 | Bill Payments Page | 🔜 Upcoming |
| 08 | Service Requests Page | 🔜 Upcoming |
| 09 | Cards & Rewards Page | 🔜 Upcoming |

---

## Who This Is For

Developers who want to see how a realistic, multi-page banking application is architected and built from scratch — with a focus on:

- **Multi-tenant theming** without component-level changes
- **Per-tenant brand identity** — unique bank name, legal name, and illustrated logo per theme
- **Mock-first development** using MSW so the UI works independently of a real backend
- **Type-safe domain modelling** across accounts, transactions, transfers, requests, and rewards
- **Responsive layout patterns** — fixed header, slide-in mobile drawer, always-visible desktop sidebar
- **Reusable component primitives** that respect a shared design token system

## Prerequisites

- Node.js 20+
- Familiarity with React and TypeScript
- Basic understanding of Next.js (pages vs App Router)

## Live Demo

The app is deployed on Vercel and runs entirely in the browser — no backend needed. MSW intercepts every API call and returns realistic Indian banking data.

> [https://banking-ux-reference.vercel.app](https://banking-ux-reference.vercel.app)
