# Mock API guide

The mock API layer uses **Mock Service Worker (MSW v2)**. All `fetch` calls in the app hit real endpoints — MSW intercepts them at the network level before they leave the browser, returning realistic mock responses.

---

## Handler structure

Each domain has its own handler file:

```
mocks/handlers/
├── accounts.ts       GET /api/accounts, GET /api/accounts/:id
├── transactions.ts   GET /api/transactions
├── transfers.ts      POST /api/transfers, POST /api/transfers/schedule, POST /api/transfers/recurring
├── requests.ts       GET /api/requests, POST /api/requests
└── rewards.ts        GET /api/rewards
```

All handlers are combined in `mocks/browser.ts` (browser) and `mocks/server.ts` (Node/tests).

---

## Adding a new handler

```typescript
// mocks/handlers/notifications.ts
import { http, HttpResponse } from 'msw';

export const notificationHandlers = [
  http.get('/api/notifications', () => {
    return HttpResponse.json([
      { id: '1', type: 'emi_due', message: 'EMI of ₹32,450 due in 3 days', read: false },
      { id: '2', type: 'reward_earned', message: '+124 pts from Amazon purchase', read: true },
    ]);
  }),
];
```

Then register in `mocks/browser.ts`:

```typescript
import { notificationHandlers } from './handlers/notifications';

export const handlers = [
  ...accountHandlers,
  ...notificationHandlers,  // add here
];
```

---

## Simulating errors

Use `HttpResponse` with a non-2xx status to test error UI:

```typescript
http.post('/api/transfers', () => {
  return new HttpResponse(
    JSON.stringify({ error: 'Insufficient funds' }),
    { status: 422, headers: { 'Content-Type': 'application/json' } }
  );
}),
```

---

## Configuring latency

Set `NEXT_PUBLIC_API_DELAY_MS` in `.env.local`:

```bash
NEXT_PUBLIC_API_DELAY_MS=800
```

The API client in `lib/api/client.ts` reads this value and adds a delay before resolving. Set to `0` in `.env.test` for fast tests.

---

# Getting started

## Prerequisites

- Node.js 20 or later
- npm 10+ or pnpm 9+
- Git

## Clone and install

```bash
git clone https://github.com/yourusername/banking-ux-reference.git
cd banking-ux-reference
npm install
```

## Initialise MSW

MSW requires a service worker file in the `public/` directory. It is committed to the repo, but if you ever need to regenerate it:

```bash
npx msw init public/ --save
```

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Default values:

```bash
NEXT_PUBLIC_API_DELAY_MS=400
NEXT_PUBLIC_DEFAULT_THEME=arctic-white
NEXT_PUBLIC_APP_NAME=NovaBank
```

## Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). MSW starts automatically and logs intercepted requests to the browser console.

## Run tests

```bash
npm run test           # Vitest unit tests
npm run test:coverage  # with coverage report
npm run test:e2e       # Playwright end-to-end (requires dev server running)
```

## Build for production

```bash
npm run build
npm run start
```

MSW is excluded from production builds. In production, replace mock handlers with real API endpoints by updating `lib/api/client.ts` to point to your backend base URL.

---

# Adding a new page

1. Create the route directory: `app/(banking)/your-page/`
2. Add `page.tsx` with a default export
3. Add a nav item in `components/layout/Sidebar.tsx`
4. Add mock handlers in `mocks/handlers/your-page.ts` and register them
5. Add types in `types/your-page.ts`
6. Add the API client function in `lib/api/your-page.ts`
7. Document any significant UX decisions as an ADR in `docs/adr/`

The shared shell (sidebar, header, footer) is inherited automatically via `app/(banking)/layout.tsx`.
