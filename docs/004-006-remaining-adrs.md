# ADR 004 — MSW for mock API layer

**Status:** Accepted
**Date:** May 2026
**Author:** Nitin Sharma

---

## Context

The reference app needs realistic API behaviour without a running backend. The mock layer must work in both browser (development) and Node.js (test) environments, with minimal configuration difference between the two.

## Decision

Use **Mock Service Worker (MSW v2)** for all API mocking.

MSW intercepts requests at the network level (via a Service Worker in the browser, via a Node.js interceptor in tests). This means:
- Components make real `fetch` calls — no mocking of `fetch` itself
- API handlers are shared between development and test environments
- Realistic network latency can be simulated via `NEXT_PUBLIC_API_DELAY_MS`
- Handlers can return error states to test UI error boundaries

## Consequences

- `public/mockServiceWorker.js` must be committed and kept up to date (`npx msw init public/`)
- MSW is excluded from production builds via `process.env.NODE_ENV` check in `app/layout.tsx`
- All handlers are typed against the same response types used in production API contracts — any drift is caught by TypeScript

---

# ADR 005 — Scheduled and recurring transfers with live preview

**Status:** Accepted
**Date:** May 2026
**Author:** Nitin Sharma

---

## Context

Scheduled and recurring transfers are high-stakes actions. Errors (wrong date, wrong amount, wrong beneficiary) can cause financial harm that is difficult to reverse. The UI must reduce error risk without adding friction.

## Decision

Show a **live preview box** beneath the form that appears as the user fills in the amount and date fields, summarising what will happen in plain language before submission:

> *"₹10,000 will be transferred on 15 May 2026. Funds are reserved 1 day before."*

This preview:
- Appears immediately on valid input (no submit required)
- Disappears if the user clears the fields
- Uses `toLocaleDateString('en-IN')` for date formatting — locale-appropriate and unambiguous
- Is styled in a blue info box (not a warning) — informational, not alarming

## Rationale

Financial transaction previews are a well-established pattern in payments UX (see: IMPS/NEFT confirmation screens, UPI payment review step). The preview box brings this pattern inline to reduce the cognitive gap between form input and final confirmation.

## Consequences

- Preview logic is purely client-side — no API call required
- The submit button label is "Review & send" not "Send" — reinforcing that a confirmation step follows

---

# ADR 006 — Persistent callback banner as service request safety net

**Status:** Accepted
**Date:** May 2026
**Author:** Nitin Sharma

---

## Context

Service request pages in banking apps frequently leave customers stranded when their need doesn't match any listed request type. Common resolution: abandon the app, call the branch, wait on hold.

## Decision

Place a **persistent "Can't find what you're looking for?" banner** below the service request tile grid. The banner:
- Is always visible on the New request tab — not hidden behind pagination, scroll, or search
- Expands inline to a callback request form (no navigation away)
- Captures: preferred time slot, subject/topic, preferred language
- Offers pre-set time slots (today/tomorrow windows) with a "Choose a date" fallback
- Includes a footer note: *"Callbacks available Mon–Sat, 9 AM – 6 PM. We'll call from a verified NovaBank number."*
- Is tracked in My requests with a reference number, same as any other service request

## Rationale

The banner's persistent placement is intentional. Putting it at the bottom of a scrollable list, or behind a "contact us" link in the footer, signals that the bank treats callbacks as a last resort. Persistent placement signals the opposite — the bank is proactively offering human help.

The reference number for a completed callback (shown in request history: *"Callback — Loan & EMI query · Hindi · Called 4 Apr 2026, 3:12 PM"*) closes the loop and gives the customer a record of the interaction.

## Consequences

- The callback form must never be the only way to contact support — phone number and branch finder remain accessible via the footer
- The language preference field routes the call to the correct team — this requires backend routing logic in production
- Time slot selection is UI-only in the mock; production implementation requires integration with a scheduling system
