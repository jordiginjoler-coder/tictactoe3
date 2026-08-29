---
description: Generic agent configuration for AI coding assistants. References core standards and enables multi-copilot compatibility.
alwaysApply: true
---

# Generic Agent Configuration

This file provides a universal configuration that works with most AI coding assistants (Claude, Cursor, Copilot, Gemini, etc.). It establishes the single source of truth for development standards and enables seamless multi-copilot support.

## Core Standards Reference

**Single Source of Truth:** All agents MUST follow the standards defined in `docs/base-standards.md`. This file is the canonical reference for all development rules, principles, and workflows.

## Agent Behavior Rules

1. **Read Base Standards First**: Before any implementation task, read and apply `docs/base-standards.md`
2. **Layer-Specific Standards**: 
   - Backend work → Read `docs/backend-standards.md`
   - Frontend work → Read `docs/frontend-standards.md`
   - Documentation work → Read `docs/documentation-standards.md`
3. **API & Data Consistency**: Use `docs/api-spec.yml` and `docs/data-model.md` for all API and data model decisions
4. **Agent Adoption**: Adopt the relevant agent from `ai-specs/agents/` for the task domain
5. **Skill Usage**: Use skills from `ai-specs/skills/` when the request matches a skill's description

## Multi-Copilot Compatibility

This configuration works because:
- Most AI assistants look for `AGENTS.md` as a generic configuration file
- All copilot-specific files (`CLAUDE.md`, `codex.md`, `GEMINI.md`) are symlinks to this file or to `docs/base-standards.md`
- The standards are tool-agnostic and focus on code quality, not tool specifics

## Required Workflow

For any development task:
1. Identify the domain (backend, frontend, documentation, etc.)
2. Read the corresponding standards document
3. Check for applicable skills in `ai-specs/skills/`
4. Adopt the relevant agent persona from `ai-specs/agents/`
5. Follow TDD: write failing tests first
6. Implement with strict TypeScript typing
7. Maintain 90%+ test coverage
8. Update documentation per `docs/documentation-standards.md`

## Language Requirement

**ALL** technical artifacts must be in English:
- Code (variables, functions, classes, comments, error messages, logs)
- Documentation (README, guides, API docs)
- Git commit messages
- Test names and descriptions
- Configuration files and scripts