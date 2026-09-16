## Product Summary
Sprint is a mobile app a gym gives its members. It answers questions from the gym's own records instead of a staff member guessing at the desk. It holds shared rules, the same for everyone, and private records, belonging to one member. Members check in, ask questions in plain language, and pay their subscription in app through Flutterwave. The gym owns its own merchant account. Sprint never holds member funds. Sprint may earn a percentage of each transaction, paid directly by the gateway, without ever holding the funds itself.

## Problem
A gym desk answers the same five questions all day: class times, guest policy, card access, attendance totals, outstanding balance. Staff either know the answer, guess, or have no ledger in front of them to check. Wrong money answers cost trust and members. The desk closes at eight; members needing an answer after that get nothing.

## Goals
1. Answer the gym's five recurring desk questions without staff involvement.
2. Make attendance and balance answerable to the exact record, at any hour.
3. Reach roughly sixteen app opens per active member per month, driven by check in. No baseline exists yet; one must be measured in the first weeks after launch.
4. Collect the data version one needs so version two can add reminders and follow up.
5. Never let Sprint hold member money.

## Users and Personas
Member is the primary user. Example: Chidinma, 27, trains four evenings a week. She checks in on every visit, and asks a specific question a couple of times a month.

Staff use a separate internal tool, not the member app, with its own login and permissions. They draft shared record updates and record manual check ins when a member's phone is unavailable.

Owner uses the same internal tool at a higher permission level, approving shared record changes and viewing payment status.

Assumption. Staff and owner tools are simple web screens, separate from the member app, since they do real internal work and need real accounts.

## Scope

In scope for version one.
1. Answering questions from shared records.
2. Answering questions from a member's own private record.
3. Check in, including a staff side manual fallback.
4. In app payment and balance viewing.
5. Training plans and trainer guidance, Premium only.
6. Logging every question, its answer source, and every check in and payment event, purely to prepare for version two. No direct version one benefit; a deliberate early investment.

Out of scope for version one.
1. Renewal reminders or any automated, unprompted message.
2. Any agent that decides on its own to contact a member.
3. A managed or aggregator payment model. The gym holds its own merchant account.
4. Multi gym support.

## Functional Requirements
1. Checking in writes an attendance record tied to the member and a timestamp.
2. Staff can record a manual check in when a member's phone is unavailable; it must be indistinguishable from an app check in in the resulting data.
3. A member can ask a question in plain text and get an answer sourced only from shared or private records, never outside data.
4. Every answer shows the exact record used and when it was last confirmed.
5. If no record answers the question, the app says so and names the closest related record it does have.
6. The app maintains a written list of refusal categories, such as medical or fitness safety advice, with example test questions per category, tested before launch.
7. The app refuses to answer about any member other than the one logged in.
8. A member can view and pay their outstanding balance through Flutterwave in app.
9. Balance and expiry are computed from Flutterwave transaction and subscription data, never a manual ledger.
10. On payment lapse, the member drops to Basic access immediately.
11. After seven days of continued non payment, the account is restricted. Seven days is a starting choice, to be revisited after the first real billing cycle.
12. Staff can draft a shared record change; the owner must approve it before it's visible to members.
13. Every question, answered or not, is logged with which record and which version of it answered it.
14. Empty records show a clear not added yet message, never a blank screen or error.
15. Every generated answer is checked against its source record before being shown. Any unsupported claim is blocked and replaced with a not available response.
16. Any sourceRecordId is validated against a real SharedRecord id or private field name before saving. An unverifiable source is rejected or flagged, never saved silently.

## AI and AI Related Tools and Solutions
Sprint uses a language model to turn a plain language question into a query against the right record type, and to phrase the retrieved record back in plain English. The model may only restate the retrieved record, never add to it.

A grounding check runs after generation, before the answer is shown, comparing it against the source record. Any unsupported claim is blocked and replaced with a not available response.

Shared records, timetable, prices, rules, policies, are searched by meaning, since members phrase questions differently, hence a vector database. Private records, attendance, balance, expiry, are fetched by exact member id, never by semantic search, since they must never be searched across members.

Assumption. A hosted language model API is assumed, since the gym has no technical staff to run infrastructure.

## Technical Architecture

Stack: Next.js App Router for the member app and the internal staff and owner tool, TypeScript throughout, Prisma as the ORM, PostgreSQL as the database.

Flow: a question goes from the Next.js client to a server route, which classifies it as a shared record lookup, via vector search, or a private record lookup, via a direct Postgres query by member id. It assembles the record into a prompt, calls the model, runs the grounding check, and logs the interaction with the record version used.

Prisma data model.

```prisma
model Member {
  id            String    @id @default(cuid())
  name          String
  phone         String    @unique
  tier          Tier      @default(BASIC)
  expiryDate    DateTime?
  balanceNaira  Int       @default(0)
  createdAt     DateTime  @default(now())

  checkIns      CheckIn[]
  payments      Payment[]
  questions     Question[]
}

enum Tier {
  BASIC
  PREMIUM
}

model CheckIn {
  id         String   @id @default(cuid())
  memberId   String
  member     Member   @relation(fields: [memberId], references: [id])
  method     CheckInMethod
  createdAt  DateTime @default(now())
}

enum CheckInMethod {
  APP
  STAFF_MANUAL
}

model Payment {
  id              String   @id @default(cuid())
  memberId        String
  member          Member   @relation(fields: [memberId], references: [id])
  amountNaira     Int
  status          PaymentStatus
  gatewayRef      String   @unique
  createdAt       DateTime @default(now())
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

model SharedRecord {
  id           String   @id @default(cuid())
  type         SharedRecordType
  content      String
  version      Int      @default(1)
  tierRequired Tier     @default(BASIC)
  approved     Boolean  @default(false)
  draftedById  String
  approvedById String?
  updatedAt    DateTime @updatedAt
}

enum SharedRecordType {
  TIMETABLE
  PRICING
  RULE
  GUEST_POLICY
  TRAINING_PLAN
}

model Question {
  id                    String   @id @default(cuid())
  memberId              String
  member                Member   @relation(fields: [memberId], references: [id])
  text                  String
  answered              Boolean
  sourceType            SourceType?
  sourceRecordId        String?
  sourceRecordVersion   Int?
  createdAt             DateTime @default(now())
}

enum SourceType {
  SHARED_RECORD
  PRIVATE_RECORD
}

model StaffAccount {
  id        String   @id @default(cuid())
  name      String
  role      StaffRole
}

enum StaffRole {
  STAFF
  OWNER
}
```

Assumption. sourceRecordId is a string, not a typed foreign key, since it can point to a SharedRecord or a named private field on Member; this is why requirement sixteen requires application level validation on every write.

## Vector Database Architecture and Design
Only shared records are embedded; private records never are, since they must never be searchable across members. This is a hard boundary.

Each SharedRecord is embedded on approval and reembedded on change. Its version field increases on change, and each embedded entry carries that version as metadata, keeping the vector store in sync with Postgres and letting a past answer be traced to the exact record version live at the time.

A question is embedded at query time and matched against shared record vectors. The top match's Postgres id fetches the full, current record before showing it, so members always see live data. The record's version is stored on the Question row.

Assumption. A managed, free tier eligible vector database is assumed, since version one must run on free tools.

## Vector Database Model
Each vector entry's id matches its SharedRecord id in Postgres. It stores the content embedding, plus metadata: type, tier required, approved status, version.

Query time filters by metadata first, keeping only approved records at or below the member's tier, then ranks by similarity. An empty filtered result returns a not available response; the system never falls back to an unfiltered search, which would risk leaking a higher tier record.

## Business Model
The gym pays Sprint a flat monthly fee. Sprint also receives a percentage of each member transaction, paid directly by Flutterwave as a split payment; Sprint never receives the full amount or holds funds. The exact percentage is unset, listed under open questions.

Risk. A gym with few paying members generates little transaction revenue for Sprint, even while Sprint keeps hosting its data. The flat fee exists partly to cover this.

## Success Metrics
1. Number of the desk's five recurring question types now answered by Sprint, tracked weekly.
2. Average app opens per active member per month, target roughly sixteen, measured against a baseline collected after launch.
3. Percentage of questions answered versus refused for missing records, to catch record gaps early.
4. Time from a shared record draft to owner approval, to catch a slow approval process before it causes stale answers.
5. Number of payment lapses reaching the seven day restriction point. Seven days is a starting choice, to be revisited with real billing data.

## Risks
1. A wrong money answer costs trust with nobody watching live to catch it. Balance and expiry come directly from Flutterwave, reducing but not removing this risk if gateway data is delayed. Under the new business model, lost trust also directly reduces Sprint's own transaction revenue.
2. Attendance undercounting if app check in fails, depending on phone, connectivity, and power. The staff manual fallback mitigates this only if staff remember to use it.
3. Day one emptiness if shared records aren't fully drafted and approved before launch.
4. The model could generate an unsupported answer. Mitigated by the grounding check, which itself needs testing against real failure cases before launch.
5. An unverified sourceRecordId could point to a record that never existed, breaking the trace back feature when needed most. Mitigated by requirement sixteen's validation rule.

## Open Questions
1. Which vector database and language model provider to use, given the free tier requirement.
2. Whether a restricted member can still check in physically, a door access question outside the app's control, or only loses in app functionality.
3. What exact percentage of each transaction Sprint should take.
