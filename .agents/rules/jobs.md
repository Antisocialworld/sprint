---
trigger: glob
description: whenever the agent creates background tasks, cron jobs, or automated processes
globs: Whenever creating background tasks, cron jobs, or automated processes
---

1. No automated background jobs or agents that contact members unprompted (MVP out of scope).
2. Do not introduce a background job runner (e.g., Redis/BullMQ) without approval.