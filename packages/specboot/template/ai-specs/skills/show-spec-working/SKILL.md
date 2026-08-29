---
name: show-spec-working
description: Use when the user asks "show me X", "demo X", "walk me through X", "how X works", "show X working", "prove X works" or requests a live feature demonstration from a spec, feature or ticket. Includes UX, accessibility, performance, and analytics validation.
author: LIDR.co
version: 1.1.0
---

# Show Spec Working Skill

Demonstrate a spec in a runnable way with **full quality validation**: functional, UX, accessibility, performance, analytics. If user doesn't provide explicit context, use the spec/change currently being worked on in this session.

Always end by reporting completion in chat.

## Trigger Phrases (High Priority)

Treat these as execution commands, not analysis requests:
- `show me X`
- `demo X`
- `walk me through X`
- `show X working`
- `how X works`
- `prove X works`

When any appear, run demonstration workflow directly. Do not stop at feature summary or quick report.

## Inputs

Optional spec context from user:
- Direct ticket ID (e.g., `SCRUM-10`)
- Feature name
- Endpoint
- Frontend route

If missing, infer from current session context and active work.

## Workflow

### Step 1 - Resolve Target Spec and Scope

1. Identify target spec/change:
   - Prefer explicit user-provided context
   - If user text contains ticket ID pattern (`[A-Z]+-[0-9]+`), use as primary context (e.g., `show me SCRUM-10`)
   - Otherwise, infer spec currently being worked on

2. Determine modality:
   - `frontend` when spec includes UI behavior
   - `backend-only` when only API behavior
   - `mixed` when both exist

3. List concrete scenarios to demo from spec acceptance criteria **PLUS**:
   - UX scenarios (usability test tasks)
   - Accessibility scenarios (keyboard, screen reader)
   - Performance scenarios (LCP, INP, CLS)
   - Analytics scenarios (event firing)

### Step 1.1 - Anti-Report Guardrail

Before continuing, enforce:
- Never finish after only analyzing requirements
- Never return only a quick report when user asked to "show" or "demo"
- If execution blocked, explicitly report blocker and ask exactly what is needed to continue live demo

### Step 2 - Frontend Demonstration Path (Extended)

Run when modality is `frontend` or `mixed`.

1. Start required local services if needed.
2. Use browser automation to open app and navigate to target feature.
3. **Demonstrate functional behavior** from spec, one interaction at a time.
   - Example sequence for list/table features:
     - Open listing page
     - Verify table data appears
     - Use search box
     - Apply filters
     - Change sorting
     - Open details view
4. **Demonstrate UX Quality**:
   - Walk through primary user journey (from usability test plan)
   - Show error states, empty states, loading states
   - Show responsive behavior (resize viewport)
   - Show dark mode toggle
5. **Demonstrate Accessibility**:
   - **Keyboard navigation**: Tab through entire flow, verify focus order, focus visible
   - **Screen reader**: NVDA/VoiceOver walkthrough of key screens
   - **Focus management**: Modal open/close, dropdown, dynamic content
   - **Contrast**: Spot-check text/UI contrast in both themes
6. **Demonstrate Performance**:
   - Open DevTools Performance tab
   - Record interaction, show LCP/INP/CLS metrics
   - Verify no layout shifts, smooth animations
7. **Demonstrate Analytics**:
   - Open Network tab, filter analytics endpoint
   - Trigger key events (page view, CTA click, form submit)
   - Verify events fire with correct properties
8. After each meaningful action:
   - Verify visible result matches spec expectations.
9. Stop on stable end state; let user continue manual exploration or close window.
10. Keep browser open unless user asks to close it.

### Step 3 - Backend API Demonstration Path

Run when modality is `backend-only` or `mixed`.

1. Identify endpoint(s) and sample payload(s) defined by spec.
2. Execute curl command(s) showing real response behavior.
3. If any call changes data state (CREATE/UPDATE/DELETE):
   - Execute paired restore/reset curl command (or equivalent) immediately after demonstrating behavior.
4. Confirm restored state so repeated demos remain deterministic.
5. Include command and key response evidence in chat (concise).

### Step 4 - Quality Validation Summary

After demonstration, run automated checks:

```bash
# Accessibility
npm run test:a11y              # jest-axe
npm run a11y:contrast          # Color contrast

# Performance
npm run lighthouse:ci          # Lighthouse budgets
npm run bundle:check           # Bundle size

# Analytics
npm run cypress:analytics      # E2E tracking validation
```

### Browser MCP Requirements

Before calling any MCP browser tool:
1. Read MCP tool descriptor JSON first.
2. Follow server instructions for lock/unlock and snapshot-refresh workflow.
3. Avoid repeated blind retries; if blocked, report blocker and best next action.

### API Demo Requirements

- Use explicit `curl` commands (not pseudocode) when environment data available
- Mask sensitive values in chat output
- Keep commands idempotent when possible
- Include restore commands for any state-changing operation

## Completion Contract

Always send final chat message containing:

1. Target spec/change demonstrated
2. What was executed:
   - Frontend flows shown (functional + UX + a11y + perf + analytics)
   - Backend curl commands executed
3. Verification result per demonstrated scenario (pass/fail with short note)
4. Quality gate results (automated checks)
5. Data restore status (if applicable)
6. Final handoff:
   - "Demo complete. You can continue checking in the open browser window or ask me to close it."

## Output Format

```markdown
Spec demo completed for: <spec/change>

## Functional Walkthrough
- <step/result>

## UX Quality Demo
- User journey: <task> → <result>
- Error states: <shown/verified>
- Empty states: <shown/verified>
- Loading states: <shown/verified>
- Responsive: <mobile/tablet/desktop verified>
- Dark mode: <verified>

## Accessibility Demo
- Keyboard navigation: <PASS/FAIL - details>
- Screen reader (NVDA/VoiceOver): <PASS/FAIL - details>
- Focus management: <PASS/FAIL - details>
- Contrast spot-check: <PASS/FAIL - details>

## Performance Demo
- LCP: <value>ms (budget: 2500ms) → <PASS/FAIL>
- INP: <value>ms (budget: 200ms) → <PASS/FAIL>
- CLS: <value> (budget: 0.1) → <PASS/FAIL>
- Bundle: <size>KB (budget: 170KB) → <PASS/FAIL>

## Analytics Demo
- Page view: <fired/verified>
- CTA clicks: <fired/verified>
- Form submit: <fired/verified>
- Properties correct: <PASS/FAIL>

## Automated Quality Gates
- jest-axe: <PASS/FAIL>
- Contrast: <PASS/FAIL>
- Lighthouse CI: <PASS/FAIL>
- Bundle check: <PASS/FAIL>
- Cypress analytics: <PASS/FAIL>

Data restore:
- <restored / not needed / failed + reason>

Next:
- You can continue in the open browser window, or ask me to close it.
```