---
name: user-testing
description: Use when planning, executing, and analyzing user testing sessions: moderated/unmoderated, usability testing, A/B testing, prototype validation. Integrates with OpenSpec propose/apply/verify.
author: LIDR.co
version: 1.1.0
---

# User Testing Skill

Embeds user validation into the OpenSpec lifecycle. Tests prototypes before build, validates implementation after, measures post-launch.

## When to Use

- **Propose**: Prototype usability testing (before any code)
- **Apply**: Design QA + implementation usability check
- **Verify**: Post-implementation validation
- **Post-Launch**: A/B tests, analytics-driven iteration

## Testing Types in OpenSpec Flow

| Phase | Test Type | Participants | Artifact |
|-------|-----------|--------------|----------|
| **Propose** | Prototype usability | 5 users (moderated) | Test report + iterations |
| **Propose** | Concept validation | 20-50 users (unmoderated) | Quantitative preference |
| **Apply** | Design QA | Designer + Dev | Side-by-side checklist |
| **Verify** | Implementation usability | 5 users (moderated) | Task success, SUS score |
| **Post-Launch** | A/B test | Statistical sample | Significance + decision |
| **Continuous** | Analytics review | N/A | Funnel, drop-offs, errors |

## Prototype Testing (Propose Phase)

### Test Plan Template

```markdown
# Usability Test Plan: <Feature Name>

## Objectives
- Validate: Can users complete [primary task] without guidance?
- Measure: Task success rate, time, errors, satisfaction
- Identify: Confusion points, missing affordances, flow gaps

## Participants (5-8 users)
| # | Persona | Recruitment | Incentive |
|---|---------|-------------|-----------|
| 1 | Primary: Hiring Manager | UserTesting.com | $50 |
| 2 | Primary: Recruiter | Customer list | $50 |
| 3 | Secondary: Candidate | Panel | $30 |

## Tasks (3-5 critical paths)
1. **Create job posting**: "Post a new Senior React Developer position"
2. **Filter candidates**: "Find all candidates with React + TypeScript"
3. **Schedule interview**: "Book a 30-min video interview for Monday"
4. **Make offer**: "Send offer to selected candidate"

## Success Criteria
| Metric | Target |
|--------|--------|
| Task completion rate | ≥ 80% |
| Time on task | ≤ baseline * 1.5 |
| Error rate | ≤ 1 critical error per task |
| SUS score | ≥ 68 (average) |

## Script (Neutral, Non-Leading)
"Imagine you're hiring for a React role. Show me how you'd..."
- No hints, no corrections during task
- Follow-up: "What did you expect to happen?" "Was anything confusing?"
```

### Prototype Preparation

```markdown
## Figma Prototype Checklist
- [ ] All screens in flow connected
- [ ] Hotspots cover all interactive elements
- [ ] Realistic content (not lorem ipsum)
- [ ] Error states included
- [ ] Empty states included
- [ ] Loading states shown
- [ ] Mobile + desktop flows
- [ ] Dark mode variant (if applicable)
- [ ] Prototype link shared with view-only access
```

### Conducting Sessions

```markdown
## Session Structure (45-60 min)
1. **Intro** (5 min): Context, think-aloud, recording consent
2. **Warm-up** (5 min): General questions about role/tools
3. **Tasks** (25-35 min): 3-5 tasks, observe silently
4. **Debrief** (10 min): SUS questionnaire, open feedback
5. **Wrap-up** (5 min): Thank you, incentive, next steps
```

### Analysis & Reporting

```markdown
# Usability Test Report: <Feature Name>

## Executive Summary
- **Overall**: PASS / CONDITIONAL PASS / FAIL
- **Key finding**: One sentence summary
- **Recommendation**: Proceed / Iterate / Redesign

## Quantitative Results
| Task | Success Rate | Avg Time | Errors | Satisfaction (1-5) |
|------|--------------|----------|--------|-------------------|
| 1. Create posting | 100% | 2:15 | 0 | 4.6 |
| 2. Filter candidates | 80% | 3:45 | 2 | 3.8 |
| 3. Schedule interview | 100% | 1:30 | 0 | 4.8 |
| 4. Make offer | 60% | 5:20 | 3 | 2.9 |

## Qualitative Findings
### Critical (Blocks Release)
- **Offer flow**: Users missed "Review & Send" button (below fold)
- **Filter**: "Skills" vs "Keywords" confusion, 2/5 used wrong tab

### Major (Should Fix)
- **Posting**: Date picker unclear, 3/5 picked wrong format
- **Mobile**: Interview scheduling overflow on small screens

### Minor (Nice to Have)
- Toast notifications too brief, missed by 2 users

## Action Items
| Finding | Action | Owner | Priority |
|---------|--------|-------|----------|
| Offer button below fold | Move to sticky footer | Design | Critical |
| Skills/Keywords confusion | Merge into single search | Design + FE | Critical |
| Date picker format | Add placeholder + example | FE | Major |

## Artifacts
- [ ] Full recordings (link)
- [ ] Annotated screenshots
- [ ] SUS scores raw data
- [ ] Updated prototype (v2)
```

## Design QA (Apply Phase)

```markdown
# Design QA Checklist: <Feature Name>

## Visual Fidelity
- [ ] Colors match design tokens (no hardcoded hex)
- [ ] Spacing follows 4px/8px grid
- [ ] Typography: correct tokens, weights, line heights
- [ ] Shadows/elevation match design spec
- [ ] Border radius consistent
- [ ] Dark mode: all screens verified

## Interaction Fidelity
- [ ] Hover states implemented
- [ ] Focus states visible (3:1 contrast)
- [ ] Loading states match spec (skeleton/spinner)
- [ ] Error states match spec (inline + toast)
- [ ] Empty states match spec
- [ ] Transitions: duration, easing per tokens
- [ ] Micro-interactions: button press, toggle, dropdown

## Responsive
- [ ] Mobile (320px): layout, touch targets 44px
- [ ] Tablet (768px): layout, navigation
- [ ] Desktop (1440px): layout, hover states
- [ ] Ultra-wide (1920px): max-width containers

## Accessibility (Quick)
- [ ] Semantic HTML structure
- [ ] Focus order logical
- [ ] ARIA labels on icon buttons
- [ ] Color contrast (text 4.5:1, UI 3:1)
- [ ] Alt text on images
```

## Implementation Usability (Verify Phase)

```markdown
# Post-Implementation Usability Test

## Changes from Prototype
- List any deviations from tested prototype
- Reason for each deviation

## Test Plan (Abbreviated)
- Same 3-5 critical tasks
- 5 users (can be different from prototype test)
- Focus: "Did implementation match prototype quality?"

## Success Criteria (Stricter)
| Metric | Prototype | Implementation |
|--------|-----------|----------------|
| Task completion | ≥ 80% | ≥ 90% |
| Time on task | ≤ baseline * 1.5 | ≤ baseline * 1.2 |
| SUS score | ≥ 68 | ≥ 75 |

## Regression Check
- [ ] No new usability issues introduced
- [ ] All prototype fixes implemented
- [ ] Performance: LCP/INP/CLS within budget
```

## A/B Testing (Post-Launch)

### Experiment Design

```markdown
# A/B Test: <Experiment Name>

## Hypothesis
"If we [change], then [metric] will [increase/decrease] by [X%] because [reason]."

## Variants
| Variant | Description | Traffic |
|---------|-------------|---------|
| Control (A) | Current implementation | 50% |
| Treatment (B) | [Specific change] | 50% |

## Metrics
| Primary | Secondary | Guardrail |
|---------|-----------|-----------|
| Conversion rate | Time on page | Error rate |
| Sign-up completion | Bounce rate | Page load time |

## Sample Size & Duration
- Minimum detectable effect: 5%
- Significance level: 95% (p < 0.05)
- Power: 80%
- Estimated sample: X per variant
- Minimum run: 2 weeks (full weekly cycles)

## Decision Rules
- **Ship B**: Primary metric significant + positive, no guardrail regression
- **Iterate**: Primary not significant, but qualitative insights
- **Reject**: Primary negative or guardrail regression
```

### Analysis Template

```markdown
# A/B Test Results: <Experiment Name>

## Results
| Metric | Control | Treatment | Δ | p-value | Significant? |
|--------|---------|-----------|---|---------|--------------|
| Conversion | 12.3% | 14.1% | +14.6% | 0.023 | ✅ Yes |
| Time on page | 2:15 | 2:28 | +9.6% | 0.156 | ❌ No |
| Error rate | 0.8% | 0.9% | +12.5% | 0.421 | ❌ No |

## Decision: SHIP TREATMENT
- Primary metric (conversion) statistically significant + positive
- No guardrail regressions
- Estimated annual impact: +$X revenue

## Learnings
- Users respond to [specific element]
- Unexpected: [observation]
- Next experiment: [hypothesis]
```

## Integration with OpenSpec

### In `propose` → `design.md`

```markdown
## User Testing Plan
- Prototype test: 5 users, 4 tasks, target 80% completion
- Concept validation: 50 users, preference test (if new paradigm)
- Recruitment: UserTesting.com + customer panel
- Timeline: Week 1-2 of propose phase
- Go/No-Go: Proceed only if ≥ 80% success on critical tasks
```

### In `apply` → `tasks.md`

```markdown
- [ ] Prototype usability test complete (REF: UT-001)
- [ ] Design QA: visual + interaction fidelity (REF: UT-002)
- [ ] Implementation usability test (REF: UT-003)
- [ ] A/B test designed for post-launch (REF: UT-004)
```

### In `verify` → Pre-archive

```bash
# Required sign-offs
- [ ] Prototype test report: PASS
- [ ] Design QA checklist: 100% pass
- [ ] Implementation usability: ≥ 90% completion
- [ ] A/B test plan documented (if applicable)
```

## Quick Reference

| Tool | Purpose | Cost |
|------|---------|------|
| **UserTesting.com** | Moderated/unmoderated remote | $50-100/session |
| **Maze** | Unmoderated prototype tests | $99/mo |
| **Hotjar/FullStory** | Session recordings, heatmaps | $39-199/mo |
| **Optimizely/VWO** | A/B testing platform | $50k+/yr |
| **PostHog** | Open-source analytics + experiments | Free/self-host |
| **Figma** | Prototyping | Free-$45/mo |

## Minimum Viable Testing (If Resources Limited)

| Constraint | Minimum |
|------------|---------|
| **No budget** | Guerrilla testing: 3 colleagues, 15 min each |
| **No users** | Cognitive walkthrough + heuristic evaluation |
| **No time** | Test 1 critical task with 3 users |
| **No prototype** | Paper sketches + think-aloud |

**Rule**: Never ship without *some* user validation on critical paths.