---
name: update-docs
description: Use after implementing changes to identify and update required technical documentation. Follows documentation-standards.md to keep all docs current with code changes. Includes UX, Design System, Accessibility, Performance, and Analytics documentation.
author: LIDR.co
version: 1.1.0
---

# Update Docs Skill

Identify and update required technical documentation based on implemented changes.

## Instructions

Use `docs/documentation-standards.md` to update whatever documentation is needed according to the changes made.

## Trigger

Run after any implementation that affects:
- API endpoints (add/modify/remove)
- Data models (entities, relationships, fields)
- Architecture patterns or layer conventions
- Configuration or environment variables
- Testing standards or coverage requirements
- New features or user-facing behavior changes
- **UX patterns, Design System components, Accessibility requirements**
- **Performance budgets, Core Web Vitals**
- **Analytics events, tracking plans, dashboards**

## Process

1. **Analyze Changes**: Review git diff or implementation summary to identify affected areas
2. **Map to Documentation**: Determine which docs need updates (see Quick Reference below)
3. **Update Each Doc**: Apply changes per `documentation-standards.md` formatting and structure rules
4. **Verify Consistency**: Ensure API spec matches implementation, data model matches Prisma schema, Design System tokens match implementation
5. **Report**: List updated files and what changed

## Quick Reference

| Change Type | Docs to Update |
|-------------|----------------|
| New/modified endpoint | `api-spec.yml`, relevant standards doc |
| New/modified entity | `data-model.md`, `api-spec.yml` schemas |
| New validation rule | `backend-standards.md`, `api-spec.yml` |
| New component pattern | `frontend-standards.md` |
| New testing pattern | `backend-standards.md` or `frontend-standards.md` |
| New environment variable | `backend-standards.md`, `.env.example` |
| Architecture change | `base-standards.md`, relevant layer standards |
| **New DS component** | `design-system/docs/components/`, `frontend-standards.md` |
| **Design token changes** | `design-system/tokens/`, `frontend-standards.md` |
| **Accessibility pattern** | `frontend-standards.md`, `accessibility.md` |
| **Performance budget change** | `frontend-standards.md`, `performance-budget.md` |
| **Analytics event** | `analytics-tracking-plan.md`, `frontend-standards.md` |
| **UX flow change** | `ux-design-docs/`, `README.md` |

## Extended Documentation Map

### Design System Documentation
```
design-system/docs/
├── getting-started.md
├── tokens/
│   ├── color.md
│   ├── spacing.md
│   ├── typography.md
│   ├── motion.md
│   └── shadows.md
├── components/
│   ├── Button.md
│   ├── Input.md
│   ├── DataTable.md
│   └── ...
├── patterns/
│   ├── forms.md
│   ├── navigation.md
│   └── data-display.md
└── contributing/
    ├── component-rfc.md
    └── token-rfc.md
```

### Accessibility Documentation
```
docs/accessibility.md
├── WCAG 2.1 AA Checklist
├── Implementation Patterns
├── Testing Procedures
├── Screen Reader Guide
├── Keyboard Navigation Guide
└── Contrast Requirements
```

### Performance Documentation
```
docs/performance-budget.md
├── Core Web Vitals Targets
├── Bundle Budgets
├── Optimization Patterns
├── Monitoring & Alerting
└── Regression Procedures
```

### Analytics Documentation
```
docs/analytics-tracking-plan.md
├── Event Dictionary
├── User Properties
├── Funnel Definitions
├── Dashboard Specs
└── Implementation Guide
```

### UX Documentation
```
docs/ux/
├── user-personas.md
├── user-journeys.md
├── design-principles.md
├── usability-testing-guide.md
└── design-handoff-checklist.md
```

## Update Process Per Category

### Design System Updates
```bash
# 1. Update token files (source of truth)
# design-system/tokens/color.json, spacing.json, etc.

# 2. Build tokens (generates CSS/TS/JSON)
npm run tokens:build

# 3. Update component documentation
# design-system/docs/components/<Component>.md

# 4. Update frontend-standards.md with new patterns
# 5. Update CHANGELOG.md for DS version
```

### Accessibility Updates
```bash
# 1. Update docs/accessibility.md with new patterns
# 2. Update frontend-standards.md a11y section
# 3. Add/update jest-axe test patterns
# 4. Update screen reader testing guide
```

### Performance Updates
```bash
# 1. Update docs/performance-budget.md with new budgets
# 2. Update frontend-standards.md perf section
# 3. Update lighthouserc.json if thresholds changed
# 4. Update bundle budgets in bundlesize.config.json
```

### Analytics Updates
```bash
# 1. Update docs/analytics-tracking-plan.md with new events
# 2. Update src/lib/analytics/events.ts (type definitions)
# 3. Update dashboard specs if new funnels
# 3. Update implementation guide
```

### UX Updates
```bash
# 1. Update docs/ux/user-personas.md if new research
# 2. Update docs/ux/user-journeys.md if flows changed
# 3. Update README.md user-facing changes
```

## Output

Brief summary:
```
Updated documentation:
- docs/api-spec.yml: Added POST /candidates endpoint
- docs/data-model.md: Added Candidate entity with relations
- docs/frontend-standards.md: Added DataTable accessibility pattern
- design-system/docs/components/DataTable.md: New component docs
- design-system/tokens/color.json: Added semantic error colors
- docs/accessibility.md: Updated modal focus trap pattern
- docs/performance-budget.md: Tightened LCP budget to 2.5s
- docs/analytics-tracking-plan.md: Added candidate_created event
- docs/ux/user-journeys.md: Updated hiring manager flow
```