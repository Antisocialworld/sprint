---
trigger: always_on
---


---
description: whenever the agent fetches or exposes private member data
---

1. Never return data for a member other than the logged-in user.
2. Validate session before fetching private data. Unauthenticated requests must reject immediately.
3. Fetch private records using only the active session's member ID.
4. Never aggregate, filter, or query private records across multiple members.
