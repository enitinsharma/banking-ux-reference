# ADR 003 — 1 pt = ₹1 rewards transparency policy

**Status:** Accepted
**Date:** May 2026
**Author:** Nitin Sharma

---

## Context

Most banking rewards programmes use obscure conversion rates (e.g. 1 pt = ₹0.10, or "4 pts per ₹150 spent") that require mental arithmetic and erode customer trust. Customers frequently feel cheated when they discover their accumulated points are worth far less than assumed.

This creates a design choice: follow industry convention, or differentiate through transparency.

## Decision

**1 Nova point = ₹1. Always.**

This policy is surfaced everywhere points appear in the UI:
- Dashboard stat card: `2,480 pts = ₹2,480`
- Rewards tab balance: shown side by side at equal visual weight
- Cashback redemption option: `1 pt = ₹1 · Min 100 pts · up to ₹2,480`
- Recent points activity: every line shows `+124 pts = ₹124`
- Promise box at top of rewards tab: *"1 Nova point = ₹1. Always. No conversions, no hidden rates, no expiry surprises."*

The earning rate is expressed honestly as `X pts per ₹100 spent` — a customer spending ₹100 on online shopping earns 5 pts = ₹5 cashback value. This is clearly a 5% reward rate, stated plainly.

## Rationale

- **Trust** — transparency in rewards is a meaningful differentiator in a category where customers are chronically under-informed
- **Simplicity** — removing conversion complexity reduces cognitive load and support call volume
- **Credibility** — an FI that doesn't "play tricks" with rewards is signalling broader ethical alignment, which correlates with customer retention in financial services research
- **Design coherence** — the `≈` symbol (approximate) was deliberately removed from all value displays; exact value, no approximation needed

## Alternatives considered

| Option | Reason not chosen |
|--------|------------------|
| Standard 0.10–0.25 pt/₹ rate | Obscures real value; erodes trust |
| Points with tiered redemption rates | Complexity without customer benefit |
| No rewards programme | Missed retention and engagement opportunity |

## Consequences

- The 1:1 rate means the bank bears a higher redemption cost than industry average — this is a product business decision, not a UI decision, and is noted here for completeness
- Travel voucher redemption offers a 20% bonus (i.e. 1 pt = ₹1.20 in travel value) to incentivise specific redemption behaviour without obscuring the base rate
- Any future change to the rate must update the promise box copy — the text is a contractual-adjacent statement to customers
