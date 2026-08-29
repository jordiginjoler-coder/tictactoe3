---
name: propose
description: Use when a refined user story needs to be transformed into formal OpenSpec proposal artifacts. Creates proposal, design, specification documents, AND UX/design artifacts from enriched requirements.
author: LIDR.co
version: 1.1.0
---

# Propose Skill

Transform enriched user stories into formal OpenSpec proposal artifacts (proposal.md, design.md, specs/) **AND UX/Design artifacts** (research, wireframes, prototypes, design system alignment, accessibility specs, performance budgets, analytics tracking plan).

## When to Use

- After `enrich-us` produces a refined user story
- Before starting implementation (`apply` phase)
- When stakeholder approval is needed before coding

## Input

- Refined user story (from `enrich-us` output)
- Optional: existing OpenSpec change directory

## Process

### 1. Create Change Directory

```bash
CHANGE_NAME="SCRUM-XXX"  # or feature name
mkdir -p "openspec/changes/$CHANGE_NAME"
mkdir -p "openspec/changes/$CHANGE_NAME/design/ux"
mkdir -p "openspec/changes/$CHANGE_NAME/design/ux/research"
mkdir -p "openspec/changes/$CHANGE_NAME/design/ux/wireframes"
mkdir -p "openspec/changes/$CHANGE_NAME/design/ux/prototypes"
mkdir -p "openspec/changes/$CHANGE_NAME/design/ux/design-system"
mkdir -p "openspec/changes/$CHANGE_NAME/design/ux/handoff"
```

### 2. Generate Proposal Artifact

Create `openspec/changes/$CHANGE_NAME/proposal.md`:

```markdown
# Proposal: <Feature Name>

## Ticket
SCRUM-XXX

## Problem Statement
<From enriched user story>

## Goals
- Goal 1
- Goal 2

## Non-Goals
- Explicitly out of scope

## Success Metrics (KPIs)
| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Conversion | 15% | 25% | Funnel analytics |
| Task Success | N/A | ≥ 80% | Usability test |
| LCP | 2.1s | ≤ 2.5s | Lighthouse CI |

## Stakeholders
- Product Owner: @name
- Tech Lead: @name
- UX Designer: @name
- DS Reviewer: @name
- Accessibility Reviewer: @name
- Reviewers: @name1, @name2
```

### 3. Generate Design Artifact (Technical + UX)

Create `openspec/changes/$CHANGE_NAME/design.md`:

```markdown
# Design: <Feature Name>

## Architecture Overview
<High-level component diagram or description>

## Data Model Changes
- New entities / modified fields
- Relationship changes
- Migration strategy

## API Changes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/x   | Create X    |

## Component Design
### Backend
- Domain entities
- Application services
- Repository interfaces
- Infrastructure implementations

### Frontend
- New components (mapped to Design System)
- Service layer updates
- Routing changes
- State management approach

## UX Design Integration
### Research Artifacts (in design/ux/research/)
- User personas
- User journeys (current → future)
- Competitive analysis
- Research insights

### Wireframes & Prototypes (in design/ux/wireframes/, design/ux/prototypes/)
- Low-fidelity flows
- High-fidelity screens (Figma link)
- Interactive prototype (Figma link)
- Usability test plan

### Design System Alignment (in design/ux/design-system/)
- Component inventory (existing vs new)
- Design token usage
- New component RFCs (if any)
- Dark mode verification

### Handoff Package (in design/ux/handoff/)
- Design spec for developers
- Asset exports (SVG, fonts)
- Interaction specs (animations, transitions)
- Accessibility annotations

## Accessibility Requirements (WCAG 2.1 AA)
- Semantic HTML structure per screen
- Heading hierarchy
- Focus management specs
- ARIA requirements
- Contrast verification (DS tokens)
- Keyboard navigation flows
- Screen reader test scenarios

## Performance Budgets
| Metric | Baseline | Target | Budget for This Feature |
|--------|----------|--------|-------------------------|
| LCP | 2.1s | ≤ 2.5s | +0.2s headroom |
| INP | 120ms | ≤ 200ms | +50ms headroom |
| CLS | 0.03 | ≤ 0.1 | +0.02 headroom |
| JS Bundle | 145 KB | ≤ 170 KB | +15 KB |
| CSS Bundle | 28 KB | ≤ 50 KB | +10 KB |

## Security Considerations
- AuthZ rules
- Data validation
- Rate limiting

## Analytics Tracking Plan
| Event | Trigger | Properties | Funnel Stage |
|-------|---------|------------|--------------|
| feature_exposed | Page load | {feature, variant} | Awareness |
| feature_used | User interaction | {feature, action, metadata} | Adoption |
| feature_completed | Flow complete | {feature, duration, success} | Conversion |

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
```

### 4. Generate Specification Artifacts

For each capability affected, create/update `openspec/specs/<capability>/spec.md`:

```markdown
# Capability: <Name>

## Purpose
<What this capability does>

## Requirements

### Requirement: <Short Name>
The system SHALL <behavior>.

#### Scenario: <Descriptive Name>
- **WHEN** <condition>
- **THEN** <expected outcome>

### UX Requirement: <Name>
The system SHALL provide <usability/accessibility/performance behavior>.

#### Scenario: <Descriptive Name>
- **WHEN** user navigates with keyboard
- **THEN** focus order is logical and visible
```

### 5. Create Tasks Template (Extended)

Create `openspec/changes/$CHANGE_NAME/tasks.md`:

```markdown
# Tasks for Change: <Feature Name>

## Phase 0: Pre-Implementation Setup
- [ ] Read all specs
- [ ] Read design.md + UX handoff artifacts
- [ ] Verify test baseline
- [ ] Set up workspace (using-git-worktrees)
- [ ] Install dependencies

## Phase 1: UX & Design (Parallel with Backend)
- [ ] UX Research complete: personas, journeys, insights (REF: UX-001)
- [ ] Wireframes approved: low-fi flows cover all AC (REF: UX-002)
- [ ] Prototype usability test: 5 users, ≥80% success (REF: UX-003)
- [ ] Design System alignment: component inventory, tokens, RFCs (REF: DS-001)
- [ ] Accessibility spec complete: semantic, ARIA, focus, contrast (REF: A11Y-001)
- [ ] Performance budgets defined per feature (REF: PERF-001)
- [ ] Analytics tracking plan finalized (REF: AN-001)
- [ ] Design handoff meeting with frontend dev (REF: UX-004)

## Phase 2: Backend Implementation (per requirement)
- [ ] Write failing tests (REF: REQ-X)
- [ ] Implement minimal code
- [ ] Refactor
- [ ] Run full test suite

## Phase 3: Frontend Implementation (Design System First)
- [ ] Map UI to DS components, identify gaps (REF: FE-001)
- [ ] Implement components per design spec (REF: FE-002)
- [ ] Accessibility: semantic HTML, ARIA, focus, keyboard (REF: A11Y-002)
- [ ] Performance: code splitting, lazy loading, images (REF: PERF-002)
- [ ] Analytics: implement events per tracking plan (REF: AN-002)
- [ ] Design QA: visual + interaction fidelity (REF: UX-005)

## Phase 4: Integration & Verification
- [ ] Run all tests (unit, integration, e2e)
- [ ] Run linter
- [ ] Run type check
- [ ] Build
- [ ] Manual verification (happy path + 2 edge cases)
- [ ] Accessibility audit: jest-axe + keyboard + NVDA/VoiceOver
- [ ] Performance: Lighthouse CI budgets pass
- [ ] Bundle size check
- [ ] Analytics validation: events fire correctly

## Phase 5: Documentation & Spec Sync
- [ ] Update API spec
- [ ] Update data model
- [ ] Sync OpenSpec artifacts (openspec-sync-specs)
- [ ] Update README/ADR

## Phase 6: Pre-Archive Validation
- [ ] Adversarial review (code + UX heuristic)
- [ ] All findings resolved
- [ ] Spec demo works (show-spec-working + usability demo)
- [ ] Commit & PR
```

## Output

```
Proposal artifacts created for: <CHANGE_NAME>

openspec/changes/<CHANGE_NAME>/
├── proposal.md
├── design.md
├── tasks.md
├── specs/
│   └── <capability>/
│       └── spec.md
└── design/ux/
    ├── research/
    │   ├── user-personas.md
    │   ├── user-journeys.md
    │   ├── competitive-analysis.md
    │   └── research-insights.md
    ├── wireframes/
    │   ├── low-fidelity/
    │   └── high-fidelity/
    ├── prototypes/
    │   ├── interactive/ (Figma link)
    │   └── usability-test-plan.md
    ├── design-system/
    │   ├── component-inventory.md
    │   ├── new-components-needed.md
    │   └── design-token-usage.md
    └── handoff/
        ├── design-spec.md
        ├── asset-exports/
        └── interaction-specs.md

Next step: Review artifacts with stakeholders, then run `/apply <CHANGE_NAME>`
```

## Guardrails

- Never skip design.md — it catches architectural + UX issues early
- **UX research artifacts mandatory for user-facing features**
- **Prototype usability test required before apply phase**
- **Design System alignment required before frontend implementation**
- **Accessibility spec mandatory for all features**
- **Performance budgets defined per feature**
- **Analytics tracking plan required for measurable features**
- Specs must be testable (Gherkin-style WHEN/THEN)
- Tasks.md must reference spec requirements (REF: REQ-X)
- All artifacts version-controlled with the change