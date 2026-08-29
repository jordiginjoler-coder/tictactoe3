---
name: enrich-us
description: Use when a user story or ticket needs technical enrichment for implementation readiness. Analyzes and enhances tickets with complete technical detail including functionality, endpoints, files to modify, definition of done, non-functional requirements, UX research, design requirements, accessibility, performance budgets, and analytics tracking.
author: LIDR.co
version: 1.1.0
---

# enrich-us Skill

Enhance user stories/tickets with implementation-ready technical detail including **UX, Design System, Accessibility, Performance, and Analytics** requirements.

## Instructions

Analyze and enrich the ticket: $ARGUMENTS.

### 1. Determine Input Source

| Source | Detection | Action |
|--------|-----------|--------|
| **Direct input** | Ticket text provided in prompt | Use provided content |
| **Jira mode** | Jira ID/key provided (e.g., SCRUM-123) | Fetch via Jira MCP |

### 2. Act as Product Expert with Technical + UX Knowledge

Understand the problem, then validate completeness against these criteria:

### 3. Completeness Checklist (Extended)

A ticket is implementation-ready when it includes:

| Section | Required Content |
|---------|------------------|
| **Functionality Description** | Complete user-facing behavior, edge cases, happy/error paths |
| **Fields to Update** | Exhaustive list of data fields with types, validation rules |
| **Endpoints** | HTTP methods, URLs, request/response schemas, status codes |
| **Files/Modules** | Specific files per architecture (domain, application, presentation) |
| **Definition of Done** | Implementation steps + delivery verification steps |
| **Documentation Updates** | Which docs to update (API spec, data model, standards) |
| **Unit Test Requirements** | Specific test cases, coverage expectations |
| **Non-Functional Requirements** | Security, performance, observability, **accessibility** |
| **UX Research & Design** | Personas, journeys, wireframes, prototype, usability criteria |
| **Design System** | Components needed, tokens, new component RFCs |
| **Accessibility (WCAG 2.1 AA)** | Semantic HTML, ARIA, focus, contrast, keyboard, screen reader |
| **Performance Budgets** | LCP/INP/CLS targets, bundle impact, Core Web Vitals |
| **Analytics Tracking** | Events, properties, funnels, feature adoption metrics |

### 4. Output Format (MANDATORY)

```markdown
## Original
[Original ticket content verbatim]

## Enhanced
[Enhanced version with all sections above]
```

### 5. Enhanced Template (Use This Structure)

```markdown
## Enhanced: <Ticket Title>

### 1. Functionality Description
**User Story**: As a <persona>, I want to <action>, so that <outcome>

**Acceptance Criteria** (Gherkin):
- Scenario: Happy path
  - WHEN user does X
  - THEN system does Y
- Scenario: Edge case
  - WHEN user does A
  - THEN system handles gracefully

### 2. Data Model Changes
| Entity | Field | Type | Validation | Required |
|--------|-------|------|------------|----------|

### 3. API Endpoints
| Method | Endpoint | Request | Response | Status Codes |
|--------|----------|---------|----------|--------------|

### 4. Files/Modules to Modify
**Domain**: `domain/entities/`, `domain/repositories/`
**Application**: `application/services/`, `application/dto/`
**Infrastructure**: `infrastructure/repositories/`
**Presentation**: `presentation/controllers/`, `presentation/routes/`
**Frontend**: `src/services/`, `src/components/`, `src/pages/`

### 5. UX Research & Design Requirements
**Personas Affected**: [Primary, Secondary]
**User Journeys**: [Current → Future state]
**Wireframes/Prototype**: [Figma link or reference]
**Usability Criteria**:
- Task completion rate target: ≥ 80%
- Time on task target: ≤ baseline * 1.5
- SUS score target: ≥ 68
**Design Handoff**: [Link to design spec, component inventory, interaction specs]

### 6. Design System Impact
**Existing Components Used**: [Button, Input, DataTable, Modal, etc.]
**New Components Needed**: [Component name, reason, reusability]
**Design Tokens**: [Color, spacing, typography, motion tokens used]
**Dark Mode**: [Verified / Needs review]
**Responsive**: [Mobile / Tablet / Desktop breakpoints]

### 7. Accessibility Requirements (WCAG 2.1 AA)
**Semantic Structure**: [Landmarks, heading hierarchy]
**Keyboard Navigation**: [Focus order, focus trap requirements]
**Screen Reader**: [ARIA labels, live regions, announcements]
**Contrast**: [Text 4.5:1, UI 3:1 - enforced by DS tokens]
**Focus Management**: [Modals, dropdowns, dynamic content]
**Reduced Motion**: [Respected for animations]

### 8. Performance Budgets
**Core Web Vitals Targets**:
- LCP: ≤ 2.5s (target: <baseline>)
- INP: ≤ 200ms (target: <baseline)
- CLS: ≤ 0.1 (target: <baseline)
**Bundle Impact**: [Estimated KB gzipped for new code]
**API Latency**: [p95 targets for new endpoints]
**DB Queries**: [p95 targets for new queries]

### 9. Analytics Tracking Plan
**Events to Implement**:
| Event | Trigger | Properties | Funnel Stage |
|-------|---------|------------|--------------|
| `feature_used` | User clicks X | {feature, action, metadata} | Adoption |
| `feature_completed` | User finishes flow | {feature, duration, success} | Conversion |

**User Properties**: [role, plan, team_size, features_enabled]
**Dashboards**: [Hiring Pipeline, Feature Adoption, Funnel Conversion]

### 10. Definition of Done
- [ ] All acceptance criteria verified
- [ ] Unit tests ≥ 90% coverage (domain, application, frontend)
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows (Cypress)
- [ ] Accessibility: jest-axe + manual keyboard + screen reader
- [ ] Performance: Lighthouse CI budgets pass
- [ ] Bundle size within budget
- [ ] Analytics events validated in dev
- [ ] Design QA: visual + interaction fidelity
- [ ] Documentation updated (API spec, data model, README)
- [ ] Code review approved
- [ ] Adversarial review PASS

### 11. Non-Functional Requirements
**Security**: [AuthZ rules, input validation, rate limiting]
**Observability**: [Logging, metrics, tracing, error tracking]
**Reliability**: [Error handling, retries, circuit breakers]
**Compliance**: [GDPR, data retention, audit logs]

### 12. Documentation Updates
- `docs/api-spec.yml`: [Endpoints added/modified]
- `docs/data-model.md`: [Entities, relationships]
- `docs/frontend-standards.md`: [New patterns if any]
- `README.md`: [User-facing changes]
```

### 6. Jira Write-Back (Optional, Jira Mode Only)

- Append enhanced content after original with `## [original]` and `## [enhanced]` headers
- If status is `To refine`, move to `Pending refinement validation`

## Notes

- Do NOT require Jira when user provided full ticket content
- If input ambiguous (short reference without content), ask: resolve via Jira or provide full text?
- Use project technical context from `docs/` for alignment
- **Always include UX, Design System, Accessibility, Performance, Analytics sections** — mark N/A only if truly not applicable