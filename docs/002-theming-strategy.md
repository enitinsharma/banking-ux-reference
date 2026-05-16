# ADR 002 — CSS custom properties for multi-tenant theming

**Status:** Accepted
**Date:** May 2026
**Author:** Nitin Sharma

---

## Context

The banking platform serves multiple financial institution (FI) tenants. Each FI has its own brand identity — colours, logo, and tone. The theming system must allow per-tenant customisation without:
- Duplicating component code
- Requiring a rebuild per tenant
- Introducing runtime CSS-in-JS overhead

This mirrors the real-world constraint in core banking platforms, where a single platform serves 1,000+ financial institution tenants.

## Decision

Use **CSS custom properties (CSS variables)** defined at `:root` level, switched via a `data-theme` attribute on the `<html>` element.

```css
:root[data-theme="arctic-white"] {
  --accent: #2563eb;
  --accent-light: #eff6ff;
  --bg-sidebar: #f8faff;
  --header-bg: #1e3a5f;
  /* ... full token set */
}
```

All components reference variables exclusively — no hardcoded hex values anywhere in component CSS.

Theme switching at runtime:

```typescript
document.documentElement.setAttribute('data-theme', 'forest-green');
```

Four themes ship out of the box:
- `midnight-navy` — dark navy, blue accent (default)
- `arctic-white` — white/light blue, professional
- `forest-green` — dark green, sustainability positioning
- `warm-sandstone` — warm brown, wealth management / private banking

## Alternatives considered

| Option | Reason not chosen |
|--------|------------------|
| CSS-in-JS (styled-components, Emotion) | Runtime overhead; harder to override per tenant |
| Tailwind themes via `tw-merge` | Works but requires Tailwind config rebuild per tenant |
| SCSS variables | Compile-time only; cannot switch at runtime without a rebuild |
| JSON theme files → inline styles | Too verbose; breaks cascade and pseudo-selectors |

## Consequences

- Adding a new tenant theme is a single TypeScript file + a `:root[data-theme="..."]` CSS block — no component changes
- Theme tokens must be documented (see `docs/wiki/theming-guide.md`) so FI implementation teams know the full variable contract
- Dark mode per theme can be added later by adding `[data-theme="..."][data-mode="dark"]` selectors — no architectural change required
- CSS custom properties have universal browser support (IE 11 excluded — acceptable for digital banking)
