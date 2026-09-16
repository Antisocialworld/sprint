---
trigger: glob
globs: whenever the agent handles billing, payments, balances, or Flutterwave integration
---

---
description: whenever the agent handles billing, payments, balances, or Flutterwave integration
---

1. Balance/expiry strictly from Flutterwave data. No local calculation or manual editing (prevents drift and untracked overrides).
2. App must never touch or hold member money. All funds route directly to the gym's merchant account via the gateway.
3. On payment lapse, drop member to Basic tier immediately.
4. Account restriction threshold is a named, adjustable constant. 
5. Restriction behavior is undefined. Do not implement without asking.
6. Split payment logic and percentage are undecided. Do not implement.
7. Do not write payment code until docs/payments-rules.md is approved.