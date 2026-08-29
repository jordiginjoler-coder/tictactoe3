---
description: Single source of truth for all development rules and guidelines. Applicable to all AI agents (Claude, Cursor, Codex, Gemini, etc.).
alwaysApply: true
---

# Base Development Standards

This document contains the core principles, language standards, and references to domain-specific standards that ALL agents must follow.

## 1. Core Principles

| Principle | Description |
|-----------|-------------|
| **Small Tasks, One at a Time** | Work in baby steps. Never advance more than one step at a time. |
| **Test-Driven Development (TDD)** | Write failing tests first for any new functionality. Red → Green → Refactor. |
| **Type Safety** | All code must be fully typed. No `any` without explicit justification. |
| **Clear Naming** | Use descriptive, unambiguous names for variables, functions, classes. |
| **Incremental Changes** | Prefer focused, reviewable changes over large, complex modifications. |
| **Question Assumptions** | Always verify assumptions and inferences before acting on them. |
| **Pattern Detection** | Identify and highlight repeated code patterns for abstraction. |

## 2. Language Standards

**ENGLISH ONLY** — All technical artifacts must use English exclusively:

- **Code**: Variables, functions, classes, comments, error messages, log messages
- **Documentation**: README, guides, API docs, architecture decisions
- **Tickets**: Jira titles, descriptions, comments
- **Data**: Database schemas, table/column names, enum values
- **Configuration**: Config files, scripts, environment variables
- **Git**: Commit messages, branch names, PR titles/descriptions
- **Tests**: Test names, descriptions, assertions

## 3. Domain-Specific Standards

Reference these documents for area-specific rules:

| Document | Scope |
|----------|-------|
| `docs/backend-standards.md` | API development, database patterns, testing, security, backend best practices |
| `docs/frontend-standards.md` | React components, UI/UX guidelines, frontend architecture, state management |
| `docs/documentation-standards.md` | Technical documentation structure, formatting, maintenance, AI spec standards |
| `docs/openspec-tasks-mandatory-steps.md` | Required checklist and execution rules for OpenSpec `tasks.md` files |

## 4. API & Data Contracts

**Source of Truth** for API and data consistency:

- `docs/api-spec.yml` — OpenAPI 3.0 specification (endpoint definitions, schemas)
- `docs/data-model.md` — Entity definitions, relationships, validation rules, ER diagram

All implementation MUST align with these contracts.

## 5. Agent Personas

Adopt the relevant agent from `ai-specs/agents/` for your task domain:

| Agent | Use When |
|-------|----------|
| `backend-developer.md` | Backend DDD layered architecture, Prisma, Express, domain modeling |
| `frontend-developer.md` | React components, service layer, React Router, React Bootstrap |
| `product-strategy-analyst.md` | Product ideation, use cases, target users, value propositions |

## 6. Skills System

Skills live in `ai-specs/skills/` and are auto-loaded when a request matches their description.

**Auto-Load Rule**: When a request matches a skill's `description` field, load and follow the corresponding `SKILL.md` before continuing. Also load any referenced files in the skill folder (e.g., `references/*.md`).

### Available Skills

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `enrich-us` | User story/ticket needs technical detail | Analyze and enhance tickets for implementation readiness |
| `using-git-worktrees` | Starting feature work needing isolation | Create isolated workspace via native tools or git worktree |
| `writing-skills` | Creating/editing skills | TDD for process documentation (skill creation) |
| `code-auditing` | Code quality review needed | 6-phase systematic audit (security, performance, types, dead code, libraries) |
| `commit` | Creating commits/PRs | Focused commits following repository standards |
| `adversarial-review` | Pre-archive verification | Independent red-team review of implementation |
| `update-docs` | After implementation changes | Identify and update affected technical documentation |
| `explain` | User asks "how X works" | Teach concepts with mental models, not just answers |
| `meta-prompt` | Prompt needs improvement | Rewrite prompts using prompt-engineering best practices |
| `openspec-sync-specs` | Sync delta specs to main specs | Update main specs with changes from delta without archiving |
| `show-spec-working` | User asks "show me X" | Live feature demonstration from spec |

## 7. Planning Model Requirement

**Opus High Reasoning REQUIRED** for planning workflows:

- `enrich-us`
- `openspec-ff-change` (or `/ff`)
- `openspec-continue-change`

Before starting these workflows, verify the session uses Opus high reasoning. If not, self-correct by adding `"model": "claude-opus-4-7"` to `.claude/settings.json`, then continue.

## 8. Symlink Integrity & Multi-Agent Portability

| Rule | Description |
|------|-------------|
| **Canonical Source** | Keep reusable artifacts in `ai-specs/` as canonical. Agent-specific paths (`.claude/`, `.cursor/`) reference them via symlinks. |
| **Update Safety** | When a file is renamed, moved, or suffix changes, verify and update ALL symlinks targeting it before considering the change complete. |
| **New Artifact Linking** | When creating new artifacts needing multi-agent exposure (agents, skills in `ai-specs/`), create corresponding symlinks from agent-specific reference paths. |
| **External Customization Review** | When customization appears outside `ai-specs/`, evaluate if it should move into `ai-specs/` and be replaced with symlinks. |
| **Completion Gate** | A change is incomplete if it leaves broken symlinks, stale targets, or duplicated canonical artifacts across agent-specific folders. |

## 9. Mandatory OpenSpec Artifact Updates (Post-Apply)

When a new fix/change appears after `/apply` and before `/archive`:

1. **Update OpenSpec artifacts first** (scenarios, requirements/specs, `tasks.md`) — treat as spec update, not quick fix
2. **Regenerate if needed** — Run `/ff` or `/continue` before coding
3. **Implement only after artifacts reflect the change**
4. **Re-verify against updated artifacts** before archiving

**Never apply direct code-only fixes in this window without updating OpenSpec artifacts.**

## 10. Quality Gates

Every change must satisfy:

- [ ] All tests pass (90%+ coverage: branches, functions, lines, statements)
- [ ] TypeScript compiles without errors (strict mode)
- [ ] ESLint passes
- [ ] Documentation updated per `docs/documentation-standards.md`
- [ ] API spec updated if endpoints changed
- [ ] Data model updated if entities changed
- [ ] Symlinks verified intact
- [ ] English-only language check passed