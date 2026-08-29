---
name: apply
description: Use when OpenSpec proposal artifacts are approved and ready for implementation. Executes the complete implementation workflow: UX/design, backend, frontend (Design System, accessibility, performance, analytics), documentation, verification, and prepares for archive.
author: LIDR.co
version: 1.1.0
---

# Apply Skill

Execute the complete implementation workflow for an approved OpenSpec change. Runs tasks.md phase by phase with mandatory verification gates for **code, UX, accessibility, performance, and analytics**.

## When to Use

- After `propose` artifacts are reviewed and approved
- Stakeholders have signed off on proposal.md, design.md, AND UX artifacts
- Ready to start test-first implementation

## Arguments

`$ARGUMENTS` — Change name (e.g., `SCRUM-123`, `feature-name`)

## Process

### 0. Pre-Flight Checks

```bash
# Verify change exists
if [ ! -d "openspec/changes/$CHANGE_NAME" ]; then
    echo "ERROR: Change $CHANGE_NAME not found"
    exit 1
fi

# Verify all required artifacts exist
for f in proposal.md design.md tasks.md; do
    if [ ! -f "openspec/changes/$CHANGE_NAME/$f" ]; then
        echo "ERROR: Missing $f"
        exit 1
    fi
done

# Verify UX artifacts exist (for user-facing features)
if [ -d "openspec/changes/$CHANGE_NAME/design/ux" ]; then
    for f in research/user-personas.md research/user-journeys.md prototypes/usability-test-plan.md design-system/component-inventory.md handoff/design-spec.md; do
        if [ ! -f "openspec/changes/$CHANGE_NAME/design/ux/$f" ]; then
            echo "WARNING: UX artifact missing: $f"
        fi
    done
fi

# Verify no uncommitted changes in main
git status --porcelain | grep -q . && echo "WARNING: Uncommitted changes in main"
```

### 1. Branch & Workspace Setup (using-git-worktrees)

```bash
# Create isolated workspace
using-git-worktrees skill → creates .worktrees/$CHANGE_NAME
cd .worktrees/$CHANGE_NAME

# Verify clean baseline
npm test  # Must pass before starting
```

### 2. Phase 0: Pre-Implementation (from tasks.md)

- [ ] Read all specs in `openspec/specs/*/spec.md`
- [ ] Read design.md + UX handoff artifacts (`design/ux/handoff/`)
- [ ] Verify test baseline passes
- [ ] Install dependencies

### 3. Phase 1: UX & Design Implementation (Parallel with Backend)

**UX tasks from tasks.md (must complete before frontend implementation):**

```bash
# UX Research Validation
- [ ] Personas validated against research (REF: UX-001)
- [ ] User journeys cover all acceptance criteria (REF: UX-002)

# Prototype Usability Test (MANDATORY before frontend)
- [ ] Usability test executed: 5 users (REF: UX-003)
- [ ] Results: ≥80% task success, ≤2 critical issues
- [ ] Prototype updated based on findings (v2)

# Design System Alignment
- [ ] Component inventory reviewed with DS team (REF: DS-001)
- [ ] New components: RFC approved or deferred (REF: DS-002)
- [ ] Design tokens verified: semantic, dark mode ready (REF: DS-003)

# Accessibility Specification
- [ ] Semantic HTML structure defined per screen (REF: A11Y-001)
- [ ] ARIA requirements documented per component (REF: A11Y-002)
- [ ] Focus management specs for modals/dropdowns (REF: A11Y-003)
- [ ] Contrast verified via DS tokens (REF: A11Y-004)

# Performance Budgets
- [ ] Feature-level budgets defined (REF: PERF-001)
- [ ] Code splitting strategy documented (REF: PERF-002)

# Analytics Tracking Plan
- [ ] Events defined with properties (REF: AN-001)
- [ ] Feature adoption funnel designed (REF: AN-002)

# Design Handoff
- [ ] Design spec walkthrough with frontend dev (REF: UX-004)
- [ ] Figma prototype + interaction specs shared (REF: UX-005)
```

### 4. Phase 2: Backend Implementation (Test-First)

For EACH backend task in tasks.md:

```bash
# 1. Write failing test (RED)
#    - Create test file
#    - Write test for specific behavior
#    - Run test → confirm FAIL

# 2. Implement minimal code (GREEN)
#    - Write minimal implementation
#    - Run test → confirm PASS

# 3. Refactor (REFACTOR)
#    - Clean up code
#    - Run tests → confirm still PASS

# 4. Verify coverage
#    - npm run coverage → 90%+ for new code

# 5. Mark task complete in tasks.md
#    - [x] Task description (REF: REQ-X)
```

**MANDATORY**: Never skip RED phase. No implementation without failing test first.

### 5. Phase 3: Frontend Implementation (Design System First)

For EACH frontend task in tasks.md:

```bash
# 1. Design System Mapping
#    - Map UI to existing DS components
#    - Identify gaps → RFC or custom implementation

# 2. Write failing tests (RED)
#    - Unit: Jest + RTL + jest-axe
#    - Visual: Storybook stories for all variants
#    - Run tests → confirm FAIL

# 3. Implement minimal code (GREEN)
#    - Use DS components + semantic tokens
#    - Semantic HTML + accessibility built-in
#    - Code splitting for heavy components
#    - Analytics events integrated
#    - Run tests → confirm PASS

# 4. Refactor (REFACTOR)
#    - Clean up, optimize bundle
#    - Run tests → confirm still PASS

# 5. Verify
#    - Coverage 90%+
#    - jest-axe: 0 violations
#    - Storybook: all variants documented
#    - Mark task complete (REF: REQ-X)
```

### 6. Phase 4: Integration & Verification (All Gates)

```bash
# Automated Gates (MUST PASS)
npm test              # 100% pass, 90% coverage
npm run lint          # 0 errors
npm run typecheck     # 0 errors
npm run build         # Success

# Accessibility Gates
npm run test:a11y     # jest-axe unit tests pass
npm run a11y:contrast # Color contrast check

# Performance Gates
npm run bundle:check  # Bundle budgets pass
npm run lighthouse:ci # Lighthouse: LCP≤2.5s, INP≤200ms, CLS≤0.1

# Analytics Gates
npm run cypress:analytics # E2E tracking validation

# Manual Verification
# - Happy path + 2 edge cases + error scenarios
# - Keyboard navigation test (complete)
# - Screen reader test (NVDA + VoiceOver) (complete)
# - Design QA: visual + interaction fidelity (complete)
# - Responsive: mobile, tablet, desktop (verified)
# - Dark mode: all screens (verified)
```

### 7. Phase 5: Documentation & Spec Sync

```bash
# Update API spec
update-docs skill → docs/api-spec.yml

# Update data model
update-docs skill → docs/data-model.md

# Sync delta specs to main specs
openspec-sync-specs skill → openspec/specs/*/spec.md

# Update standards if patterns changed
update-docs skill → docs/*-standards.md
```

### 8. Phase 6: Pre-Archive Validation (Extended)

```bash
# 1. Adversarial Review (MANDATORY)
#    - Code review (security, logic, patterns)
#    - UX heuristic review (usability, accessibility)
adversarial-review skill → must return PASS or PASS WITH GAPS

# 2. Spec + UX Demonstration
show-spec-working skill → 
    - All acceptance criteria demonstrated
    - Usability validation: task completion ≥90%
    - Accessibility demo: keyboard + screen reader
    - Performance demo: Lighthouse scores

# 3. All tasks.md checkboxes = [x]
#    No [-] blocked, no [~] deferred without reason

# 4. Design QA Sign-off
#    - Visual fidelity: 100% match
#    - Interaction fidelity: 100% match
#    - Responsive: all breakpoints
#    - Dark mode: verified
```

### 9. Prepare for Archive

```bash
# Stage all changes
git add -A

# Show summary
echo "=== Apply Complete: $CHANGE_NAME ==="
echo "Branch: $(git branch --show-current)"
echo "Workspace: $(pwd)"
echo ""
echo "✅ Code Quality:"
echo "   Tests: PASS (90%+ coverage)"
echo "   Lint: PASS"
echo "   Typecheck: PASS"
echo "   Build: PASS"
echo ""
echo "✅ Accessibility (WCAG 2.1 AA):"
echo "   jest-axe: PASS"
echo "   Keyboard: PASS"
echo "   Screen Reader (NVDA+VoiceOver): PASS"
echo "   Contrast: PASS"
echo ""
echo "✅ Performance:"
echo "   Lighthouse CI: PASS (LCP≤2.5s, INP≤200ms, CLS≤0.1)"
echo "   Bundle Budgets: PASS"
echo ""
echo "✅ Analytics:"
echo "   Events Validated: PASS"
echo "   Feature Adoption Funnel: Configured"
echo ""
echo "✅ UX Quality:"
echo "   Prototype Test: PASS (≥80% success)"
echo "   Design QA: PASS (visual + interaction)"
echo "   Design System: ALIGNED"
echo ""
echo "✅ Reviews:"
echo "   Adversarial Review: PASS"
echo "   Spec + UX Demo: COMPLETE"
echo ""
echo "Next: /archive $CHANGE_NAME"
```

## Task Status Tracking

Update `openspec/changes/$CHANGE_NAME/tasks.md` in real-time:

```markdown
# UX & Design
- [x] Usability test: 5 users, 85% success (REF: UX-003)
- [x] Design System alignment: 3 existing, 1 new RFC (REF: DS-001)
- [x] Accessibility spec complete (REF: A11Y-001)

# Backend
- [x] Write failing test for Candidate.create (REF: REQ-CAND-001)
- [x] Implement Candidate.create endpoint (REF: REQ-CAND-001)

# Frontend
- [x] CandidateForm: DS components + a11y + analytics (REF: FE-001)
- [x] CandidateList: lazy load + performance (REF: FE-002)

# Verification
- [-] Screen reader test (REF: A11Y-005)  # BLOCKED: NVDA license
- [~] A/B test setup (REF: AN-003)  # DEFERRED: post-launch
```

## Output

```
Apply workflow complete for: $CHANGE_NAME

✅ Phase 0: Pre-implementation
✅ Phase 1: UX & Design (research, prototype test, DS, a11y, perf, analytics)
✅ Phase 2: Backend (test-first)
✅ Phase 3: Frontend (DS-first, a11y, perf, analytics)
✅ Phase 4: Integration & Verification (all gates)
✅ Phase 5: Documentation & Spec Sync
✅ Phase 6: Pre-Archive Validation (adversarial + UX demo)

Ready for: /archive $CHANGE_NAME
```

## Guardrails

- **NEVER** implement without failing test first (RED phase mandatory)
- **NEVER** skip prototype usability test (user-facing features)
- **NEVER** skip Design System alignment
- **NEVER** skip accessibility specification
- **NEVER** skip performance budgets
- **NEVER** skip analytics tracking plan
- **NEVER** skip adversarial review
- **NEVER** archive with blockers or majors
- **ALWAYS** run full test suite after each task
- **ALWAYS** update tasks.md in real-time
- If any gate fails → STOP and fix before continuing