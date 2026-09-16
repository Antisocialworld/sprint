---
trigger: glob
description: rules for git workflow, commits, schema migrations, and version control hygiene
globs: ".gitignore"   - "docs/**"   - "prisma/schema.prisma"   - ".env.example" description: rules for git workflow, commits, schema migrations, and version control hygiene
---

1. Make one atomic change at a time; avoid sprawling commits across multiple domain boundaries.
2. Never commit .env or secrets; ensure all environment variables are declared in .env.example.
3. Do not commit database schema or migration changes without prior approval.
4. Keep the written refusal list and its category test questions committed and version-tracked in the repository.
5. Obtain approval for specification docs (e.g., docs/vector-search-rules.md, docs/payments-rules.md) before writing implementation code.