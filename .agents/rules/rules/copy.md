---
trigger: model_decision
description: rules for UI copy, grounding fallback text, empty states, and refusal responses
---

1. Replace any generated claim unsupported by source record with exact string "not available".
2. Render "not added yet" for empty records; never display a blank screen or generic error.
3. If no record matches a query, explicitly state no record was found and name closest related record.
4. Block and refuse questions matching refusal categories (e.g., medical, fitness safety) regardless of record existence.
5. Never output data regarding any member other than the currently authenticated user.
6. Display exact source record reference (ID/type) and last confirmed timestamp on every generated answer.