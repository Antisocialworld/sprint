---
trigger: glob
globs: src/server/whenever the agent writes code for AI answers, vector search, or grounding checks
---

---
description: whenever the agent writes code for AI answers, vector search, or grounding checks
---

1. AI answers must pass grounding check against source record. Unsupported claims become "not available" (see grounding-check skill).
2. Refusal list (with test questions) must be checked-in. Refuse matching questions regardless of records.
3. If no record answers, name the closest related record. Never return a blank response.
4. Shared records use vector search. Private records fetch by exact member ID only. Never embed/vector-search private records (prevents cross-member leaks).
5. Vector search filters by tier and approval BEFORE similarity rank. Empty results return "not available". No unfiltered fallback.
6. Do not write vector search code until docs/vector-search-rules.md is approved.
7. sourceRecordId must be validated against a real SharedRecord or private field before saving.