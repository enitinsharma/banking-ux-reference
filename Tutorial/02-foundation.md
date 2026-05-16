# 02 — Foundation: Scaffold, Themes, Shell & Mock API

This section covers everything built in the first implementation session — the skeleton that every subsequent page is built on top of. By the end of this section the app runs in the browser, shows a fully themed shell with a working responsive sidebar, and every API call is intercepted by MSW.

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
  // TypeScript knows account.emi exists here — no cast needed
}
```

### Why type first?

Defining types before writing handlers, hooks, or components means every layer is consistent. The MSW handler returns `Account[]`. The hook stores `Account[]`. The component receives `Account`. If you change the type, every consumer gets a compile error — instead of a runtime surprise.

---

## 3. The Theme System

This is the architectural heart of the project. The goal: switch between four visual themes at runtime by changing **one attribute on `<html>`** — no component re-renders, no prop drilling, no CSS-in-JS.

### CSS custom properties

Every colour used in the app is a CSS variable:

```css
/* globals.css */
:root,
[data-theme="arctic-white"] {
  --accent:             #2563eb;
  --accent-hover:       #1d4ed8;
  --accent-foreground:  #ffffff;
  --bg-sidebar:         #f8faff;
  --header-bg:          #1e3a5f;
  --bg-page:            #f1f5f9;
  --text-primary:       #0f172a;
  --text-secondary:     #64748b;
  --border:             #e2e8f0;
  --card-bg:            #ffffff;
}

[data-theme="midnight-navy"] {
  --accent:      #3b82f6;
  --bg-sidebar:  #0f1e35;
  --header-bg:   #0a1628;
  /* … */
}
```

Because these are declared with `[data-theme="..."]` CSS attribute selectors, switching the theme is a single DOM operation:

```javascript
document.documentElement.setAttribute('data-theme', 'midnight-navy');
```

The browser instantly re-evaluates every `var(--accent)` reference across all elements. No JavaScript re-render cycle needed.

### Tailwind token mapping

CSS variables alone aren't enough — the components use Tailwind utility classes everywhere. So the variables are mapped to Tailwind's colour scale in `tailwind.config.ts`:

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

Now components can use semantic Tailwind classes like `bg-brand-card`, `text-content-secondary`, `border-ui-border`, `bg-accent`, `hover:bg-accent-hover` — and they automatically follow the active theme without any JavaScript involvement.

### Theme config objects

Each theme is also represented as a TypeScript object in `lib/themes/`. Notice the `bankName` and `legalName` fields — these give each theme its own distinct bank identity:

```typescript
// lib/themes/arctic-white.ts
export const arcticWhite: Theme = {
  id:         'arctic-white',
  name:       'Arctic White',
  bankName:   'NovaBank',
  legalName:  'NovaBank Ltd.',
  vars: {
    '--accent':      '#2563eb',
    '--bg-sidebar':  '#f8faff',
    '--header-bg':   '#1e3a5f',
    // …
  },
};
```

The other three themes follow the same shape:

| Theme ID | `bankName` | `legalName` |
|----------|------------|-------------|
| `arctic-white` | NovaBank | NovaBank Ltd. |
| `midnight-navy` | Meridian | Meridian Bank Ltd. |
| `forest-green` | Verdant | Verdant Bank Ltd. |
| `warm-sandstone` | Aurum | Aurum Bank Ltd. |

This means the Header, Sidebar, and Footer display the correct bank name for whichever theme is active — with no conditionals in the component code. They simply read `theme.bankName` from `useTheme()`.

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
// Also reads theme.bankName to display the current bank name
```

---

## 4. Per-Theme Illustrated Logos

Each bank has its own illustrated SVG logo — a small scene rendered at 38×38 px. These are inline React components so there are no image file dependencies, no network requests, and no layout shift.

| Bank | Scene |
|------|-------|
| **NovaBank** (Arctic White) | Night sky, aurora borealis arcs in cyan and teal, snow-capped mountain, starfield |
| **Meridian** (Midnight Navy) | Stars, golden crescent moon, sailing ship with mast and sail, moonlit water |
| **Verdant** (Forest Green) | Dawn sky, rising yellow sun, twin three-tier pine trees, rolling green hills |
| **Aurum** (Warm Sandstone) | Sunset gradient sky, golden sun with six rays, layered sand dunes, rock arch silhouette |

The logos live in `components/layout/ThemeLogo.tsx`:

```tsx
// Each bank is a private function component
function ArcticWhiteLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-label="NovaBank logo">
      {/* Night-sky background */}
      <rect width="38" height="38" rx="9" fill="#0b1d3a" />
      {/* Stars, aurora arcs, mountain body, snow cap */}
      {/* … */}
    </svg>
  );
}

// A lookup table maps ThemeId → component
const logoMap: Record<ThemeId, () => JSX.Element> = {
  'arctic-white':   ArcticWhiteLogo,
  'midnight-navy':  MidnightNavyLogo,
  'forest-green':   ForestGreenLogo,
  'warm-sandstone': WarmSandstoneLogo,
};

// The public component — caller passes only the theme ID
export function ThemeLogo({ themeId }: { themeId: ThemeId }) {
  const Logo = logoMap[themeId];
  return <Logo />;
}
```

**Key design decisions:**

- Each logo uses **hard-coded colours** that match its theme's palette. The SVG elements are not driven by CSS variables because the logos appear in both the header (on a dark `--header-bg` background) and the mobile sidebar drawer (on a light or dark `--bg-sidebar` background). Hard-coding keeps the illustrations consistent across both contexts.
- The `aria-label` on each `<svg>` provides an accessible name for screen readers.
- Keeping all four logos in one file makes it easy to compare and maintain them together.

The `ThemeLogo` component is used in two places:

```tsx
// In Header.tsx — always visible
<ThemeLogo themeId={theme.id} />
<span className="font-bold text-white">{theme.bankName}</span>

// In Sidebar.tsx — mobile header row only (lg:hidden)
<ThemeLogo themeId={theme.id} />
<span className="font-bold text-content-primary">{theme.bankName}</span>
```

---

## 5. The Layout Shell

All seven banking pages share the same chrome: a fixed header, a sidebar, a scrollable content area, and a footer. The sidebar behaves differently on mobile vs desktop — a slide-in drawer on small screens, always visible on large screens.

### Three-layer architecture

**Layer 1 — Root layout (`app/layout.tsx`)**

Sets the HTML document, loads fonts, imports `globals.css`, and mounts `MSWProvider`. It is a **Server Component** — runs once on the server and produces the static HTML shell.

```tsx
<html lang="en" data-theme="arctic-white">   {/* SSR default — no flash */}
  <body className={`${geistSans.variable} font-sans antialiased`}>
    <MSWProvider>{children}</MSWProvider>
  </body>
</html>
```

**Layer 2 — Route group layout (`app/(banking)/layout.tsx`)**

The `(banking)` folder is a Next.js **route group** — the parentheses make it invisible in the URL. Its `layout.tsx` wraps all banking pages in `<Shell>`:

```tsx
export default function BankingLayout({ children }) {
  return <Shell>{children}</Shell>;
}
```

Route groups let you apply a layout to a subset of routes without affecting routes outside the group. The `app/page.tsx` redirect, for example, is outside `(banking)/` and has no shell.

**Layer 3 — Shell component (`components/layout/Shell.tsx`)**

The Shell owns the mobile sidebar open/close state and composes all layout pieces:

```tsx
'use client';

export function Shell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Dark overlay — visible on mobile when sidebar is open */}
      <div
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
        className={cn(
          'fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden',
          sidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Content area — no left margin on mobile, 240 px margin on desktop */}
      <div className="flex min-h-screen flex-col pt-16 lg:ml-60">
        <main className="flex-1 bg-brand-page px-4 py-6 lg:px-6">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
```

`sidebarOpen` state lives in `Shell`, not in `Sidebar` itself — the Shell is the single source of truth and passes it down as props. The overlay (`bg-black/50`) is rendered in Shell rather than inside Sidebar so it sits at the correct z-index layer between the content (`z-30`) and the sidebar (`z-40`).

---

### Header (`components/layout/Header.tsx`)

The Header is fixed across the full viewport width and sits at `z-50`. On mobile it shows a hamburger button that opens the sidebar drawer; on desktop the hamburger is hidden.

```tsx
export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme } = useTheme();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center
                        justify-between bg-brand-header px-4 shadow-md lg:px-6">
      <div className="flex items-center gap-2 lg:gap-3">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-1.5 text-white/80 hover:bg-white/10
                     hover:text-white lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <ThemeLogo themeId={theme.id} />
        <span className="font-bold text-white">{theme.bankName}</span>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        {/* Notifications bell (with badge) */}
        {/* Settings icon — hidden on mobile */}
        {/* User avatar pill — name hidden on mobile */}
      </div>
    </header>
  );
}
```

Responsive behaviour at a glance:

| Element | Mobile | Desktop (`lg`) |
|---------|--------|----------------|
| Hamburger button | Visible | Hidden (`lg:hidden`) |
| Settings icon | Hidden (`hidden sm:block`) | Visible |
| User name in avatar pill | Hidden (`hidden sm:block`) | Visible |
| Header padding | `px-4` | `px-6` |

---

### Sidebar (`components/layout/Sidebar.tsx`)

The Sidebar is the most complex layout component. It serves two distinct roles:

- **Mobile**: a slide-in drawer that covers the left side of the screen, opened by the hamburger and closed by the `×` button, any nav link tap, or tapping the overlay
- **Desktop**: always visible, fixed below the header, 240 px wide

```tsx
export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { theme, themes, setTheme } = useTheme();

  return (
    <aside
      className={cn(
        // Base — full-height drawer, 288 px wide, slides in from left
        'fixed bottom-0 left-0 top-0 z-40 flex w-72 flex-col',
        'border-r border-ui-border bg-brand-sidebar',
        'transition-transform duration-300 ease-in-out',
        // Mobile: driven by isOpen prop
        isOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: always visible, narrower, sits below the header
        'lg:w-60 lg:top-16 lg:translate-x-0',
      )}
    >
      {/* Mobile-only header row — logo + close button */}
      <div className="flex h-16 shrink-0 items-center justify-between
                      border-b border-ui-border px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <ThemeLogo themeId={theme.id} />
          <span className="font-bold text-content-primary">{theme.bankName}</span>
        </div>
        <button onClick={onClose} aria-label="Close navigation menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}  {/* auto-closes drawer on mobile */}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                    active
                      ? 'bg-accent text-white'
                      : 'text-content-secondary hover:bg-accent/10 hover:text-content-primary',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="h-3 w-3" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme switcher */}
      <div className="border-t border-ui-border px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider
                      text-content-secondary">Theme</p>
        <div className="flex gap-2">
          {themes.map(t => (
            <button
              key={t.id}
              title={t.name}
              onClick={() => setTheme(t.id)}
              className={cn(
                'h-6 w-6 rounded-full transition-transform hover:scale-110',
                themeSwatches[t.id],
                theme.id === t.id && 'ring-2 ring-accent ring-offset-2',
              )}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
```

**How the CSS animation works:**

The sidebar is always rendered in the DOM — it never mounts/unmounts. The `translate-x` classes control visibility:

```
-translate-x-full   →  sidebar is offscreen to the left (hidden)
 translate-x-0      →  sidebar is at its natural position (visible)
```

`transition-transform duration-300 ease-in-out` applies a smooth 300 ms slide. On desktop, `lg:translate-x-0` overrides the mobile translate regardless of `isOpen`, so the sidebar is always locked in place.

**Why `onClose` on every `<Link>`?** On mobile, tapping a nav item navigates but the sidebar drawer stays open unless explicitly closed. Adding `onClick={onClose}` to each Link means navigation and close happen together — one interaction, expected result.

**Component dimensions:**

| Element | Mobile | Desktop (`lg`) |
|---------|--------|----------------|
| Sidebar width | `w-72` (288 px) | `lg:w-60` (240 px) |
| Sidebar top | `top-0` (full height) | `lg:top-16` (below header) |
| Sidebar visibility | Controlled by `translate-x` | Always visible (`lg:translate-x-0`) |
| Content left margin | None | `lg:ml-60` |
| Mobile header row | Visible | Hidden (`lg:hidden`) |

---

## 6. UI Primitives

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

## 7. The Mock API (MSW)

MSW (Mock Service Worker) is used in two environments:

| Environment | Setup | Purpose |
|-------------|-------|---------|
| Browser | `mocks/browser.ts` + `MSWProvider` | Intercepts `fetch` calls in the running app |
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

A handler in MSW 2.x syntax:

```typescript
import { http, HttpResponse } from 'msw';

export const accountHandlers = [
  http.get('/api/accounts', () =>
    HttpResponse.json(accounts)
  ),
  http.get('/api/accounts/:id', ({ params }) => {
    const account = accounts.find(a => a.id === params.id);
    if (!account) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(account);
  }),
];
```

MSW 2.x uses `http.get/post/patch` (not the older `rest.get`). `HttpResponse.json()` creates a properly typed JSON response without manual header boilerplate.

### Mock data flavour

The mock data is Indian banking flavoured — realistic amounts in ₹, categories you'd see in an Indian banking app (salary, UPI transfer, Swiggy, PhonePe, SBI Credit Card EMI), IFSC codes, Indian mobile numbers, and a rewards system with ₹1-per-point redemption (the standard for most Indian rewards programmes).

```typescript
// Sample from transactions handler
{ id: 'txn-001', description: 'Salary Credit — Infosys Ltd',
  amount: 125000, type: 'credit', category: 'salary' },
{ id: 'txn-002', description: 'Swiggy Food Delivery',
  amount: -847, type: 'debit', category: 'food' },
{ id: 'txn-003', description: 'SBI Credit Card EMI',
  amount: -12450, type: 'debit', category: 'transfer' },
```

### MSWProvider

MSW must start before any API calls fire. `app/MSWProvider.tsx` is a Client Component that dynamically imports the worker and shows a loading spinner until it's ready:

```tsx
'use client';

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import('../mocks/browser')
      .then(({ worker }) =>
        worker.start({
          onUnhandledRequest: 'bypass',
          serviceWorker: { url: '/mockServiceWorker.js' },
        }),
      )
      .then(() => setReady(true))
      .catch((err: unknown) => {
        // Service Worker registration can fail in hardened browsers
        // (Edge enhanced security, Firefox private mode, corporate proxies).
        // Render the app anyway — pages degrade gracefully without mock data.
        console.warn('[MSW] Service Worker failed to start — rendering without mock data.\n', err);
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9]">
        <div className="h-8 w-8 animate-spin rounded-full border-4
                        border-[#2563eb] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
```

**Important design decisions:**

- **MSW runs in all environments** — including production. The app is deployed as a public demo with no real backend, so visitors also need the mock data. Removing the `NODE_ENV !== 'development'` guard means the deployed Vercel site works identically to the local dev server.

- **Explicit service worker URL** — `serviceWorker: { url: '/mockServiceWorker.js' }` prevents MSW from guessing the worker path, which can fail in some browsers (notably Edge with enhanced security settings) if the app is served from a sub-path.

- **Graceful degradation** — the `.catch()` handler logs a warning and sets `ready = true` anyway. Pages that can't load mock data will show loading states or empty lists rather than crashing. This is the right behaviour for a demo app that might be viewed in corporate browsers, private mode, or other restrictive contexts.

- **Dynamic import** — `import('../mocks/browser')` inside `useEffect` keeps the mock bundle out of the server rendering path. It's loaded client-side only, on demand.

### Vitest integration

For unit tests, `vitest.setup.ts` starts the MSW Node server before the test suite:

```typescript
/// <reference types="vitest/globals" />
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());   // prevents handler leakage between tests
afterAll(() => server.close());
```

`onUnhandledRequest: 'error'` is stricter in tests than in the browser — any fetch that doesn't match a handler throws immediately, catching missing mock coverage early.

The `/// <reference types="vitest/globals" />` triple-slash directive gives TypeScript access to `beforeAll`, `afterEach`, and `afterAll` without importing them explicitly — they're injected into the global scope by the Vitest runner.

---

## 8. Data Hooks

`lib/hooks/useAccounts.ts` and `useTransactions.ts` are simple `useEffect` fetch hooks. They call the typed API client and return `{ data, loading, error }`.

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

In the browser, `fetch('/api/accounts')` is intercepted by the MSW service worker and returns the mock account list. In tests, the same fetch is intercepted by the MSW Node server. The hook doesn't know or care which — it just calls `fetch`.

---

## 9. Build Verification

After all files are in place, `npm run build` runs the Next.js production build and the TypeScript compiler together. A clean build with no errors confirms:

- All imports resolve correctly
- All types check across the full graph (types → handlers → hooks → components → pages)
- All routes compile to static output

```
Route (app)                    Size     First Load JS
┌ ○ /                          158 B         87.5 kB
├ ○ /dashboard                 158 B         87.5 kB
├ ○ /accounts                  158 B         87.5 kB
├ ○ /transactions               158 B         87.5 kB
├ ○ /transfer                  158 B         87.5 kB
├ ○ /bills                     158 B         87.5 kB
├ ○ /service-requests          158 B         87.5 kB
└ ○ /cards                     158 B         87.5 kB
```

The tiny per-route size reflects that the placeholder page components are almost empty at this stage. As real components are added in subsequent sessions these numbers will grow — but the shared JS chunk will not change much because it is dominated by React and Next.js internals.

---

## Summary

| Layer | Files | What It Does |
|-------|-------|-------------|
| Types | `types/*.ts` | Domain contracts — shared by handlers, hooks, and components |
| Theme system | `lib/themes/`, `globals.css`, `tailwind.config.ts`, `useTheme` | CSS variable themes, four bank identities, sidebar switcher |
| Illustrated logos | `components/layout/ThemeLogo.tsx` | Per-bank SVG scene — no image files, no network requests |
| Layout shell | `components/layout/Shell.tsx` | Composes Header + Sidebar + overlay + content area + Footer |
| Header | `components/layout/Header.tsx` | Fixed top bar — logo, bank name, hamburger (mobile), user pill |
| Sidebar | `components/layout/Sidebar.tsx` | Slide-in drawer (mobile) / always-visible panel (desktop) |
| UI primitives | `components/ui/` | Button, Input, Select, Badge, Panel — theme-aware by default |
| Mock API | `mocks/` | MSW handlers, browser worker, Node server |
| Data hooks | `lib/hooks/` | Fetch wrappers that return typed data from the mock API |
| App wiring | `app/layout.tsx`, `app/(banking)/layout.tsx`, `MSWProvider` | Connects all layers into a working Next.js app |

---

## Next

[Section 03 →]() — Building the Dashboard page: StatCard grid, QuickActions, AccountSummary, and RecentTransactions, all wired to live mock data.
