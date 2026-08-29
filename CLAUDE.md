# Claude Code Configuration

This configuration optimizes Claude Code for this project's spec-driven development workflow with OpenSpec.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/enrich-us <ticket>` | Analyze and enhance user story with technical detail |
| `/ff <ticket>` | Create all OpenSpec artifacts (feature, tasks, etc.) |
| `/apply <ticket>` | Implement tasks one by one |
| `/verify <ticket>` | Validate implementation against artifacts |
| `/adversarial-review <ticket>` | Independent red-team code review |
| `/archive <ticket>` | Archive completed change |
| `/commit` | Create focused commit and PR |

## Core Standards

**MANDATORY:** Read and apply `docs/base-standards.md` before any task.

This file is a symlink to `docs/base-standards.md` for direct access to all standards.

## Agent Personas

Adopt the relevant agent for your task:
- **Backend**: `ai-specs/agents/backend-developer.md`
- **Frontend**: `ai-specs/agents/frontend-developer.md`
- **Product Strategy**: `ai-specs/agents/product-strategy-analyst.md`

## Skills

Load skills automatically when request matches description:
- `ai-specs/skills/enrich-us` — Enhance user stories
- `ai-specs/skills/using-git-worktrees` — Isolated workspace setup
- `ai-specs/skills/writing-skills` — Create/verify skills (TDD for docs)
- `ai-specs/skills/code-auditing` — Systematic code quality audits
- `ai-specs/skills/commit` — Focused commits and PRs
- `ai-specs/skills/adversarial-review` — Red-team review before archive
- `ai-specs/skills/update-docs` — Keep documentation current
- `ai-specs/skills/explain` — Teach concepts with mental models
- `ai-specs/skills/meta-prompt` — Rewrite prompts with best practices
- `ai-specs/skills/openspec-sync-specs` — Sync delta specs to main specs
- `ai-specs/skills/show-spec-working` — Live feature demonstration

## OpenSpec Workflow

```
Optional: /enrich-us SCRUM-10
Required: /ff SCRUM-10
Required: /apply SCRUM-10
Required: /verify SCRUM-10
Required: /adversarial-review SCRUM-10
Required: /archive SCRUM-10
Required: /commit
```

## Symlink Structure

```
.claude/agents/ → ../../ai-specs/agents/
.claude/skills/ → ../../ai-specs/skills/
```

These symlinks are created by `npx @lidr/lidr-specboot` and must be maintained.

## Configuration

- Model: Use Opus high reasoning for planning (`enrich-us`, `openspec-ff-change`, `openspec-continue-change`)
- Model: Use Sonnet medium for implementation and other tasks
- Update `.claude/settings.json` to switch models as needed