---
trigger: glob
description: rules for database schema design, Prisma models, migrations, and sourceRecordId validation
globs: "prisma/schema.prisma"   - "prisma/migrations/**"   - "src/server/db/**"   - "src/types/**" description: rules for database schema design, Prisma models, migrations, and sourceRecordId validation
---

1. Do not modify prisma/schema.prisma or run migrations without explicit approval.
2. Never create manual editing fields or local calculation logic for balanceNaira or expiryDate; both must derive strictly from Flutterwave gateway data.
3. sourceRecordId on Question must remain a loose string identifier (pointing to SharedRecord.id or Member private field) and must be validated at application level on every write.
4. SharedRecord schema must maintain version (incrementing int), approved (boolean), draftedById, and approvedById for audit and vector synchronization.
5. Ensure CheckInMethod enum (APP, STAFF_MANUAL) renders staff fallback check-ins structurally identical to member app check-ins.
6. Private member records must never be linked to vector embeddings or shared record schemas.