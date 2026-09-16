---
trigger: glob
globs: .env, .env.example
---

---
description: whenever the agent needs to use or modify environment variables
---

1. Require .env.example entry for every variable.
2. Never commit .env (add to .gitignore).
3. Stop and ask for .env.example approval before adding variables.
4. No hard-coded credentials anywhere.
5. Read env vars through a single validated config module only.