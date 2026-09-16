---
trigger: glob
description: rules for testing AI grounding, refusal categories, access tier enforcement, and fallback check-ins
globs: "tests/**"   - "**/*.test.ts"   - "**/*.spec.ts"   - "playwright/**" description: rules for testing AI grounding, refusal categories, access tier enforcement, and fallback check-ins
---

1. Test grounding check engine against synthetic hallucinated/unsupported outputs to ensure "not available" blocking works.
2. Maintain and run automated tests for all refusal categories (medical, fitness safety, cross-member queries).
3. Verify tier-gating logic: Basic tier queries must fail to return Premium-only shared records (e.g., training plans).
4. Assert staff manual check-in entries are data-equivalent and structurally indistinguishable from app check-ins.
5. Verify invalid or corrupted sourceRecordId writes are rejected or flagged during question logging.