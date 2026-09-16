---
name: flutterwave-payment-webhook
description: Workflow for verifying Flutterwave webhook signatures, syncing transaction status, updating member balances/expiry, handling payment lapse tier downgrades, and restriction window timing.
---

# Flutterwave Payment & Webhook Pipeline

## Pre-requisites
- Constraints in [`payment.md`](file:///c:/Sprinter/.agents/rules/payment.md), [`membership.md`](file:///c:/Sprinter/.agents/rules/rules/membership.md).

## Procedure

### Step 1: Authenticate Webhook Signature
1. Intercept incoming POST request at webhook route.
2. Read `verif-hash` header.
3. Compare `verif-hash` with environment secret. Reject with 401 response if signature fails.

### Step 2: Record Payment Transaction
1. Extract `tx_ref`, `amount`, `status`, and customer identity.
2. Upsert `Payment` row in Postgres (`gatewayRef = tx_ref`, `amountNaira = amount`, `status`).

### Step 3: Sync Member Balance and Tier Status
1. If `status == SUCCESS`:
   - Update `Member.balanceNaira` and `Member.expiryDate` directly from gateway payload.
   - Upgrade `Member.tier = PREMIUM` if plan payment succeeded.
2. If payment lapsed or renewal failed:
   - Downgrade `Member.tier = BASIC` immediately.

### Step 4: Evaluate Restriction Window
1. Compute days elapsed since `Member.expiryDate`.
2. Compare elapsed days against `NON_PAYMENT_RESTRICTION_DAYS` constant (default: 7 days).
3. Flag account for restriction policy handling if threshold is exceeded.
