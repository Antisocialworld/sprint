---
name: prisma-safe-migration
description: Step-by-step safety workflow for modifying Prisma schemas, auditing migration changes against rule constraints, requesting approval, and running Prisma commands.
---

# Safe Prisma Migration Workflow

## Pre-requisites
- Constraints in [`schema.md`](file:///c:/Sprinter/.agents/rules/rules/schema.md), [`agent-discipline.md`](file:///c:/Sprinter/.agents/rules/agent-discipline.md).

## Procedure

### Step 1: Audit Proposed Schema Edits
1. Review proposed changes in `prisma/schema.prisma`.
2. Confirm no manual ledger fields are added for balance or expiry.
3. Confirm `SharedRecord` retains `version` and approval fields.
4. Confirm `Question.sourceRecordId` remains a string identifier.
5. Confirm `CheckInMethod` enum retains `APP` and `STAFF_MANUAL`.

### Step 2: Request User Approval
1. Display exact schema diff to user.
2. Wait for explicit user confirmation before executing migration commands.

### Step 3: Execute Migration and Generate Client
1. Format schema:
   ```bash
   npx prisma format
   ```
2. Run migration:
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```
3. Generate updated client:
   ```bash
   npx prisma generate
   ```

### Step 4: Verify Type Safety
1. Assert migration script exists in `prisma/migrations/`.
2. Run TypeScript compilation check:
   ```bash
   npm run type-check
   ```
