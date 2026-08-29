---
name: accessibility
description: Use when implementing, auditing, or validating accessibility (WCAG 2.1 AA, Section 508). Integrates axe-core, screen reader testing, keyboard navigation, and color contrast into the OpenSpec workflow.
author: LIDR.co
version: 1.1.0
---

# Accessibility Skill

Ensures WCAG 2.1 AA compliance throughout the OpenSpec lifecycle. Automated + manual testing integrated into propose/apply/verify.

## When to Use

- **Propose**: Accessibility requirements in design specs
- **Apply**: Implementation with a11y-first patterns
- **Verify**: Automated + manual audit before archive
- **Continuous**: CI gates on every PR

## WCAG 2.1 AA Checklist (Integrated)

### Perceivable
- [ ] **1.1.1** Non-text content: Alt text, ARIA labels, decorative images hidden
- [ ] **1.3.1** Info & relationships: Semantic HTML, headings, landmarks, labels
- [ ] **1.4.3** Contrast (Min): 4.5:1 text, 3:1 large text/UI components
- [ ] **1.4.4** Resize text: 200% zoom without horizontal scroll
- [ ] **1.4.11** Non-text contrast: 3:1 UI components, graphics
- [ ] **1.4.12** Text spacing: Line height 1.5, paragraph 2x, letter 0.12em, word 0.16em

### Operable
- [ ] **2.1.1** Keyboard: All functionality keyboard accessible
- [ ] **2.1.2** No keyboard trap: Focus moves freely
- [ ] **2.4.3** Focus order: Logical tab sequence
- [ ] **2.4.7** Focus visible: Clear focus indicator (3:1 contrast)
- [ ] **2.5.3** Label in name: Accessible name includes visible label
- [ ] **2.5.5** Target size: 44x44 CSS pixels minimum

### Understandable
- [ ] **3.1.1** Language of page: `lang` attribute
- [ ] **3.2.1** On focus: No unexpected changes
- [ ] **3.2.2** On input: No unexpected context changes
- [ ] **3.3.2** Labels/instructions: Clear form labels, error messages
- [ ] **3.3.3** Error suggestion: Specific correction guidance
- [ ] **3.3.4** Error prevention: Reversible, checked, confirmed

### Robust
- [ ] **4.1.2** Name, role, value: ARIA roles, states, properties correct
- [ ] **4.1.3** Status messages: Live regions for dynamic updates

## Implementation Patterns (Enforced)

### Semantic HTML First

```tsx
// ✅ GOOD
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main>
  <h1>Page Title</h1>
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Section</h2>
  </section>
</main>

// ❌ BAD
<div class="nav">...</div>
<div class="main">...</div>
```

### Form Accessibility

```tsx
// ✅ GOOD - Controlled, labeled, error handling
<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="email">Email *</label>
    <input
      id="email"
      type="email"
      required
      aria-describedby={emailError ? "email-error" : "email-hint"}
      aria-invalid={!!emailError}
    />
    <span id="email-hint">We'll never share your email</span>
    {emailError && (
      <span id="email-error" role="alert" className="error">
        {emailError}
      </span>
    )}
  </div>
</form>
```

### Focus Management

```tsx
// Modal focus trap
useEffect(() => {
  const modal = modalRef.current;
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  first?.focus();

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

  modal.addEventListener('keydown', handleTab);
  return () => modal.removeEventListener('keydown', handleTab);
}, []);
```

### Live Regions for Dynamic Content

```tsx
// Toast notifications
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {toastMessage}
</div>

// Form validation summary
<div aria-live="assertive" role="alert">
  {errors.map(e => <p key={e.field}>{e.message}</p>)}
</div>
```

## Automated Testing (CI Gates)

### 1. axe-core (Unit/Integration)

```typescript
// test/a11y.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button component has no a11y violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 2. Lighthouse CI (PR Gate)

```yaml
# .github/workflows/lighthouse.yml
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/dashboard
          configPath: ./lighthouserc.json
          uploadArtifacts: true
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": { "numberOfRuns": 3 },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:performance": ["warn", { "minScore": 0.8 }]
      }
    }
  }
}
```

### 3. Storybook a11y Addon

```typescript
// .storybook/preview.ts
import React from 'react';
import { withA11y } from '@storybook/addon-a11y';

export const decorators = [withA11y];
export const parameters = {
  a11y: {
    config: { rules: [{ id: 'color-contrast', enabled: true }] },
  },
};
```

## Manual Testing Protocol

### Screen Reader Testing (Required per feature)

| Screen Reader | OS | Test Command |
|---------------|-----|--------------|
| **NVDA** | Windows | `nvda` + browse mode |
| **JAWS** | Windows | `jaws` + virtual cursor |
| **VoiceOver** | macOS | `Cmd+F5` + rotor |
| **TalkBack** | Android | Settings → Accessibility |

### Test Scenarios (Per Feature)

```markdown
## Screen Reader Test Plan
- [ ] Page title announced correctly
- [ ] Headings hierarchy logical (h1→h2→h3)
- [ ] Landmarks navigable (main, nav, aside, footer)
- [ ] Form labels announced with inputs
- [ ] Error messages announced (aria-live)
- [ ] Modal: focus trapped, announced on open/close
- [ ] Dynamic updates announced (toasts, loading)
- [ ] Images: decorative hidden, informative described
- [ ] Tables: headers associated, caption read
```

### Keyboard Navigation Test

```markdown
## Keyboard Test Plan
- [ ] Tab order: logical, follows visual order
- [ ] Focus visible: clear outline on all interactive
- [ ] Skip links: "Skip to main content" works
- [ ] Modals: trap focus, Esc closes, return focus
- [ ] Dropdowns: Arrow keys navigate, Enter/Space select
- [ ] Tables: Arrow keys navigate cells (if interactive)
- [ ] No keyboard traps anywhere
```

### Color Contrast Verification

```bash
# Automated in CI
npm run a11y:contrast

# Manual spot-check
# Tools: WebAIM Contrast Checker, Colour Contrast Analyser
# Check: Text 4.5:1, Large text 3:1, UI components 3:1
```

## Integration with OpenSpec

### In `propose` → `design.md`

```markdown
## Accessibility Requirements
- Target: WCAG 2.1 AA
- Screen readers: NVDA, VoiceOver, JAWS
- Keyboard-only: Full support required
- Contrast: 4.5:1 text, 3:1 UI
- Focus management: Specified per interaction
- Live regions: Defined for all dynamic updates
```

### In `apply` → `tasks.md`

```markdown
- [ ] Implement semantic HTML structure (REF: A11Y-001)
- [ ] Add ARIA labels/roles per design spec (REF: A11Y-002)
- [ ] Focus management for modal/dropdown (REF: A11Y-003)
- [ ] Error handling with live regions (REF: A11Y-004)
- [ ] Unit a11y tests with jest-axe (REF: A11Y-005)
- [ ] Manual keyboard testing (REF: A11Y-006)
- [ ] Screen reader testing (NVDA + VoiceOver) (REF: A11Y-007)
```

### In `verify` → Pre-archive

```bash
# Automated gates (must pass)
npm run test:a11y          # jest-axe unit tests
npm run lighthouse:ci      # Lighthouse accessibility = 1.0
npm run a11y:contrast      # Color contrast check

# Manual gates (signed off)
- [ ] Keyboard navigation test complete
- [ ] Screen reader test complete (NVDA + VoiceOver)
- [ ] Focus management verified
- [ ] Zoom 200% layout intact
```

## Quick Reference

| Tool | Purpose | When |
|------|---------|------|
| `jest-axe` | Unit a11y tests | Every test run |
| `eslint-plugin-jsx-a11y` | Lint-time a11y | Every lint |
| `axe-core` (browser) | Runtime audit | DevTools, CI |
| `Lighthouse CI` | Full page audit | PR gate |
| `Chromatic` | Visual + a11y regression | PR gate |
| `NVDA/VoiceOver` | Screen reader manual | Pre-archive |

## Common Violations to Prevent

| Violation | Prevention |
|-----------|------------|
| Missing alt text | `eslint-plugin-jsx-a11y` rule `img-alt` |
| Low contrast | Design tokens enforce semantic colors |
| Missing focus visible | Global CSS `:focus-visible` + design tokens |
| No form labels | Component library enforces `label` + `htmlFor` |
| Keyboard traps | Focus trap hook in modal/dropdown components |
| Live region missing | Pattern library includes `Announcer` component |