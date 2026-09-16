---
trigger: glob
globs: src/server/authentication**
---

---
description: whenever the agent works on login, auth state, or access permissions
---

1. Member app and internal tool use separate authentication contexts. No shared login/session.
2. Internal tool enforces Owner/Staff permissions at server and API levels.
3. Unauthenticated requests must be rejected before fetching data.
4. Auth implementation is undefined. Stop and ask before writing auth code.