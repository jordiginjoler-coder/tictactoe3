---
description: Instructions for the specboot initialization and template system.
alwaysApply: true
---

# Specboot Instructions

This document describes how the specboot template system works and how to use it to bootstrap new projects with OpenSpec-powered spec-driven development.

## Overview

Specboot is a template distribution system that copies a complete OpenSpec-ready project structure into any target directory. It includes:

- Core development standards (`docs/`)
- AI agent definitions (`ai-specs/agents/`)
- Reusable skills/workflows (`ai-specs/skills/`)
- Multi-copilot configuration files (AGENTS.md, CLAUDE.md, codex.md, GEMINI.md)
- Template engine for project initialization

## Template Structure

```
packages/specboot/template/
├── docs/                      # Technical standards (copied to target)
│   ├── base-standards.md
│   ├── backend-standards.md
│   ├── frontend-standards.md
│   ├── documentation-standards.md
│   ├── api-spec.yml
│   ├── data-model.md
│   ├── development_guide.md
│   └── openspec-tasks-mandatory-steps.md
├── ai-specs/
│   ├── agents/                # Agent personas
│   │   ├── backend-developer.md
│   │   ├── frontend-developer.md
│   │   └── product-strategy-analyst.md
│   └── skills/                # Reusable workflows
│       ├── adversarial-review/
│       ├── code-auditing/
│       ├── commit/
│       ├── enrich-us/
│       ├── explain/
│       ├── meta-prompt/
│       ├── openspec-sync-specs/
│       ├── show-spec-working/
│       ├── sync-agent-symlinks/
│       ├── update-docs/
│       ├── using-git-worktrees/
│       └── writing-skills/
└── specboot-instructions.md   # This file
```

## Installation

### Via NPX (Recommended)

```bash
# In your project root
npx @lidr/lidr-specboot
```

This copies all template files and creates the symlink structure automatically.

### Manual Copy

```bash
# Clone or copy this repository
cp -rn lidr-specboot/* your-project/

# Then run the init script manually
cd your-project
node packages/specboot/bin/init.js
```

## What Gets Created

### Files Copied (Never Overwritten)

All files from `template/` are copied to the target directory. **Existing files are never overwritten** — safe to re-run.

### Symlinks Created

| Source | Target | Purpose |
|--------|--------|---------|
| `docs/base-standards.md` | `AGENTS.md` | Generic agent config |
| `docs/base-standards.md` | `CLAUDE.md` | Claude/Cursor config |
| `docs/base-standards.md` | `codex.md` | GitHub Copilot config |
| `docs/base-standards.md` | `GEMINI.md` | Gemini config |
| `../../ai-specs/agents/*` | `.claude/agents/*` | Claude agent access |
| `../../ai-specs/skills/*` | `.claude/skills/*` | Claude skill access |
| `../../ai-specs/agents/*` | `.cursor/agents/*` | Cursor agent access |
| `../../ai-specs/skills/*` | `.cursor/skills/*` | Cursor skill access |

## Post-Installation Steps

### 1. Customize `docs/` (MANDATORY)

Update all files in `docs/` to match your project:

- `base-standards.md` — Core principles, tech stack references
- `backend-standards.md` — Your backend stack, patterns, conventions
- `frontend-standards.md` — Your frontend stack, component patterns
- `api-spec.yml` — Your actual API endpoints and schemas
- `data-model.md` — Your entities, relationships, validation rules
- `development_guide.md` — Your setup, commands, workflows
- `openspec-tasks-mandatory-steps.md` — Your task requirements

### 2. Initialize OpenSpec

```bash
# Install OpenSpec globally
npm install -g @fission-ai/openspec@latest

# Initialize in your project
openspec init
```

### 3. Configure OpenSpec Context

Update your project's `config.yml` (created by `openspec init`) to reference the docs and ai-specs:

```yaml
context: |
  Tech stack: [YOUR STACK - e.g., TypeScript, Node.js, Express, Prisma, React]
  Architecture: [YOUR ARCHITECTURE - e.g., Clean Architecture with DDD]
  Domain: [YOUR DOMAIN - e.g., Recruitment ATS platform]
  
  Project specs (single source of truth):
  - docs/base-standards.md — core principles, TDD, language standards
  - docs/backend-standards.md — backend patterns
  - docs/frontend-standards.md — frontend patterns
  - docs/api-spec.yml — API contracts
  - docs/data-model.md — domain and data model
  - docs/documentation-standards.md — docs structure
  
  For implementation: adopt agents from ai-specs/agents/
  Use skills from ai-specs/skills/ for workflow guidance.
```

## Symlink Maintenance

The symlink structure is critical for multi-copilot support. After any file operations:

```bash
# Verify symlinks
ls -la AGENTS.md CLAUDE.md codex.md GEMINI.md
ls -la .claude/agents/ .claude/skills/
ls -la .cursor/agents/ .cursor/skills/

# Re-run init if symlinks are broken
npx @lidr/lidr-specboot
```

**Rules:**
- `ai-specs/` is the canonical source
- `.claude/` and `.cursor/` are symlink consumers
- Never edit files in `.claude/` or `.cursor/` directly — edit in `ai-specs/`
- When adding new agents/skills to `ai-specs/`, run init to create symlinks

## Updating Specboot

To update to a newer specboot version:

```bash
# Re-run init (safe - won't overwrite existing files)
npx @lidr/lidr-specboot@latest
```

Then manually merge any updates to `docs/` and `ai-specs/` from the template.

## Customization Best Practices

1. **Keep base structure** — Don't rename/remove standard files
2. **Replace content, not files** — Update the content of existing files
3. **Maintain cross-references** — Ensure internal links still work
4. **Sync agents/skills** — If you add custom agents/skills, add them to `ai-specs/` and re-run init
5. **Version control everything** — Track all changes including symlinks

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Symlinks not created | Run with sufficient permissions; on Windows, enable Developer Mode or run as Admin |
| Files not copied | Check target directory permissions |
| OpenSpec can't find docs | Verify `config.yml` context paths are correct relative to project root |
| Agent not loading | Check `.claude/agents/` symlinks point to correct `ai-specs/agents/` files |
| Skill not loading | Check `.claude/skills/` symlinks; ensure skill `description` matches trigger |

## Version Compatibility

| Specboot Version | OpenSpec Version | Node.js |
|------------------|------------------|---------|
| 0.1.x | 1.3.x+ | 18+ |

## License

MIT License — Copyright (c) 2025 LIDR.co