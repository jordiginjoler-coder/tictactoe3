# GitHub Copilot / Codex Configuration

This configuration enables GitHub Copilot to follow this project's spec-driven development standards.

## Core Standards

**MANDATORY:** Follow `docs/base-standards.md` for all development tasks.

## Agent Personas

Reference the appropriate agent for your task:
- **Backend**: `ai-specs/agents/backend-developer.md`
- **Frontend**: `ai-specs/agents/frontend-developer.md`
- **Product Strategy**: `ai-specs/agents/product-strategy-analyst.md`

## Skills

Use skills from `ai-specs/skills/` when applicable:
- `enrich-us` — Enhance user stories with technical detail
- `using-git-worktrees` — Set up isolated workspace
- `writing-skills` — Create/verify skills (TDD for docs)
- `code-auditing` — Systematic code quality audits
- `commit` — Focused commits and PRs
- `adversarial-review` — Red-team review before archiving
- `update-docs` — Keep documentation current
- `explain` — Teach concepts with mental models
- `meta-prompt` — Rewrite prompts with best practices
- `openspec-sync-specs` — Sync delta specs to main specs
- `show-spec-working` — Live feature demonstration

## Workflow

Follow the OpenSpec command sequence:
1. `/enrich-us` (optional) — Refine user story
2. `/ff` — Create OpenSpec artifacts
3. `/apply` — Implement tasks
4. `/verify` — Validate implementation
5. `/adversarial-review` — Independent review
6. `/archive` — Archive change
7. `/commit` — Create commit and PR

## Symlink Structure

```
.github/copilot/agents/ → ../../ai-specs/agents/
.github/copilot/skills/ → ../../ai-specs/skills/
```

## Language Requirement

All code, comments, documentation, commit messages, and technical artifacts MUST be in English.