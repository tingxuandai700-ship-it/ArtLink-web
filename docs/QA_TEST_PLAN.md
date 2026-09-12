# Lightsquare QA Test Plan

## Document status

- Owner: Tingxuan Dai
- Role: Testing & QA Lead
- W6 deliverable: Test-plan structure
- Current status: Structure complete; test execution continues in later weeks
- Project: Lightsquare
- Group: C262T-4103

This document distinguishes planned testing from testing that has actually been executed.
A scenario is not marked as passed unless there is concrete test evidence.

## 1. Purpose

The purpose of this test plan is to provide a consistent approach for validating
Lightsquare features, access rules, collaboration behaviour, registration and
payment workflows, and the five-user pilot.

The plan supports the Testing & QA Lead responsibility while feature owners
remain responsible for their own vertical implementation.

## 2. Test scope

The QA scope includes:

- Collaboration Layer
- Profile collaboration availability
- Collaboration browse behaviour
- Event collaborator access rules
- Portfolio and publication access rules
- Event registration
- Payment workflow
- Privacy and direct-write restrictions
- Recommendation acceptance criteria
- Five-user pilot
- Defect recording and retesting

## 3. Test environments

### Local development

- Next.js local application
- Local Supabase stack
- PostgreSQL, Auth and RLS enabled
- Docker Desktop
- Vitest automated tests

### Shared / preview deployment

Used for integration and end-to-end verification when the team preview
deployment is available.

A local pass does not automatically count as a shared-deployment pass.

## 4. Test levels

### Automated functional tests

Used for repeatable workflows, data rules and regression coverage.

### Access and RLS tests

Used to verify authenticated, anonymous, owner and collaborator permissions.

### Integration tests

Used when features from different verticals must work together.

### Manual UI checks

Used for visible user flows and mentor/demo evidence.

### Five-user pilot

Used for usability feedback with real participants.

## 5. Status definitions

- Planned: test is defined but has not been executed
- Implemented: automated test exists but current execution evidence is not recorded here
- Passed: test has been executed successfully with evidence
- Failed: test has been executed and a defect was found
- Blocked: test cannot currently run because a dependency is unavailable

## 6. Current W6 evidence

### C6-WF-01 - Open to Collaborate browse workflow

Status: Passed

Workflow verified:

1. Published artist has Open to collaborate disabled
2. Artist does not appear on `/collaborate`
3. Artist enables Open to collaborate
4. Artist appears on `/collaborate`
5. Artist disables it again
6. Artist disappears from `/collaborate`

Evidence:

- Test file:
  `tests/collaboration/01-open-to-collaborate-browse.spec.ts`
- Command:
  `npm run test:collaboration`
- Result:
  1 test file passed, 1 test passed
- Commit:
  `9e7cf69 test: cover open to collaborate browse workflow`

### Auth integration regression evidence

During Collaboration integration testing, an onboarding redirect loop was found
and fixed.

This is integration-support evidence and is not a claim of ownership of the
Accounts/Auth vertical.

Evidence:

- `tests/auth/04-middleware-protection.spec.ts`
- Auth suite result: 12 tests passed
- `ed30c3b fix: allow incomplete users to access onboarding`
- `f3bf35e test: make auth harness portable on Windows`

## 7. Planned acceptance scenarios

| ID | Scenario | Area | Planned phase | Current status |
| --- | --- | --- | --- | --- |
| 1 | Event collaborator can edit event | Collaboration / Events | W10 | Planned |
| 2 | Non-collaborator event edit is rejected by RLS | Access | W10 | Planned |
| 3 | Anonymous event update is rejected | Access | W10 | Planned |
| 4 | Removed collaborator can no longer edit | Collaboration | W10 | Planned |
| 5 | Event retains at least one collaborator after creation | Events | W10 | Planned |
| 6 | Artist cannot modify another artist's portfolio | Portfolio / Access | W10 | Planned |
| 7 | Anonymous user cannot read unpublished portfolio | Privacy | W10 | Planned |
| 8 | Anonymous user can read published portfolio | Privacy | W10 | Planned |
| 9 | Anonymous page-view RPC increments page views | Analytics | W10 | Planned |
| 10 | Direct reads of page_views are blocked | Privacy | W10 | Planned |
| 11 | Event creator can delete; collaborator cannot delete | Events / Access | W10 | Planned |
| 12 | Free registration is immediately confirmed | Registration | W9-W10 | Planned |
| 13 | Paid stub success confirms registration and decrements places | Payments | W9-W10 | Planned |
| 14 | Failed paid attempt can be retried and history is retained | Payments | W9-W10 | Planned |
| 15 | Settling the same order twice makes the second call a no-op | Payments | W9-W10 | Planned |
| 16 | User cannot settle another user's order | Payments / Access | W10 | Planned |
| 17 | Direct writes to registrations and orders are rejected | Payments / Access | W10 | Planned |
| 18 | Anonymous registration is rejected | Registration / Access | W10 | Planned |
| 19 | Registration privacy is enforced; event collaborators can view own-event registrations | Privacy | W10 | Planned |
| 20 | Recommendation results meet agreed acceptance criteria | Discovery | W10-W12 | Planned |

## 8. Five-user pilot plan

Target: five participants.

Planned schedule:

- W7: recruitment starts
- W10: recruitment complete
- W11: run five-user pilot
- W12: analyse feedback and record outcomes

Pilot evidence will include:

- participant identifier
- task attempted
- completion result
- observed problem
- participant feedback
- severity
- follow-up action

No participant is counted until recruitment or participation has actually occurred.

## 9. Defect process

Each confirmed defect should record:

- defect ID
- date found
- feature / scenario
- reproduction steps
- expected result
- actual result
- severity
- owner
- status
- fix commit or evidence
- retest result

Severity guidance:

- P0: blocks core system or causes serious data/security failure
- P1: major feature cannot complete
- P2: important problem with a workaround
- P3: minor usability, visual or low-risk issue

## 10. Entry and exit criteria

### Entry criteria

A feature is ready for QA when:

- implementation is available on a testable branch
- required migrations are available
- local environment can run
- feature owner identifies the intended workflow

### Exit criteria

A tested feature can be reported as passed when:

- required acceptance scenario passes
- no unresolved blocking defect remains
- regression checks pass where applicable
- evidence is recorded
- shared-deployment checks are completed when required

## 11. Weekly QA plan

### W6

- Test-plan structure
- Initial Collaboration workflow test

Status: Complete

### W7

- SRS support
- Pilot recruitment starts
- Collaboration checkpoint evidence

### W8

- API contract and registration/payment test preparation

### W9

- Payment end-to-end testing on shared deployment
- Open to Collaborate completion check

### W10

- Access-rule scenarios
- Functional tests
- Defect triage
- Pilot recruitment complete

### W11

- Five-user pilot
- Access-rule review

### W12

- Pilot feedback analysis
- Final defect/test evidence
- Demo support