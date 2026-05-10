# ADR 001 — React + TypeScript + Next.js as the primary stack

**Status:** Accepted
**Date:** May 2026
**Author:** Nitin Sharma

---

## Context

A reference banking UI implementation needs a stack that is:
- Widely adopted in enterprise fintech
- Type-safe to demonstrate production-grade engineering standards
- Capable of server-side rendering for performance and SEO
- Easy to run locally without infrastructure dependencies

## Decision

Use **React 18 + TypeScript (strict mode) + Next.js 14 (App Router)**.

- **React** is the dominant UI framework in financial services engineering. Familiarity is universal.
- **TypeScript strict mode** enforces type safety across all API contracts, theme configurations, and component props — demonstrating the standard expected in a principal architect's codebase.
- **Next.js App Router** provides file-based routing, server components, and a clean layout model that maps naturally to a multi-page banking application. It also enables future server-side data fetching without architectural changes.
- **Tailwind CSS** for utility-first styling, keeping component CSS co-located and eliminating stylesheet sprawl.
- **Vitest** for unit tests (faster than Jest, native ESM support).
- **Playwright** for end-to-end tests.

## Alternatives considered

| Option | Reason not chosen |
|--------|------------------|
| Vite + React SPA | No SSR; less relevant to enterprise banking context |
| Angular | Valid for enterprise but lower demonstration reach |
| Vue 3 | Strong framework but React is more prevalent in fintech hiring |
| Remix | Excellent but less familiar; Next.js is the reference standard |

## Consequences

- App Router requires React Server Components awareness — components that use hooks must be explicitly marked `'use client'`
- MSW works in both browser (development) and Node (test) environments with the same handler definitions
- TypeScript strict mode means all `any` types must be justified — this is intentional
