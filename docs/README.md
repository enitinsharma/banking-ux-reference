# banking-ux-reference

A reference implementation of a modern online banking application demonstrating user-centric design patterns for digital banking with multi-tenant theming.

Built with **React + TypeScript + Next.js** and a **Mock Service Worker (MSW)** API layer. Designed to showcase full-stack thinking — from component architecture and accessibility to product design decisions like transparent rewards and proactive customer communication.

---

## Live demo

> `npx` one-liner or Vercel preview link goes here once deployed.

---

## Screenshots

| Dashboard | Accounts | Service requests |
|-----------|----------|-----------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Accounts](docs/screenshots/accounts.png) | ![Requests](docs/screenshots/requests.png) |

---

## Features

### Banking pages
- **Dashboard** — balance overview, rewards summary, quick actions, account snapshot, recent transactions
- **Accounts** — savings account, fixed deposit with tenure progress, home loan with repayment tracker and EMI alert
- **Transactions** — full activity log with category icons and money-in / money-out summary
- **Transfer** — instant bank transfer and UPI, scheduled transfers with date picker, recurring transfers with pause/resume
- **Bill payments** — category grid, upcoming bills, recently paid
- **Service requests** — seven request types (cheque book, stop payment, tax certificate, interest certificate, nomination update, address/contact update, debit card replacement), request tracker with step-by-step status, callback request with time slot, subject, and language preference
- **Cards & rewards** — card management, spend controls, rewards tab with 1 pt = ₹1 transparency policy, tier progress, and redemption options

### Architecture & engineering highlights
- **Multi-tenant theming** via CSS custom properties — swap themes by changing a single `data-theme` attribute, no component code changes
- **Four colour themes** included out of the box: Midnight Navy, Arctic White, Forest Green, Warm Sandstone
- **MSW mock API** — realistic API responses with configurable latency, no backend required
- **Fully typed** — strict TypeScript throughout, including API response types and theme config
- **Accessible** — ARIA labels, keyboard navigation, focus management, screen-reader-friendly markup
- **Component-driven** — atomic design structure; all UI primitives are composable and reusable

### Product design decisions documented
Each significant UX decision is recorded in `/docs/adr`. Key decisions include:
- 1 pt = ₹1 rewards transparency (no conversion obfuscation)
- Callback banner as a persistent safety net below service request tiles
- Proactive EMI alert with auto-debit context on the loan card
- Scheduled transfer preview box for confirmation before commit
- Stop payment irreversibility warning before form submission

---

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+ or pnpm 9+

### Installation

```bash
git clone https://github.com/yourusername/banking-ux-reference.git
cd banking-ux-reference
npm install
```

### Development

```bash
npm run dev
```

MSW starts automatically in development mode. The mock API intercepts all `/api/*` requests and returns realistic data with configurable latency.

### Build

```bash
npm run build
npm run start
```

### Tests

```bash
npm run test          # unit tests (Vitest)
npm run test:e2e      # end-to-end (Playwright)
```

---

## Project structure

```
banking-ux-reference/
├── app/                          # Next.js app router
│   ├── layout.tsx                # Root layout — theme provider, fonts
│   ├── page.tsx                  # Entry — redirects to /dashboard
│   └── (banking)/                # Route group — shared shell
│       ├── layout.tsx            # App shell (sidebar, header, footer)
│       ├── dashboard/page.tsx
│       ├── accounts/page.tsx
│       ├── transactions/page.tsx
│       ├── transfer/page.tsx
│       ├── bills/page.tsx
│       ├── requests/page.tsx
│       └── cards/page.tsx
│
├── components/
│   ├── ui/                       # Primitives — Button, Input, Select, Badge, Panel
│   ├── layout/                   # Shell, Sidebar, Footer, PageHeader
│   ├── dashboard/                # StatCard, QuickActions, AccountSummary
│   ├── accounts/                 # AccountCard, LoanCard, DepositCard
│   ├── transfer/                 # TransferForm, BeneficiaryList, RecurringCard
│   ├── requests/                 # RequestTile, RequestForm, RequestTracker
│   │   ├── forms/                # ChequeBookForm, StopPaymentForm, etc.
│   │   └── CallbackBanner.tsx
│   └── cards/                    # CardVisual, RewardsPanel, SpendLimits
│
├── lib/
│   ├── themes/
│   │   ├── theme.types.ts        # BankTheme interface
│   │   ├── midnight-navy.ts
│   │   ├── arctic-white.ts
│   │   ├── forest-green.ts
│   │   └── warm-sandstone.ts
│   ├── hooks/                    # useTheme, useTransactions, useAccounts
│   ├── api/                      # Typed API client functions
│   └── utils/                    # formatCurrency, formatDate, etc.
│
├── mocks/
│   ├── browser.ts                # MSW browser setup
│   ├── server.ts                 # MSW node setup (for tests)
│   └── handlers/
│       ├── accounts.ts
│       ├── transactions.ts
│       ├── transfers.ts
│       ├── requests.ts
│       └── rewards.ts
│
├── types/
│   ├── account.ts
│   ├── transaction.ts
│   ├── transfer.ts
│   ├── request.ts
│   └── rewards.ts
│
├── docs/
│   ├── adr/                      # Architecture decision records
│   │   ├── 001-tech-stack.md
│   │   ├── 002-theming-strategy.md
│   │   ├── 003-rewards-transparency.md
│   │   ├── 004-msw-mock-layer.md
│   │   ├── 005-scheduled-transfers.md
│   │   └── 006-callback-safety-net.md
│   ├── wiki/
│   │   ├── getting-started.md
│   │   ├── theming-guide.md
│   │   ├── adding-a-page.md
│   │   ├── mock-api-guide.md
│   │   └── component-catalogue.md
│   └── screenshots/
│
├── public/
│   └── mockServiceWorker.js      # MSW service worker (auto-generated)
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Theming

All colours are defined as CSS custom properties. Switching themes requires one attribute change:

```html
<html data-theme="arctic-white">
```

To add a custom theme for a new FI tenant, create a file in `lib/themes/`:

```typescript
// lib/themes/my-bank.ts
import type { BankTheme } from './theme.types';

export const myBankTheme: BankTheme = {
  id: 'my-bank',
  name: 'My Bank',
  colors: {
    accent: '#0a5c36',
    accentLight: '#e8f5ee',
    accentMid: '#a3d4b8',
    accentText: '#073d24',
    headerBg: '#073d24',
    sidebarBg: '#f0f8f3',
    contentBg: '#ffffff',
    border: '#d4e8db',
    // ... full token list in theme.types.ts
  },
};
```

Register it in `lib/themes/index.ts` and it becomes available immediately across the entire application. No component changes required.

---

## Mock API (MSW)

All API calls are intercepted by MSW in development and test environments. Handlers live in `mocks/handlers/`.

Example — adding a new handler:

```typescript
// mocks/handlers/accounts.ts
import { http, HttpResponse } from 'msw';
import { mockAccounts } from '../data/accounts';

export const accountHandlers = [
  http.get('/api/accounts', () => {
    return HttpResponse.json(mockAccounts, { status: 200 });
  }),

  http.get('/api/accounts/:id', ({ params }) => {
    const account = mockAccounts.find(a => a.id === params.id);
    if (!account) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(account);
  }),
];
```

Configurable latency is available via the `NEXT_PUBLIC_API_DELAY_MS` environment variable (defaults to `400ms` in development, `0` in tests).

---

## Key design principles

**Rewards transparency** — 1 Nova point = ₹1, always. No conversion rates, no hidden multipliers. The rupee equivalent is shown everywhere points appear, including the dashboard stat card, rewards tab balance, redemption options, and transaction history. This is a deliberate product decision documented in `docs/adr/003-rewards-transparency.md`.

**Proactive UX** — the app surfaces information before the user needs to ask for it: EMI due dates with auto-debit context, transfer confirmation previews before submission, stop payment irreversibility warnings before the form, and a card-blocking nudge before raising a replacement request.

**Safety net** — the callback banner on the service requests page is persistent and always visible below the request tiles. It is never hidden, paginated away, or shown only after a failed search. Its position signals that the bank values the customer's time and will meet them where they are.

**Accessibility** — every interactive element has a keyboard-accessible equivalent. Colour is never the sole indicator of meaning (status is conveyed by both colour and text/icon). Form inputs have explicit labels. Focus is managed on modal/drawer open and close.

---

## ADR index

| # | Decision | Status |
|---|----------|--------|
| 001 | React + TypeScript + Next.js as the primary stack | Accepted |
| 002 | CSS custom properties for multi-tenant theming | Accepted |
| 003 | 1 pt = ₹1 rewards transparency policy | Accepted |
| 004 | MSW for mock API layer | Accepted |
| 005 | Scheduled and recurring transfers with live preview | Accepted |
| 006 | Persistent callback banner as service request safety net | Accepted |

Full records in `docs/adr/`.

---

## Contributing

This is a reference implementation intended for demonstration and discussion. Contributions that improve accessibility, add test coverage, or document additional design decisions are welcome.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
4. Open a pull request with a clear description

---

## Licence

MIT — free to use, adapt, and build on.

---

*Built by Nitin Sharma · Principal Solutions Architect · [linkedin.com/in/nitinsharma78](https://linkedin.com/in/nitinsharma78)*
