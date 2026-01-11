---
id: fw-reading-10k
title: Reading a 10-K
type: framework
framework_kind: toolkit
framework_ids: []
source_id: null
output: null
perspective: economic-genealogy
status: verified
tags: [SEC, filings, procedural, finance, analysis]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream: []
downstream: []
---
# Reading a 10-K

**Type:** Toolkit Framework
**Function:** Extract signal from annual report noise

## What a 10-K Is

SEC-mandated annual report. Public companies must file. Contains:
- Business description
- Risk factors
- Financial statements
- Management discussion (MD&A)
- Legal proceedings
- Executive compensation

The form is standardized. The content reveals.

## The Reading Order

Don't start at the beginning. Start where signal concentrates:

| Priority | Section | Why |
|----------|---------|-----|
| 1 | Risk Factors | Legal requirement to disclose what could go wrong. Reveals what management actually worries about. |
| 2 | MD&A | Management's narrative. Compare to last year — what changed? What didn't they mention? |
| 3 | Segment Data | Where does money actually come from? Which parts are growing/shrinking? |
| 4 | Cash Flow Statement | Harder to manipulate than income statement. Follow the cash. |
| 5 | Notes to Financial Statements | The footnotes hold the bodies. Accounting policy changes, contingencies, related party transactions. |
| 6 | Business Description | Usually boilerplate, but first read establishes what they claim to do. |

## The Diagnostic Questions

- **What's the business model?** How do they make money? (Not what they sell — how revenue converts to profit)
- **What are the unit economics?** Revenue per customer, cost to acquire, lifetime value
- **Where's the moat?** What stops competition? (Often: nothing)
- **What's the capital structure?** Debt load, interest coverage, covenant headroom
- **What changed?** Compare to prior year. New risks? Removed risks? Segment changes?
- **What's unsaid?** Compare to competitors' 10-Ks. What do they disclose that this one doesn't?

## Red Flags

- Revenue recognition policy changes
- Related party transactions
- Frequent "non-recurring" charges that recur
- Growing gap between net income and operating cash flow
- Inventory growing faster than sales
- Receivables growing faster than revenue
- Audit firm change
- CFO departure

## Deployment

When reading a 10-K:
1. Download from SEC EDGAR (not company website — you want the official filing)
2. Ctrl+F "risk" — read entire risk factors section
3. Ctrl+F "significant" — find what management calls significant
4. Read MD&A looking for tone shifts from prior year
5. Pull cash flow statement, trace operating cash flow trend
6. Check footnotes for anything that surprises
7. Note three things you'd want to verify with outside sources