---
trigger: glob
description: rules for member tiers, check-ins, balance ground truth, and restriction thresholds
globs: rules for member tiers, check-ins, balance ground truth, and restriction thresholds
---

1. Enforce Basic and Premium tiers; Premium tier strictly required for training plans and trainer guidance.
2. Read balance and expiry exclusively from Flutterwave gateway data; never compute or manually edit ledger balances.
3. Drop member tier to Basic immediately upon payment lapse.
4. Define non-payment account restriction threshold as a named, configurable constant (default: 7 days).
5. Do not write account restriction lockout behavior until unresolved PRD restriction rules are approved.
6. Ensure check-in creates a CheckIn record with member ID, timestamp, and method (APP vs STAFF_MANUAL).