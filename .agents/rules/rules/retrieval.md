---
trigger: glob
description: rules for query classification, vector search, private record fetching, and grounding checks
globs: rules for query classification, vector search, private record fetching, and grounding checks
---

1. Use vector search exclusively for shared records; fetch private records by exact member ID only.
2. Never embed or vector-search private member records (attendance, balance, expiry) under any circumstance.
3. Filter vector search by member tier and approved status before ranking by vector similarity.
4. Return "not available" when filtered vector search returns empty results; never perform unfiltered fallbacks.
5. Re-query Postgres by record ID after vector match to ensure live, un-cached record data is returned.
6. Validate sourceRecordId against real database records before saving logs; flag or reject unverifiable IDs.