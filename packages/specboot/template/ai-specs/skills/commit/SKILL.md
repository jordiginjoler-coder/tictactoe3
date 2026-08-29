---
name: commit
description: Use when creating focused commits and pull requests following repository standards. Handles feature-scoped commits, conventional commit messages, and GitHub PR creation via gh CLI.
author: LIDR.co
version: 1.1.0
---

# Commit Skill

Create clear, comprehensive commits and Pull Requests aligned with project standards.

## Arguments

`$ARGUMENTS` may contain:
- **Nothing** — Stage and commit all relevant changes, open single PR
- **Feature/ticket IDs** — e.g., `SCRUM-123`, branch names, feature labels. Stage only matching changes
- **Description-only mode** — If user explicitly says "no PR", "only commit", "only description", "don't touch git", "just the message", or "dry run" → output staging plan and commit message only, no git operations

## Process

### 0. Check for Description-Only Mode
If user explicitly requested no git operations:
1. Inspect state, resolve scope
2. Output proposed commit message (subject + body)
3. Stop — do not run git/gh commands

### 1. Inspect Current State
- `git status` and `git diff` (and `git diff --staged`)
- Identify current branch; create feature branch from base if needed

### 2. Resolve Scope
- **No args**: Stage all relevant changes (exclude `.env`, build artifacts, local config)
- **With args**: Map args to changes by path, ticket ID in branch name, or diff context
  - Stage only matching files/hunks
  - Use `git add -p` for mixed files
  - Leave other changes unstaged
  - If no changes match, report and stop

### 3. Commit Message (English Only)
- **Subject**: Short, imperative (e.g., "Add candidate filters to position list"). Optionally prefix with ticket: `SCRUM-123: Add candidate filters`
- **Body**: Bullet points describing what changed and why. Reference ticket IDs.

### 4. Commit and Push
- Create commit with message
- Push branch to remote (`-u` if first push)

### 5. Pull Request (gh CLI)
- Create/update PR for current branch
- **Title**: Clear, aligned with commit (include ticket if applicable: `[SCRUM-123] Add candidate filters`)
- **Description**: Summarize change set, link ticket, note testing/follow-ups

### 6. Summary
- Report committed files and scope
- If args provided: confirm included features, note unstaged changes
- Provide PR URL from `gh` output

## References
- `docs/base-standards.md` — English-only for commits
- `docs/backend-standards.md` / `docs/frontend-standards.md` — Git workflow conventions
- Use `gh` for all GitHub operations