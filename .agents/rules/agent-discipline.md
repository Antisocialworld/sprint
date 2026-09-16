---
trigger: always_on
description: whenever the agent modifies code, adds packages, or makes assumptions
---

1. Make one change at a time. Do not touch unrequested files.
2. Ask before adding any package.
3. List assumptions at the end of every response.
4. Stop and ask if documents are silent. Never guess.
5. Never touch DB directly (no raw SQL, Prisma Studio edits, or direct client calls). Use Prisma. Schema changes need explicit approval via prisma-migration skill.
6. Empty records must show "not added yet". No blank screens or errors.
7. never push anything to git without my authority 