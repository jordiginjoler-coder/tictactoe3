---
name: design-system
description: Use when creating, maintaining, or consuming a design system: design tokens, component library, pattern library, documentation, and governance. Ensures consistency across features.
author: LIDR.co
version: 1.1.0
---

# Design System Skill

Manages the design system as a product: tokens, components, patterns, documentation, versioning, and adoption governance.

## When to Use

- Setting up a new design system
- Adding/modifying design tokens (colors, spacing, typography, motion, shadows)
- Creating new reusable components
- Documenting component usage and patterns
- Auditing feature implementations for DS compliance
- Versioning and releasing design system updates

## Core Concepts

### Design Tokens (Single Source of Truth)

```json
// tokens/color.json
{
  "color": {
    "primitive": {
      "blue-500": { "value": "#3B82F6", "type": "color" },
      "gray-900": { "value": "#111827", "type": "color" }
    },
    "semantic": {
      "primary": { "value": "{color.primitive.blue-500}", "type": "color" },
      "text-primary": { "value": "{color.primitive.gray-900}", "type": "color" },
      "background": { "value": "{color.primitive.white}", "type": "color" },
      "background-dark": { "value": "{color.primitive.gray-900}", "type": "color" }
    }
  }
}
```

### Token Structure

| Level | Purpose | Example |
|-------|---------|---------|
| **Primitive** | Raw values (hex, px, ms) | `blue-500: #3B82F6` |
| **Semantic** | Meaning-oriented aliases | `primary: {blue-500}` |
| **Component** | Component-specific | `button-primary-bg: {primary}` |

### Theming (Dark Mode First)

```css
/* src/styles/tokens.css */
:root {
  /* Light theme (default) */
  --color-background: var(--color-background-light);
  --color-text-primary: var(--color-text-primary-light);
  --color-primary: var(--color-blue-500);
  --spacing-xs: var(--space-1);
  --spacing-sm: var(--space-2);
  --radius-sm: var(--radius-2);
  --motion-fast: 150ms;
  --motion-base: 250ms;
}

[data-theme="dark"] {
  --color-background: var(--color-background-dark);
  --color-text-primary: var(--color-text-primary-dark);
  /* Semantic tokens auto-switch via primitive references */
}
```

## Component Library Standards

### Component Anatomy

```
components/
├── Button/
│   ├── Button.tsx          # Component
│   ├── Button.stories.tsx  # Storybook
│   ├── Button.test.tsx     # Tests
│   ├── Button.tokens.json  # Component tokens
│   └── index.ts            # Exports
├── DataTable/
│   ├── DataTable.tsx
│   ├── DataTable.stories.tsx
│   ├── DataTable.test.tsx
│   ├── DataTable.tokens.json
│   └── index.ts
```

### Component Requirements

| Requirement | Standard |
|-------------|----------|
| **TypeScript** | Strict props interface, no `any` |
| **Variants** | CVA (class-variance-authority) or styled-components |
| **States** | default, hover, focus, active, disabled, loading, error |
| **Sizes** | sm, md, lg (token-driven) |
| **Dark Mode** | Automatic via semantic tokens |
| **Accessibility** | ARIA, keyboard, focus visible, contrast |
| **Storybook** | All variants + states documented |
| **Tests** | Unit + visual regression (Chromatic) |
| **Tokens** | Component-level token file |

## Token Pipeline (Automated)

```yaml
# .github/workflows/design-tokens.yml
on:
  push:
    paths: ['tokens/**']

jobs:
  build-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build tokens
        run: npm run tokens:build  # Style Dictionary / Theo
      - name: Generate CSS/TS/JSON
        run: npm run tokens:generate
      - name: Publish to npm (on tag)
        if: startsWith(github.ref, 'refs/tags/ds-')
        run: npm publish
```

## Governance Process

### Adding New Tokens

1. **Request**: Issue with use case, proposed name, value
2. **Review**: DS team evaluates semantic fit, naming convention
3. **Approve**: Add to primitive → semantic → component chain
4. **Document**: Update token documentation
5. **Release**: Minor version bump

### Adding New Components

1. **RFC**: Component RFC with API design, variants, states
2. **Design**: Figma component with all states + responsive
3. **Implement**: Build per standards above
4. **Review**: DS team + accessibility review
5. **Publish**: Add to component library, update docs

## Compliance Auditing

```bash
# Run in apply phase
design-system audit --path src/features/<feature>

# Checks:
# - Uses semantic tokens (no hardcoded values)
# - Components from library (no custom duplicates)
# - Dark mode compatible
# - Accessibility baseline
# - Responsive breakpoints respected
```

## Integration with OpenSpec

### In `propose` phase:
- Design system impact assessment in `design.md`
- New tokens/components needed listed
- DS team reviewer assigned

### In `apply` phase:
- Tasks include "Implement per DS component spec"
- Design QA includes DS compliance check
- Token usage validated in CI

### In `verify` phase:
- `design-system audit` runs
- Visual regression tests (Chromatic)
- Accessibility audit (axe-core)

## Quick Reference

| Command | Purpose |
|---------|---------|
| `design-system tokens:build` | Compile tokens to CSS/TS/JSON |
| `design-system tokens:validate` | Check naming, references, duplicates |
| `design-system component:create <name>` | Scaffold new component |
| `design-system audit <path>` | Check DS compliance |
| `design-system docs:generate` | Build component documentation |

## File Structure

```
design-system/
├── tokens/
│   ├── color.json
│   ├── spacing.json
│   ├── typography.json
│   ├── motion.json
│   ├── shadows.json
│   ├── borders.json
│   └── breakpoints.json
├── components/
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── DataTable/
│   ├── Modal/
│   └── ... (30+ components)
├── patterns/
│   ├── forms/
│   ├── navigation/
│   ├── data-display/
│   └── feedback/
├── docs/
│   ├── getting-started.md
│   ├── tokens.md
│   ├── components/
│   └── patterns/
├── package.json
├── tsconfig.json
└── style-dictionary.config.js
```