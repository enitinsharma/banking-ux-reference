# Theming guide

This guide explains how to customise or add a new theme for a financial institution tenant.

---

## How themes work

Every colour in the app is a CSS custom property. The full token set is defined per theme under `lib/themes/`. At runtime, the `data-theme` attribute on `<html>` controls which token set is active.

No component code changes are needed to switch themes.

---

## Full token reference

| Token | Description | Example (Arctic White) |
|-------|-------------|----------------------|
| `--bg` | Main content background | `#ffffff` |
| `--bg-sidebar` | Sidebar background | `#f8faff` |
| `--bg-surface` | Card / panel surface | `#f8faff` |
| `--bg-surface2` | Secondary surface (hover states) | `#f1f5fb` |
| `--accent` | Primary brand accent | `#2563eb` |
| `--accent-light` | Accent tint (backgrounds) | `#eff6ff` |
| `--accent-mid` | Accent border | `#bfdbfe` |
| `--accent-text` | Text on accent-light backgrounds | `#1e40af` |
| `--border` | Default border | `#e2e8f0` |
| `--border-accent` | Accent-tinted border | `#dbeafe` |
| `--text-primary` | Body text | `#1e293b` |
| `--text-secondary` | Muted labels | `#64748b` |
| `--text-muted` | Hints, metadata | `#94a3b8` |
| `--header-bg` | Top header / sidebar header | `#1e3a5f` |
| `--footer-bg` | Footer background | `#f1f5f9` |
| `--footer-border` | Footer top border | `#e2e8f0` |
| `--footer-text` | Footer link colour | `#64748b` |
| `--footer-copy` | Copyright text | `#94a3b8` |
| `--gold` | Rewards accent | `#b45309` |
| `--gold-bg` | Rewards tint background | `#fffbeb` |
| `--gold-border` | Rewards border | `#fcd34d` |
| `--pos` | Positive / credit amounts | `#16a34a` |
| `--neg` | Negative / debit amounts | `#dc2626` |

Semantic tokens (`--pos`, `--neg`, `--gold`) should generally not be changed per theme — they carry fixed meaning. Brand tokens (`--accent`, `--header-bg`, `--bg-sidebar`) are the primary levers for FI customisation.

---

## Adding a new theme

**Step 1** — Create `lib/themes/my-bank.ts`:

```typescript
import type { BankTheme } from './theme.types';

export const myBankTheme: BankTheme = {
  id: 'my-bank',
  name: 'My Bank',
  colors: {
    bg: '#ffffff',
    bgSidebar: '#f0f8f3',
    bgSurface: '#f0f8f3',
    bgSurface2: '#e4f2ea',
    accent: '#0a5c36',
    accentLight: '#e8f5ee',
    accentMid: '#a3d4b8',
    accentText: '#073d24',
    border: '#d4e8db',
    borderAccent: '#b8dcc6',
    textPrimary: '#0d2b1a',
    textSecondary: '#4a7a5c',
    textMuted: '#85a893',
    headerBg: '#073d24',
    footerBg: '#f0f8f3',
    footerBorder: '#d4e8db',
    footerText: '#4a7a5c',
    footerCopy: '#85a893',
  },
};
```

**Step 2** — Register in `lib/themes/index.ts`:

```typescript
export { myBankTheme } from './my-bank';

export const themes = {
  'midnight-navy': midnightNavyTheme,
  'arctic-white': arcticWhiteTheme,
  'forest-green': forestGreenTheme,
  'warm-sandstone': warmSandstoneTheme,
  'my-bank': myBankTheme,        // add here
};
```

**Step 3** — Add CSS variables in `app/globals.css`:

```css
:root[data-theme="my-bank"] {
  --bg: #ffffff;
  --bg-sidebar: #f0f8f3;
  /* ... map all tokens from your theme object */
}
```

**Step 4** — Set the theme:

```typescript
// In your tenant config or environment variable
document.documentElement.setAttribute('data-theme', 'my-bank');
```

That's it. Every component in the app now renders in your theme.

---

## Logo customisation

The logo text (`novabank`) is rendered as plain text with a `<span>` for the accent colour. In production, replace with an `<Image>` component pointing to the FI's logo asset:

```tsx
// components/layout/Sidebar.tsx
<div className="logo">
  <Image src={tenantConfig.logoUrl} alt={tenantConfig.name} width={120} height={28} />
</div>
```

Pass `tenantConfig` via Next.js environment variables or a server-side config fetch.
