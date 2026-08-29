---
name: openspec-sync-specs
description: Use when the user wants to update main specs with changes from a delta spec, without archiving the change. Syncs delta specs from a change to main specs through intelligent merging.
author: openspec
version: 1.1.0
license: MIT
compatibility: Requires openspec CLI.
---

# OpenSpec Sync Specs Skill

**Agent-driven operation** — read delta specs and directly edit main specs to apply changes. Allows intelligent merging (e.g., adding a scenario without copying entire requirement).

## Input

Optionally specify a change name. If omitted, check if inferable from conversation context. If vague/ambiguous, **MUST prompt for available changes**.

## Steps

### 1. If No Change Name, Prompt for Selection

Run `openspec list --json` to get available changes. Use AskUserQuestion tool to let user select.

Show changes that have delta specs (under `specs/` directory).

**IMPORTANT:** Do NOT guess or auto-select. Always let the user choose.

### 2. Find Delta Specs

Look for delta spec files in `openspec/changes/<name>/specs/*/spec.md`.

Each delta spec file contains sections:
- `## ADDED Requirements` — New requirements to add
- `## MODIFIED Requirements` — Changes to existing requirements
- `## REMOVED Requirements` — Requirements to remove
- `## RENAMED Requirements` — Requirements to rename (FROM:/TO: format)

If no delta specs found, inform user and stop.

### 3. For Each Delta Spec, Apply Changes to Main Specs

For each capability with a delta spec at `openspec/changes/<name>/specs/<capability>/spec.md`:

#### a. Read Delta Spec
Understand intended changes.

#### b. Read Main Spec
At `openspec/specs/<capability>/spec.md` (may not exist yet).

#### c. Apply Changes Intelligently

**ADDED Requirements:**
- If requirement doesn't exist in main spec → add it
- If requirement already exists → update to match (treat as implicit MODIFIED)

**MODIFIED Requirements:**
- Find requirement in main spec
- Apply changes:
  - Adding new scenarios (don't copy existing ones)
  - Modifying existing scenarios
  - Changing requirement description
- Preserve scenarios/content not mentioned in delta

**REMOVED Requirements:**
- Remove entire requirement block from main spec

**RENAMED Requirements:**
- Find FROM requirement, rename to TO

#### d. Create New Main Spec if Capability Doesn't Exist
- Create `openspec/specs/<capability>/spec.md`
- Add Purpose section (brief, mark as TBD)
- Add Requirements section with ADDED requirements

### 4. Show Summary

After applying all changes, summarize:
- Which capabilities were updated
- What changes made (requirements added/modified/removed/renamed)

## Delta Spec Format Reference

```markdown
## ADDED Requirements

### Requirement: New Feature
The system SHALL do something new.

#### Scenario: Basic case
- **WHEN** user does X
- **THEN** system does Y

## MODIFIED Requirements

### Requirement: Existing Feature
#### Scenario: New scenario to add
- **WHEN** user does A
- **THEN** system does B

## REMOVED Requirements

### Requirement: Deprecated Feature

## RENAMED Requirements

- FROM: `### Requirement: Old Name`
- TO: `### Requirement: New Name`
```

## Key Principle: Intelligent Merging

Unlike programmatic merging, apply **partial updates**:
- To add a scenario, just include that scenario under MODIFIED — don't copy existing scenarios
- Delta represents *intent*, not wholesale replacement
- Use judgment to merge changes sensibly

## Output On Success

```
## Specs Synced: <change-name>

Updated main specs:

**<capability-1>**:
- Added requirement: "New Feature"
- Modified requirement: "Existing Feature" (added 1 scenario)

**<capability-2>**:
- Created new spec file
- Added requirement: "Another Feature"

Main specs are now updated. The change remains active — archive when implementation is complete.
```

## Guardrails

- Read both delta and main specs before making changes
- Preserve existing content not mentioned in delta
- If unclear, ask for clarification
- Show what you're changing as you go
- Operation should be idempotent — running twice gives same result