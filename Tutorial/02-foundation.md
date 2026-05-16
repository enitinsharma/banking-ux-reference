# 02 — Foundation: Scaffold, Themes, Shell & Mock API

This section covers everything built in the first implementation session — the skeleton that every subsequent page is built on top of. By the end of this section the app runs in the browser, shows a themed shell with a working sidebar, and every API call is intercepted by MSW.

---

## 1. Project Scaffold

The project starts from `create-next-app@14` with a specific set of flags:

```bash
npx create-next-app@14 . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

**Key choices:**
- `--app` — enables the App Router (not the legacy Pages Router)
- `--no-src-dir` — keeps `app/`, `components/`, `lib/`, `types/` at the project root, not inside a `src/` wrapper. Flatter structure, shorter import paths.
- `--import-alias "@/*"` — `@/components/ui/Button` instead of `../../components/ui/Button` everywhere

Additional dependencies installed on top of the scaffold:

```bash
# UI and styling
npm install lucide-react clsx tailwind-merge

# Mock API
npm install --save-dev msw

# Unit testing
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react \
  @testing-library/user-event @testing-library/jest-dom jsdom

# E2E testing
npm install --save-dev @playwright/test
```

The MSW service worker file is copied to `public/` with:

```bash
npx msw init public/ --save
```

This copies `mockServiceWorker.js` into `public/` so the browser can register it as a Service Worker. The `--save` flag records `"msw": { "workerDirectory": ["public"] }` in `package.json`.

---

## 2. The Type System

Before writing any UI, the domain models are defined in `types/`. These are the contracts between the mock data, the API client, the hooks, and the components.

### Account types

Accounts use a **discriminated union** — a TypeScript pattern where a shared `type` field tells the compiler (and the developer) which variant they're working with:

```typescript
// types/account.ts
export type Account = SavingsAccount | FixedDepositAccount | HomeLoanAccount;
```

Each variant has completely different fields. A `SavingsAccount` has `balance` and `ifsc`. A `HomeLoanAccount` has `emi` and `nextEmiDate`. Because they share the `type` discriminant, TypeScript narrows automatically:

```typescript
if (account.type === 'home_loan') {
  // TypeScript knows account.emi exists here
}
```

### Why type first?

Defining types before writing handlers, hooks, or components means every layer is consistent. The MSW handler returns `Account[]`. The hook stores `Account[]`. The component receives `Account`. If you change the type, every consumer gets a compile error — instead of a runtime surprise.

---

## 3. The Theme System

This is the architectural heart of the project. The goal: switch between four visual themes at runtime by changing **one attribute on `<html>`** — no component re-renders, no prop drilling, no CSS-in-JS.

### CSS custom properties

Every color used in the app is a CSS variable:

```css
/* globals.css */
:root,
[data-theme="arctic-white"] {
  --accent: #2563eb;
  --accent-hover: #1d4ed8;
  --accent-foreground: #ffffff;
  --bg-sidebar: #f8faff;
  --header-bg: #1e3a5f;
  --bg-page: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border: #e2e8f0;
  --card-bg: #ffffff;
}

[data-theme="midnight-navy"] {
  --accent: #3b82f6;
  --bg-sidebar: #0f1e35;
  --header-bg: #0a1628;
  /* … */
}
```

Because these are declared with `[data-theme="..."]` CSS attribute selectors, switching the theme is simply:

```javascript
document.documentElement.setAttribute('data-theme', 'midnight-navy');
```

The browser instantly re-evaluates every `var(--accent)` reference across all elements. No JavaScript re-render cycle needed.

### Tailwind token mapping

CSS variables alone aren't enough — we use Tailwind utility classes everywhere. So the variables are mapped to Tailwind's color scale in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      accent: {
        DEFAULT: "var(--accent)",
        hover:   "var(--accent-hover)",
        fg:      "var(--accent-foreground)",
      },
      brand: {
        sidebar: "var(--bg-sidebar)",
        header:  "var(--header-bg)",
        page:    "var(--bg-page)",
        card:    "var(--card-bg)",
      },
      content: {
        primary:   "var(--text-primary)",
        secondary: "var(--text-secondary)",
      },
      "ui-border": "var(--border)",
    },
  },
}
```

Now components can use semantic Tailwind classes like `bg-brand-card`, `text-content-secondary`, `border-ui-border`, `bg-accent`, `hover:bg-accent-hover` — and they automatically follow the active theme.

### Theme config objects

Each theme is also represented as a TypeScript object in `lib/themes/`:

```typescript
// lib/themes/arctic-white.ts
export const arcticWhite: Theme = {
  id: 'arctic-white',
  name: 'Arctic White',
  vars: { '--accent': '#2563eb', '--bg-sidebar': '#f8faff', /* … */ },
};
```

These objects are used by `useTheme` to enumerate themes for the sidebar switcher and to persist the active theme ID in `localStorage`.

### ThemeProvider and useTheme

`lib/hooks/useTheme.tsx` is a React context that wraps the theme state:

```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // On mount: read localStorage, apply saved theme
    const stored = localStorage.getItem('nova-theme') as ThemeId | null;
    const active = stored && themeMap[stored] ? themeMap[stored] : defaultTheme;
    document.documentElement.setAttribute('data-theme', active.id);
    setThemeState(active);
  }, []);

  function setTheme(id: ThemeId) {
    const t = themeMap[id];
    document.documentElement.setAttribute('data-theme', t.id);
    setThemeState(t);
    localStorage.setItem('nova-theme', t.id);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Why `useEffect` for the initial apply?** The root layout is a Server Component — it renders on the server and sets `data-theme="arctic-white"` as a static HTML attribute. This means the correct CSS variables load with zero flash of unstyled content. On the client, `useEffect` runs after hydration, reads `localStorage`, and updates the attribute if the user had previously chosen a different theme.

The sidebar theme switcher consumes `useTheme`:

```typescript
const { theme, themes, setTheme } = useTheme();
// Renders 4 colour swatches; clicking one calls setTheme(t.id)
```

---

## 4. The Layout Shell

All seven banking pages share the same chrome: a fixed header, a fixed sidebar, a scrollable content area, and a footer. This is implemented as a **three-layer layout**.

### Layer 1 — Root layout (`app/layout.tsx`)

Sets the HTML document, loads fonts, imports `globals.css`, and mounts `MSWProvider`. It is a **Server Component** — it runs once on the server and produces the static HTML shell.

```tsx
<html lang="en" data-theme="arctic-white">   {/* SSR default theme */}
  <body className={`${geistSans.variable} font-sans antialiased`}>
    <MSWProvider>{children}</MSWProvider>
  </body>
</html>
```

### Layer 2 — Route group layout (`app/(banking)/layout.tsx`)

The `(banking)` folder is a Next.js **route group** — the parentheses make it invisible in the URL. Its `layout.tsx` wraps all banking pages in `<Shell>`:

```tsx
export default function BankingLayout({ children }) {
  return <Shell>{children}</Shell>;
}
```

Route groups let you apply a layout to a subset of routes without affecting routes outside the group. The `app/page.tsx` redirect, for example, is outside `(banking)/` and has no shell.

### Layer 3 — Shell component (`components/layout/Shell.tsx`)

```tsx
export function Shell({ children }) {
  return (
    <ThemeProvider>
      <Header />         {/* fixed top, full width, --header-bg */}
      <Sidebar />        {/* fixed left, 240px wide, --bg-sidebar */}
      <div className="ml-60 flex min-h-screen flex-col pt-16">
        <main className="flex-1 bg-brand-page px-6 py-6">
          {children}   {/* page content */}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
```

The `ml-60` (margin-left 240px) and `pt-16` (padding-top 64px) offset the content area to clear the fixed sidebar and header without JavaScript. Pure CSS layout — no dynamic positioning.

### Component dimensions

| Element | Width / Height | Position |
|---------|---------------|----------|
| Header | full width, `h-16` (64px) | `fixed top-0 left-0 right-0 z-50` |
| Sidebar | `w-60` (240px), full height below header | `fixed top-16 left-0 bottom-0 z-40` |
| Content | `ml-60`, fills remaining width | flow |

### Sidebar navigation

The Sidebar uses `usePathname()` from Next.js to highlight the active route:

```tsx
const pathname = usePathname();
const active = pathname === href || pathname.startsWith(`${href}/`);
```

The active item gets `bg-accent text-white`; inactive items get `text-content-secondary hover:bg-accent/10`. The `/10` opacity suffix is a Tailwind feature — it applies 10% opacity to the CSS variable colour, giving a soft tint on hover that always matches the active theme.

---

## 5. UI Primitives

Five base components in `components/ui/` are used across every page. They are intentionally minimal — no animation libraries, no third-party component frameworks.

### `cn()` utility

All components use `cn()` from `lib/utils.ts` to merge Tailwind classes safely:

```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`clsx` handles conditional class logic. `tailwind-merge` deduplicates conflicting Tailwind classes (e.g. if a caller passes `px-6` to override a component's default `px-4`, the merge keeps only `px-6`).

### Button

```tsx
<Button variant="primary" size="md">Pay now</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm">View all</Button>
```

Variants: `primary`, `secondary`, `ghost`, `destructive`. Sizes: `sm`, `md`, `lg`. All focus states use `ring-accent` so the focus ring always matches the active theme.

### Panel

The most used primitive — a themed card container:

```tsx
<Panel title="Recent Transactions" action={<Button size="sm">View all</Button>}>
  {/* content */}
</Panel>
```

Renders `bg-brand-card border border-ui-border rounded-xl p-6`. Both `bg-brand-card` and `border-ui-border` resolve to CSS variables, so the card background and border colour shift with the active theme.

---

## 6. The Mock API (MSW)

MSW (Mock Service Worker) is used in two environments:

| Environment | Setup | Purpose |
|-------------|-------|---------|
| Browser (dev) | `mocks/browser.ts` + `MSWProvider` | Intercepts `fetch` calls in the running app |
| Node (tests) | `mocks/server.ts` + `vitest.setup.ts` | Intercepts `fetch` calls in Vitest unit tests |

Both share the same handler files — one source of truth for all mock data.

### Handler structure

Each domain has its own handler file:

```
mocks/handlers/
  accounts.ts      GET /api/accounts, GET /api/accounts/:id
  transactions.ts  GET /api/transactions (with ?accountId and ?limit)
  transfers.ts     GET /api/beneficiaries, POST /api/transfers,
                   GET/PATCH /api/transfers/recurring/:id
  requests.ts      GET/POST /api/service-requests, POST /api/callback
  rewards.ts       GET /api/rewards, GET /api/rewards/history, POST /api/rewards/redeem
```

A handler looks like this:

```typescript
import { http, HttpResponse } from 'msw';

export const accountHandlers = [
  http.get('/api/accounts', () => HttpResponse.json(accounts)),
  http.get('/api/accounts/:id', ({ params }) => {
    const account = accounts.find(a => a.id === params.id);
    if (!account) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(account);
  }),
];
```

MSW 2.x uses `http.get/post/patch` (not the older `rest.get`). `HttpResponse.json()` creates a properly typed JSON response without manual header boilerplate.

### MSWProvider

In the browser, MSW must start before any API calls fire. `app/MSWProvider.tsx` is a Client Component that dynamically imports the worker and shows a spinner until it's ready:

```tsx
'use client';
export function MSWProvider({ children }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== 'development');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    import('../mocks/browser')
      .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
      .then(() => setReady(true));
  }, []);

  if (!ready) return <LoadingSpinner />;
  return <>{children}</>;
}
```

Key points:
- `ready` starts as `true` in production (MSW never runs) and `false` in development
- Dynamic `import()` keeps the entire mock bundle out of the production bundle — tree-shaken away
- `onUnhandledRequest: 'bypass'` lets real network requests (fonts, Next.js internals) pass through unintercepted

### Vitest integration

For unit tests, `vitest.setup.ts` starts the MSW Node server before the test suite:

```typescript
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());   // prevents handler leakage between tests
afterAll(() => server.close());
```

`onUnhandledRequest: 'error'` is stricter in tests than in the browser — any fetch that doesn't match a handler throws immediately, catching missing mock coverage early.

---

## 7. Data Hooks

`lib/hooks/useAccounts.ts` and `useTransactions.ts` are simple `useEffect` fetch hooks. They call the typed API client (`lib/api/client.ts`) and return `{ data, loading, error }`.

```typescript
export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json() as Promise<Account[]>)
      .then(setAccounts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { accounts, loading, error };
}
```

In the browser, `fetch('/api/accounts')` is intercepted by the MSW service worker and returns the mock account list. In tests, the same fetch is intercepted by the MSW Node server. The hook doesn't know or care — it just calls `fetch`.

---

## 8. Build Verification

After all files are in place, `npm run build` runs the Next.js production build and the TypeScript compiler together. A clean build with no errors confirms:

- All imports resolve correctly
- All types check across the full graph (types → handlers → hooks → components → pages)
- All 9 routes (including the redirect) compile to static output

```
Route (app)                Size     First Load JS
┌ ○ /                      158 B         87.5 kB
├ ○ /dashboard             158 B         87.5 kB
├ ○ /accounts              158 B         87.5 kB
...
```

The tiny per-route size (158 B) reflects that the placeholder page components are almost empty. As real components are added in subsequent sessions, these numbers will grow — but the shared JS chunk (`87.4 kB`) will not change much because it is dominated by React and Next.js internals.

---

## Summary

| Layer | Files | What It Does |
|-------|-------|-------------|
| Types | `types/*.ts` | Domain contracts — shared by handlers, hooks, and components |
| Theme system | `lib/themes/`, `globals.css`, `tailwind.config.ts`, `useTheme` | CSS variable themes switched by a single `data-theme` attribute |
| Layout shell | `components/layout/` | Fixed header + sidebar + scrollable content + footer |
| UI primitives | `components/ui/` | Button, Input, Select, Badge, Panel — theme-aware by default |
| Mock API | `mocks/` | MSW handlers, browser worker, Node server |
| Data hooks | `lib/hooks/` | Fetch wrappers that return typed data from the mock API |
| App wiring | `app/layout.tsx`, `app/(banking)/layout.tsx`, `MSWProvider` | Connects all layers into a working Next.js app |

---

## Next

[Section 03 →]() — Building the Dashboard page: StatCard grid, QuickActions, AccountSummary, and RecentTransactions, all wired to live mock data.
