# Sprint

## Description
Sprint is a mobile app a gym gives its members. It answers questions from the gym's own records instead of a staff member guessing at the desk. It holds two kinds of record: shared records, the same for every member and gated by tier, and private records, belonging to one member only.

## Who uses it
- Member: the primary user. Checks in, asks questions in plain language, views and pays their balance in app.
- Staff: use a separate internal tool, not the member app, with its own login and permissions. Draft shared record updates and record manual check ins when a member's phone is unavailable.
- Owner: uses the same internal tool at a higher permission level. Approves shared record changes and views member payment status.

## The grounding rule
Never let a generated answer state anything beyond what the source record says. Every answer must be checked against its source record before being shown, and any unsupported claim must be blocked and replaced with a not available response.

## The refusal rule
If no record answers a question, say so and name the closest related record instead of returning a blank response. Maintain a written list of refusal categories, such as medical or fitness safety advice, and refuse any question matching one, regardless of whether a record exists. Never answer a question about any member other than the one currently logged in, even if a matching private record exists.

## Defined Scope for the MVP
1. Answering questions from shared records. Every answer shown to a member must display the exact record used and when it was last confirmed.
2. Answering questions from a member's own private record.
3. Check in, including a staff side manual fallback.
4. In app payment and balance viewing. Balance and expiry always come from gateway data, never a manual ledger. On payment lapse, drop the member to Basic access immediately. After seven days of continued non payment, restrict the account. Seven days is a starting choice, not a final number, implement it as a named, adjustable value. What restrict means in practice is unresolved in the PRD. Do not implement it without asking first.
5. Training plans and trainer guidance, Premium only.
6. Logging every question, its answer source, and every check in and payment event. This logging exists to prepare for version two and has no direct MVP benefit. Any sourceRecordId logged must be validated against a real record before saving. Reject or flag an unverifiable source, never save it silently. Empty records show a clear not added yet message, never a blank screen or error.

## Not in scope for the MVP
1. Renewal reminders or any automated, unprompted message.
2. Any agent that decides on its own to contact a member.
3. A managed or aggregator payment model. The gym holds its own merchant account.
4. Multi gym support.

## Stack
- Next.js, App Router
- TypeScript
- Prisma
- PostgreSQL
- Flutterwave for payments
- PGVector for vector data
- Gemini, free tier, for the language model

## Folder map
The PRD defines two applications, the member app and the internal staff and owner tool, and describes a server route that classifies each question as a shared record lookup or a private record lookup. The PRD does not define an actual folder structure or file layout. This is unresolved. Do not invent one.

## How to work in this codebase
- Make one change at a time.
- Ask before adding any package.
- Never touch the database directly, meaning no manual data edits and no schema or migration change without asking first.
- Never build a manual way to edit balance or expiry. Both must always come from gateway data.
- List every assumption made at the end of every response.
- Stop and ask when the PRD is silent about anything, rather than guessing.
- Private records are never embedded and never vector-searched. This is a hard boundary, not a preference.
- Vector search filters by tier and approved status before ranking by similarity. An empty filtered result returns not available. There is no fallback to an unfiltered search under any circumstance.

## Where the detailed rules live
- Full Prisma schema: prisma/schema.prisma
- Vector search rules, embedding model, dimensions, similarity threshold: not yet created. Stop and ask for approval on the contents of docs/vector-search-rules.md before writing any vector search code.
- Environment variables: not yet created. Stop and ask for approval on the contents of .env.example before adding any secret or key.
- Payment integration rules, Flutterwave keys, webhook signature checks: not yet created. Stop and ask for approval on the contents of docs/payments-rules.md before writing any payment code.

## Definitions
- Tier: a member's access level, Basic or Premium. Controls which shared records, such as training plans, a member can see.
- Shared record: a record the same for every member, gated by tier, such as timetable, prices, rules, or policies.
- Private record: a record belonging to one member only, such as attendance, balance, or expiry. Never searched across members.

## Open Questions
1. What restrict means for a member's account after seven days of non payment: full lockout, or only loss of in app functionality while still able to check in physically. Unresolved in the PRD.
2. Folder structure and file layout. Not defined in the PRD.
3. Vector search configuration: embedding model, dimensions, similarity threshold. Not defined in the PRD.
4. Environment variable names and values. Not defined in the PRD.
5. Payment integration detail: Flutterwave keys, webhook signature checks. Not defined in the PRD.
6. The exact percentage of each transaction Sprint takes. Unresolved in the PRD's own Open Questions.
