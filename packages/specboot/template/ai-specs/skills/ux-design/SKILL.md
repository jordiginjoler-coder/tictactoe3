---
name: ux-design
description: Use when a feature requires UX/UI design work: user research, wireframing, prototyping, usability testing, and design handoff. Integrates with OpenSpec propose/apply phases.
author: LIDR.co
version: 1.1.0
---

# UX Design Skill

Integrates professional UX/UI design into the OpenSpec workflow. Ensures design artifacts are created, reviewed, and handed off before implementation.

## When to Use

- During `propose` phase: Create design artifacts for proposal
- During `apply` phase: Design handoff to frontend implementation
- Before `verify`: Usability validation against acceptance criteria
- When feature involves new user flows, complex interactions, or UI changes

## OpenSpec Integration Points

### Phase: PROPOSE (Design Artifacts Creation)

```bash
# Creates in openspec/changes/<name>/design/
/design/ux/
├── research/
│   ├── user-personas.md
│   ├── user-journeys.md
│   ├── competitive-analysis.md
│   └── research-insights.md
├── wireframes/
│   ├── low-fidelity/ (sketches, flows)
│   └── high-fidelity/ (Figma links, screens)
├── prototypes/
│   ├── interactive/ (Figma prototype links)
│   └── usability-test-plan.md
├── design-system/
│   ├── component-inventory.md
│   ├── new-components-needed.md
│   └── design-token-usage.md
└── handoff/
    ├── design-spec.md (for developers)
    ├── asset-exports/ (SVG, PNG, fonts)
    └── interaction-specs.md
```

### Phase: APPLY (Design Handoff & Implementation)

```markdown
# In tasks.md Phase 1, add UX tasks:
- [ ] Design review: Validate wireframes against requirements (REF: REQ-UX-001)
- [ ] Prototype usability test: 5 users, task completion rate >80% (REF: REQ-UX-002)
- [ ] Design handoff meeting: Walkthrough with frontend dev (REF: REQ-UX-003)
- [ ] Implement component: <ComponentName> per design spec (REF: REQ-FE-001)
- [ ] Design QA: Pixel-perfect + interaction verification (REF: REQ-UX-004)
```

### Phase: VERIFY (Usability Validation)

```bash
# Runs after implementation
show-spec-working + ux-design skill → Usability validation
- Task completion rate
- Error rate
- Time on task
- SUS score (if applicable)
```

## Design Process (Per Feature)

### 1. Research & Discovery (Week 1)

```markdown
## User Personas
- Primary: <Name> - <Role> - <Goals> - <Pain points>
- Secondary: <Name> - <Role> - <Goals> - <Pain points>

## User Journeys
- Current state journey (as-is)
- Future state journey (to-be) with feature

## Jobs-to-be-Done
- When <situation>, I want to <motivation>, so I can <outcome>
```

### 2. Ideation & Wireframing (Week 1-2)

```markdown
## Low-Fidelity
- User flows (Mermaid/FigJam)
- Key screens sketches
- Navigation structure

## High-Fidelity (Figma)
- All screens in design system components
- Responsive breakpoints (mobile, tablet, desktop)
- States: default, hover, focus, loading, error, empty, success
- Dark mode variants
```

### 3. Prototyping & Testing (Week 2)

```markdown
## Interactive Prototype
- Figma prototype link
- Key flows clickable
- Micro-interactions defined

## Usability Test Plan
- 5 users (Jakob Nielsen rule)
- Tasks: 3-5 critical paths
- Metrics: Success rate, time, errors, satisfaction
- Script: Neutral, non-leading questions
```

### 4. Design System Alignment

```markdown
## Component Inventory
| Component | Exists in DS? | Variants Needed | Status |
|-----------|---------------|-----------------|--------|
| Button    | Yes           | Loading, Icon   | ✅     |
| DataTable | No            | Sortable, Page  | 🔄 New |

## Design Tokens Used
- Colors: semantic aliases (not raw hex)
- Spacing: scale references
- Typography: token references
- Motion: duration/easing tokens
- Shadows: elevation tokens
```

### 5. Handoff Package

```markdown
## Design Spec (for Developers)
- Figma file link (view access)
- Component anatomy diagrams
- Responsive behavior specs
- Animation specs (duration, easing, delay)
- Accessibility annotations (ARIA, focus order, contrast)
- Asset export guide (SVG preferred, PNG @2x/@3x)

## Interaction Specs
| Trigger | Action | Animation | Duration |
|---------|--------|-----------|----------|
| Click button | Submit form | Scale 0.98 → 1.0 | 150ms |
| Hover card | Elevate | Shadow 2→4, Y -2px | 200ms |
```

## Quality Gates (Design)

| Gate | Criteria | Tool/Method |
|------|----------|-------------|
| **Research Complete** | Personas + journeys documented | Review with PO |
| **Wireframes Approved** | Flows cover all acceptance criteria | Stakeholder sign-off |
| **Prototype Tested** | ≥80% task success, ≤2 critical issues | 5-user test |
| **Design System Aligned** | 0 new components without DS review | DS team review |
| **Handoff Complete** | Spec + assets + prototype linked | Dev + Design sync |
| **Design QA Pass** | Pixel-perfect + interactions match | Side-by-side comparison |

## Integration with Other Skills

| Skill | Integration |
|-------|-------------|
| `enrich-us` | Adds UX research questions to ticket |
| `propose` | Generates design artifact structure |
| `apply` | Adds UX tasks to tasks.md |
| `frontend-developer` | Receives design handoff, implements per spec |
| `show-spec-working` | Includes usability validation |
| `adversarial-review` | Includes UX heuristic review |

## Output Format

```
UX Design complete for: <CHANGE_NAME>

Artifacts created:
- openspec/changes/<CHANGE_NAME>/design/ux/research/
- openspec/changes/<CHANGE_NAME>/design/ux/wireframes/
- openspec/changes/<CHANGE_NAME>/design/ux/prototypes/
- openspec/changes/<CHANGE_NAME>/design/ux/design-system/
- openspec/changes/<CHANGE_NAME>/design/ux/handoff/

Usability test results: PASS / FAIL (with notes)
Design QA: PASS / FAIL (with screenshots)

Next: Frontend implementation per handoff spec
```