---
name: question-grounding-pipeline
description: Procedural pipeline for classifying member questions, executing tier-filtered vector lookups or exact private record queries, LLM response generation, grounding verification, and interaction logging.
---

# Question & Grounding Execution Pipeline

## Pre-requisites
- Constraints in [`ai.md`](file:///c:/Sprinter/.agents/rules/ai.md), [`retrieval.md`](file:///c:/Sprinter/.agents/rules/rules/retrieval.md), [`privacy.md`](file:///c:/Sprinter/.agents/rules/privacy.md), [`copy.md`](file:///c:/Sprinter/.agents/rules/rules/copy.md).

## Procedure

### Step 1: Classify Question and Audit Refusals
1. Receive question text and authenticated `memberId`.
2. Match question against refusal categories list. If matched, return refusal copy immediately.
3. Classify question type as `SHARED_RECORD` or `PRIVATE_RECORD`.

### Step 2: Fetch Source Record
- **If `SHARED_RECORD`**:
  1. Generate vector embedding for question text via Gemini API.
  2. Perform vector search filtered by `approved = true` AND `tierRequired <= member.tier`.
  3. Return "not available" if filtered vector results are empty. Do not attempt unfiltered search.
  4. Fetch current `SharedRecord` from Postgres using top matched vector ID.
- **If `PRIVATE_RECORD`**:
  1. Query exact private fields from Postgres using `memberId` from session context only.

### Step 3: Generate and Verify Grounding
1. Build prompt containing retrieved record text and user question.
2. Generate plain-English response using Gemini model.
3. Compare generated claims against source record text.
4. Replace output with exact string "not available" if response contains unsupported claims.

### Step 4: Log Interaction
1. Validate `sourceRecordId` against database records (`SharedRecord.id` or private field name).
2. Insert `Question` record into Postgres (`memberId`, `text`, `answered`, `sourceType`, `sourceRecordId`, `sourceRecordVersion`).
3. Return grounded answer with source record reference ID and last updated timestamp to UI.
