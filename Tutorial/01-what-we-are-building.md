# 01 — What We Are Building

## The Application: NovaBank

NovaBank is a **reference online banking application** built to demonstrate how a modern, production-grade banking UI can be architected using a pure front-end stack. There is no real backend — a mock API layer intercepts every network call in the browser, making the app fully self-contained and runnable from a single `npm run dev`.

The goal is not a toy demo. Every design decision reflects choices you would make in a real banking product: multi-tenant theming, strict TypeScript domain models, accessible components, and a clear separation between UI, data-fetching, and mock infrastructure.

---

## What the App Does

NovaBank has seven pages, each covering a core retail banking workflow:

| Page | What It Shows |
|------|--------------|
| **Dashboard** | 4-stat summary (balance, monthly spend, savings goal, rewards), quick actions, account summary, recent transactions |
| **Accounts** | Savings account with balance, Fixed Deposit with tenure progress bar, Home Loan with repayment progress and EMI alert |
| **Transactions** | Activity log with category icons, money-in / money-out totals |
| **Transfer** | Three tabs — Send Now (bank/UPI with beneficiary autofill), Schedule (date picker, live preview), Recurring (frequency, pause/resume) |
| **Bill Payments** | Category grid, upcoming bills with due dates, recently paid |
| **Service Requests** | 7 request tiles, a stepper-based request tracker, and a persistent callback banner (time slot + subject + language) |
| **Cards & Rewards** | Card visuals, spend controls, rewards tab with tier progress, redemption options, and points history |

---

## Tech Stack and Why

```
Next.js 14 (App Router)   — file-based routing, server components, route groups
TypeScript                 — strict types across all domain models and components
Tailwind CSS               — utility-first styling driven by CSS custom properties
MSW (Mock Service Worker)  — intercepts fetch calls in the browser; no real server needed
Vitest                     — unit and component tests with jsdom
Playwright                 — end-to-end tests against the running dev server
```

**Why Next.js 14 App Router?** The App Router's route groups (`(banking)/`) let us apply a shared layout — header, sidebar, footer — to all banking pages without affecting the URL. Server Components keep non-interactive parts lightweight; Client Components are used only where state or browser APIs are needed.

**Why MSW?** Banking APIs are complex and unavailable during UI development. MSW intercepts `fetch` at the Service Worker level, returning realistic mock data for every domain (accounts, transactions, transfers, service requests, rewards). The same handler files power unit tests via the MSW Node server — one source of truth for all mock data.

**Why CSS custom properties for theming?** The app supports four visual themes (Arctic White, Midnight Navy, Forest Green, Warm Sandstone). With CSS variables declared per `[data-theme]` selector, switching a theme requires changing a single attribute on `<html>`. No component re-renders, no style prop overrides, no CSS-in-JS overhead.

---

## Pages and Routes

All banking pages live inside the `app/(banking)/` route group. The parentheses make `(banking)` invisible in the URL — so `app/(banking)/dashboard/page.tsx` renders at `/dashboard`.

```
/               →  redirects to /dashboard
/dashboard      →  Dashboard
/accounts       →  Accounts
/transactions   →  Transactions
/transfer       →  Transfer
/bills          →  Bill Payments
/service-requests  →  Service Requests
/cards          →  Cards & Rewards
```

---

## Project Layout

```
app/
  layout.tsx              Root layout — sets fonts, loads globals.css, mounts MSWProvider
  page.tsx                Redirects / → /dashboard
  MSWProvider.tsx         Client component — starts the MSW browser worker in development
  (banking)/
    layout.tsx            Route group layout — wraps all pages in <Shell>
    dashboard/page.tsx
    accounts/page.tsx
    transactions/page.tsx
    transfer/page.tsx
    bills/page.tsx
    service-requests/page.tsx
    cards/page.tsx

components/
  ui/                     Button, Input, Select, Badge, Panel
  layout/                 Shell, Header, Sidebar, Footer, PageHeader

lib/
  themes/                 4 theme config objects + index barrel
  hooks/                  useTheme, useAccounts, useTransactions
  api/                    Typed fetch wrapper (api.accounts.list(), etc.)
  utils.ts                cn() for class merging, formatCurrency(), formatDate()

mocks/
  browser.ts              MSW browser worker setup
  server.ts               MSW Node server (used in Vitest)
  handlers/               accounts, transactions, transfers, requests, rewards

types/                    account, transaction, transfer, request, rewards, themes

docs/                     ADRs and wiki (written before implementation)
Tutorial/                 This tutorial series
```

---

## The Four Themes

One of the architectural showcases of this project is multi-tenant theming. All four themes are selectable at runtime via the sidebar theme switcher, and the selection persists in `localStorage`.

| Theme | Accent | Header | Sidebar |
|-------|--------|--------|---------|
| **Arctic White** (default) | `#2563eb` (blue) | `#1e3a5f` (dark navy) | `#f8faff` (near-white) |
| **Midnight Navy** | `#3b82f6` (blue) | `#0a1628` (deepest navy) | `#0f1e35` (dark) |
| **Forest Green** | `#16a34a` (green) | `#14532d` (dark green) | `#f0fdf4` (light green-tint) |
| **Warm Sandstone** | `#b45309` (amber) | `#78350f` (dark brown) | `#fdf8f0` (warm off-white) |

---

## Rewards Philosophy

Throughout the app, reward points are shown with the explicit label **1 pt = ₹1**. This is a deliberate UX decision — users should never have to guess the value of their points. It appears on the Dashboard stat card, in the sidebar, on the Cards & Rewards page, and wherever points are displayed or redeemed.

---

## Next: Foundation

[Section 02 →](./02-foundation.md) explains how the project scaffold, theme system, layout shell, and mock API are wired together.
