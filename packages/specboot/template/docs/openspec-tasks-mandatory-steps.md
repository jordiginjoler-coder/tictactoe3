---
description: Required checklist and execution rules for OpenSpec tasks.md files. Ensures consistent task decomposition and verification.
alwaysApply: true
---

# OpenSpec Tasks Mandatory Steps

Required checklist and execution rules for all `tasks.md` files in OpenSpec changes.

## Mandatory Task Structure

Every `tasks.md` MUST include these phases in order:

### Phase 0: Pre-Implementation Setup (Always First)

- [ ] **Read all specs** — Read `openspec/specs/*/spec.md` for affected capabilities
- [ ] **Read design doc** — Read `openspec/changes/<name>/design.md` if exists
- [ ] **Verify test baseline** — Run existing tests, confirm clean state
- [ ] **Set up workspace** — Use `using-git-worktrees` skill if needed
- [ ] **Install dependencies** — `npm install` / equivalent for all affected packages

### Phase 1: Test-First Implementation (Per Task)

For EACH implementation task:

- [ ] **Write failing test(s) first** — Red phase. Test the specific behavior.
- [ ] **Implement minimal code** — Green phase. Make test pass.
- [ ] **Refactor** — Clean up while keeping tests green.
- [ ] **Run full test suite** — Ensure no regressions.
- [ ] **Verify coverage** — New code meets 90% threshold.

### Phase 2: Integration & Verification

- [ ] **Run all tests** — Full suite passes.
- [ ] **Run linter** — `npm run lint` passes.
- [ ] **Run type check** — `npm run typecheck` / `tsc --noEmit` passes.
- [ ] **Build** — `npm run build` succeeds.
- [ ] **Manual verification** — Test happy path + 2 edge cases per feature.

### Phase 3: Documentation & Spec Sync

- [ ] **Update API spec** — `docs/api-spec.yml` reflects all endpoint changes
- [ ] **Update data model** — `docs/data-model.md` reflects entity changes
- [ ] **Update standards** — `docs/*-standards.md` if patterns changed
- [ ] **Sync OpenSpec artifacts** — Run `openspec-sync-specs` if delta specs exist
- [ ] **Update README/ADR** — If user-facing or architectural changes

### Phase 4: Pre-Archive Validation

- [ ] **Adversarial review** — Run `/adversarial-review` (different session/agent)
- [ ] **All findings resolved** — No blockers or majors remaining
- [ ] **Spec demo works** — Run `/show-spec-working` for affected features
- [ ] **Commit & PR** — Run `/commit` with descriptive message

## Task Decomposition Rules

| Rule | Requirement |
|------|-------------|
| **Single Responsibility** | Each task does ONE thing. If "and" in task name, split it. |
| **Testable** | Every task produces verifiable output (test, file, endpoint). |
| **Sequential** | Tasks ordered by dependency. No circular dependencies. |
| **Small Scope** | Task completable in < 2 hours. If larger, decompose further. |
| **Traceable** | Each task references spec requirement(s) it fulfills. |

## Execution Rules

| Rule | Enforcement |
|------|-------------|
| **Never skip Phase 0** | Baseline must be clean before any implementation |
| **Test before code** | RED phase mandatory — no exceptions |
| **No task without test** | Every implementation task has associated test(s) |
| **One task at a time** | Complete and verify before starting next |
| **Update tasks.md** | Check off tasks as completed. Add notes if blocked. |
| **Stop on failure** | If test/lint/build fails, fix before continuing |

## Task Status Tracking

Use checkboxes in `tasks.md`:

```markdown
- [ ] Task description (REF: REQ-1.1)
- [x] Completed task — verified
- [-] Blocked — reason: waiting on X
- [~] Deferred — reason: out of scope for this change
```

**Symbols:**
- `[ ]` — Pending
- `[x]` — Done, verified
- `[-]` — Blocked (add reason)
- `[~]` — Deferred (add reason)

## Required References

Each task MUST reference the spec requirement it implements:

```markdown
- [ ] Implement Candidate.create() endpoint (REF: REQ-Candidate-001)
- [ ] Add validation for email uniqueness (REF: REQ-Candidate-003)
- [ ] Write integration test for POST /candidates (REF: REQ-Candidate-001)
```

## Verification Gates (Non-Negotiable)

Before marking any phase complete:

| Gate | Command | Must Pass |
|------|---------|-----------|
| **Tests** | `npm test` | 100% pass, 90%+ coverage |
| **Lint** | `npm run lint` | 0 errors |
| **Types** | `npm run typecheck` | 0 errors |
| **Build** | `npm run build` | Success |

## Anti-Patterns (Forbidden)

| Anti-Pattern | Why Forbidden |
|--------------|---------------|
| "Implement feature X" (single task) | Too large, not testable, no traceability |
| Writing code before tests | Violates TDD, produces untested code |
| Skipping verification to "save time" | Creates debt that costs more later |
| Multiple unrelated changes in one task | Hard to review, test, and revert |
| Tasks without spec references | Untraceable, may not match requirements |
| Deferring doc updates to "later" | Docs drift, become unreliable |

## Completion Criteria

A change is ready for `/archive` ONLY when:

- [ ] All tasks in `tasks.md` are `[x]` (done, verified)
- [ ] All verification gates pass
- [ ] `/adversarial-review` returns PASS or PASS WITH GAPS
- [ ] `/show-spec-working` demonstrates all acceptance criteria
- [ ] `/commit` creates PR with all changes
- [ ] Documentation updated per `documentation-standards.md`
- [ ] OpenSpec artifacts synced (if delta specs existed)

## Notes

- This checklist is ENFORCED by the `apply` workflow
- Agents MUST follow this structure for every OpenSpec change
- Deviations require explicit human approval and justification
- The `verification-before-completion` skill should be used for Phase 4