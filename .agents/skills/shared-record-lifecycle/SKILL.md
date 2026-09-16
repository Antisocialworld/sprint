---
name: shared-record-lifecycle
description: Workflow for staff drafting, owner approval, PostgreSQL version incrementing, Gemini embedding, and metadata vector indexing of SharedRecords.
---

# Shared Record Lifecycle Workflow

## Pre-requisites
- Constraints in [`retrieval.md`](file:///c:/Sprinter/.agents/rules/rules/retrieval.md), [`ai.md`](file:///c:/Sprinter/.agents/rules/ai.md), [`schema.md`](file:///c:/Sprinter/.agents/rules/rules/schema.md).

## Procedure

### Step 1: Draft Record
1. Receive `type`, `content`, and `tierRequired` from staff session.
2. Insert `SharedRecord` row with `approved = false`, `version = 1`, `draftedById = staff.id`.
3. Stop execution. Do not generate embeddings for unapproved drafts.

### Step 2: Approve and Version Record
1. Verify active session role is `OWNER`.
2. Fetch target `SharedRecord` by ID.
3. Set `approved = true` and `approvedById = owner.id`.
4. Increment `version` counter by 1 if modifying an existing record.
5. Save updated `SharedRecord` row.

### Step 3: Embed and Index Vector
1. Extract record content, `id`, `type`, `tierRequired`, and `version`.
2. Generate vector embedding using Gemini embedding API.
3. Upsert vector into store with metadata (`type`, `tierRequired`, `version`, `approved = true`).
4. Assert vector store confirmation before returning success.
