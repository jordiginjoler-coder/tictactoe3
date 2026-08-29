---
name: adversarial-review
description: Use when an adversarial review, red-team review, devil's advocate check, or independent verification pass is requested before archiving an OpenSpec change. Acts as an independent reviewer hunting for gaps, flaws, and unsafe behavior across code, UX, accessibility, performance, and analytics.
author: LIDR.co
version: 1.1.0
---

# Adversarial Review Skill

Act as an **independent adversarial reviewer**: assume gaps, flaws, or unsafe behavior may exist until argued against with evidence.

For the **verification window** of spec-driven development (after implementation, before archiving), when run by a different agent/session than the implementer.

**Reviews: Code + UX + Accessibility + Performance + Analytics**

## Inputs

Optional context from user:
- Ticket ID (e.g., `SCRUM-10`)
- Feature or change name
- Endpoint(s)
- Frontend route(s)
- Pull Request: URL or `owner/repo#42`

Resolve scope: explicit ticket/change → PR when given → current active work.

## Mindset

- **Try to break the system**, not confirm happy paths
- **Hunt incorrect assumptions** about data shape, timing, ordering, authz, idempotency, error handling
- **Trace cross-boundary risks**: pieces fine in isolation but fail together (multi-file, API+UI, retries+side effects)
- **Treat diff as incomplete context**: missing tests, negative paths, spec drift hide issues
- **Calibrate depth to risk**: auth, payments, PII, privilege boundaries, data mutation deserve stricter scrutiny
- **UX Heuristics**: Apply Nielsen's 10, check for dark patterns, cognitive load, error prevention
- **Accessibility**: Assume WCAG violations exist until proven otherwise
- **Performance**: Assume budgets exceeded until measured
- **Analytics**: Assume events missing or incorrect until validated

## Workflow

### Step 1 — Load Specification Side First
1. Identify OpenSpec change directory, read artifacts (proposal, design, specs, scenarios, `tasks.md`)
2. **Read UX artifacts**: `design/ux/research/`, `design/ux/prototypes/`, `design/ux/handoff/`
3. Extract acceptance criteria and explicit non-goals
4. Note underspecified areas (ambiguous acceptance, missing error cases, missing security constraints, missing UX/accessibility/performance/analytics specs)

### Step 2 — Load Implementation Side
1. If PR provided: treat as primary surface. Read PR description, review full diff scope. Map files/changes to spec sections/tasks.
2. If no PR: use `git diff` against merge base or branch per project convention.
3. **Review frontend implementation**: components, hooks, services, routing
4. **Check analytics implementation**: event firing, properties, network requests

### Step 3 — Adversarial Pass (Refute, Don't Rubber-Stamp)

#### 3A. Code & Architecture (Original)
For each acceptance criterion or scenario:
1. State how implementation **could still fail** while author believed it passed (wrong input, partial failure, double-submit, stale cache, wrong role, race, empty state, oversized payload)
2. Check negative/abuse cases (validation bypass strings, IDOR-style access, replay, conflict handling)
3. Check tests: do they **prove** the criterion, or only happy path?
4. Record spec vs code mismatches as first-class findings

#### 3B. UX Heuristic Review (Nielsen's 10 + Modern)
| Heuristic | Adversarial Questions |
|-----------|----------------------|
| **1. Visibility of System Status** | Loading states? Progress? Errors visible? Timeouts communicated? |
| **2. Match System/Real World** | Language user-centric? Concepts familiar? Jargon avoided? |
| **3. User Control & Freedom** | Undo? Cancel? Escape hatches? Exit paths clear? |
| **4. Consistency & Standards** | DS components used? Patterns consistent? Platform conventions? |
| **5. Error Prevention** | Confirmation for destructive? Inline validation? Constraints visible? |
| **6. Recognition vs Recall** | Info visible? Reduce memory load? Autocomplete? History? |
| **7. Flexibility & Efficiency** | Shortcuts? Power user features? Customization? |
| **8. Aesthetic & Minimalist** | Clutter? Visual hierarchy? Focus on primary actions? |
| **9. Error Recognition & Recovery** | Errors in plain language? Specific fixes suggested? Non-blocking? |
| **10. Help & Documentation** | Contextual help? Onboarding? Searchable docs? |
| **11. Cognitive Load** | Decision fatigue? Progressive disclosure? Chunking? |
| **12. Trust & Transparency** | Data usage clear? Permissions explained? Reversible actions? |

#### 3C. Accessibility Audit (WCAG 2.1 AA)
| Criterion | Adversarial Check |
|-----------|-------------------|
| **1.1.1 Non-text Content** | All images have alt? Decorative hidden? Icons labeled? |
| **1.3.1 Info & Relationships** | Semantic HTML? Headings? Landmarks? Form labels? Tables? |
| **1.4.3 Contrast (Min)** | Text 4.5:1? Large text 3:1? Verified in all themes? |
| **1.4.11 Non-text Contrast** | UI components 3:1? Focus indicators 3:1? |
| **2.1.1 Keyboard** | All functionality keyboard accessible? No traps? |
| **2.1.2 No Keyboard Trap** | Focus escapes all components? Modal trap + Esc? |
| **2.4.3 Focus Order** | Logical tab sequence? Visual = DOM order? |
| **2.4.7 Focus Visible** | Clear focus ring (3:1)? Not just outline:0? |
| **2.5.3 Label in Name** | Accessible name includes visible label? |
| **2.5.5 Target Size** | Touch targets ≥44x44px? |
| **3.3.2 Labels/Instructions** | Form labels clear? Error messages specific? |
| **4.1.2 Name, Role, Value** | ARIA roles correct? States updated? Live regions? |

#### 3D. Performance Budget Audit
| Budget | Adversarial Check |
|--------|-------------------|
| **LCP ≤ 2.5s** | LCP element identified? Preloaded? No render-blocking? |
| **INP ≤ 200ms** | Event handlers optimized? Main thread free? Debounced? |
| **CLS ≤ 0.1** | Dimensions on images/iframes? Font loading stable? Ads reserved? |
| **JS Bundle ≤ 170 KB** | Code splitting? Tree shaking? Dead code eliminated? |
| **CSS Bundle ≤ 50 KB** | Unused CSS purged? Critical CSS inlined? |
| **Fonts ≤ 100 KB** | Subset? WOFF2? Preload? font-display: swap? |

#### 3E. Analytics Validation
| Check | Adversarial Questions |
|-------|----------------------|
| **Event Firing** | All planned events fire? Correct timing? No duplicates? |
| **Properties** | All required properties present? Types correct? No PII? |
| **Feature Adoption** | Exposed → Used → Completed funnel instrumented? |
| **Error Tracking** | Errors captured with context? User ID hashed? |
| **Network** | Requests batched? keepalive? Retry logic? Fail gracefully? |

### Step 4 — Severity and Recommendations

| Severity | Meaning |
|----------|---------|
| **Blocker** | Incorrect behavior, security/privacy issue, spec violation, **WCAG AA failure**, **performance budget exceeded**, **analytics missing** — stopping archive |
| **Major** | Likely bug, significant gap, **usability issue**, **a11y gap**, **perf regression risk**, **analytics incomplete** — fix or spec update required before archive |
| **Minor** | Clarity, maintainability, low-risk gap, **polish**, **enhancement** — can follow up |
| **Question** | Needs human or author confirmation |

For each finding, state fix location: **code**, **tests**, **OpenSpec artifacts**, **documentation**, **design**, **design-system**.

### Step 5 — Verdict

- **PASS (adversarial)**: no blockers or majors; minors listed optionally
- **PASS WITH GAPS**: minors only but tracked
- **FAIL**: at least one blocker or major until addressed

## Output Format

```markdown
## Adversarial Review

**Scope**: <ticket / change / PR>
**Sources**: <list spec paths + PR or diff reference + UX artifacts>

### Spec and Task Alignment
- Code: [aligned / gaps]
- UX: [handoff followed / deviations]
- Accessibility: [spec implemented / gaps]
- Performance: [budgets met / exceeded]
- Analytics: [events implemented / missing]

### Findings

| Severity | Area | Finding | Evidence | Suggested Fix |
|----------|------|---------|----------|---------------|
| Blocker | A11Y | Modal focus trap missing | Tab escapes modal, no return focus | code: add focus trap hook |
| Major | UX | Error message not actionable | "Invalid input" no fix guidance | design: add specific messages |
| Major | Perf | LCP 3.2s (budget 2.5s) | Hero image not preloaded, render-blocking CSS | code: preload + critical CSS |
| Minor | Analytics | feature_used missing metadata | No action type in properties | code: add action property |
| Question | UX | Cancel button placement | Bottom-left vs top-right | design: confirm with DS |

### Verdict
PASS | PASS WITH GAPS | FAIL

### Recommended Next Steps (before archive)
- [ ] Fix modal focus trap (Blocker)
- [ ] Add actionable error messages (Major)
- [ ] Optimize LCP: preload hero, inline critical CSS (Major)
- [ ] Add action metadata to feature_used (Minor)
- [ ] Confirm cancel button placement with DS (Question)
```

## Guardrails

- Do not praise implementation to "balance" criticism unless strength directly mitigates documented risk
- Do not skip reading OpenSpec artifacts when they exist
- Do not skip UX artifacts (research, prototype test results, handoff)
- Do not assume accessibility works — verify with axe + manual
- Do not assume performance budgets met — verify with Lighthouse CI
- Do not assume analytics work — validate network requests
- If cannot access PR/diff, say so and list exactly what is needed

## Completion

Always end with verdict and whether archiving is **advisable** in current state.