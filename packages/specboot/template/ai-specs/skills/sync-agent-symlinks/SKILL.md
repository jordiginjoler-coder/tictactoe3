---
name: sync-agent-symlinks
description: Use when skills are added/removed/renamed in ai-specs and .claude/skills and .cursor/skills must stay aligned through symlinks. Analyzes and synchronizes agent skill exposure after ai-specs skill changes.
author: LIDR.co
version: 1.1.0
---

# Sync Agent Symlinks Skill

Analyze and synchronize agent skill exposure after ai-specs skill changes (additions, removals, renames). Ensures `.claude/skills` and `.cursor/skills` stay aligned with `ai-specs/skills` through symlinks.

## When to Use

- After adding a new skill to `ai-specs/skills/`
- After removing a skill from `ai-specs/skills/`
- After renaming a skill in `ai-specs/skills/`
- When agent-specific skill directories appear out of sync
- Before releasing a new version of the specboot template

## Process

### 1. Discover Current State

```bash
# List canonical skills
ls ai-specs/skills/

# List agent-specific symlinks
ls -la .claude/skills/
ls -la .cursor/skills/
```

### 2. Compute Differences

For each agent directory (`.claude`, `.cursor`):

| State | Action |
|-------|--------|
| Skill in `ai-specs/skills/` but missing symlink | Create symlink |
| Symlink exists but target missing in `ai-specs/skills/` | Remove broken symlink |
| Symlink points to wrong target | Fix symlink target |
| Skill renamed in `ai-specs/skills/` | Update symlink to new name |

### 3. Synchronize

For each agent directory (`dir` in `.claude`, `.cursor`):

```bash
# For each skill in ai-specs/skills/
for skill in ai-specs/skills/*/; do
    skill_name=$(basename "$skill")
    target="../../ai-specs/skills/$skill_name"
    link="$dir/skills/$skill_name"

    if [ ! -L "$link" ]; then
        # Create symlink
        ln -sfn "$target" "$link"
        echo "Created: $link -> $target"
    elif [ "$(readlink "$link")" != "$target" ]; then
        # Fix incorrect symlink
        ln -sfn "$target" "$link"
        echo "Fixed: $link -> $target"
    fi
done

# Remove stale symlinks
for link in "$dir/skills/"*; do
    [ -L "$link" ] || continue
    skill_name=$(basename "$link")
    if [ ! -d "ai-specs/skills/$skill_name" ]; then
        rm "$link"
        echo "Removed stale: $link"
    fi
done
```

### 4. Verify

```bash
# Verify all canonical skills have symlinks
for skill in ai-specs/skills/*/; do
    skill_name=$(basename "$skill")
    for dir in .claude .cursor; do
        if [ ! -L "$dir/skills/$skill_name" ]; then
            echo "MISSING: $dir/skills/$skill_name"
        fi
    done
done

# Verify no broken symlinks
find .claude/skills .cursor/skills -type l ! -exec test -e {} \; -print
```

### 5. Report

```
Sync complete for .claude and .cursor

Created: N symlinks
Fixed: M symlinks
Removed: K stale symlinks

All agent skill directories now aligned with ai-specs/skills/
```

## Symlink Convention

| Source (Canonical) | Target (Agent) |
|--------------------|----------------|
| `ai-specs/skills/<skill-name>/` | `.claude/skills/<skill-name>` |
| `ai-specs/skills/<skill-name>/` | `.cursor/skills/<skill-name>` |
| `ai-specs/agents/<agent-name>.md` | `.claude/agents/<agent-name>.md` |
| `ai-specs/agents/<agent-name>.md` | `.cursor/agents/<agent-name>.md` |

All symlinks use relative paths: `../../ai-specs/skills/<skill-name>`

## Integration with lidr-specboot

The `packages/specboot/template/` contains the canonical structure. When `npx @lidr/lidr-specboot` runs, it creates these symlinks automatically. This skill is for maintaining sync after the initial boot.

## Notes

- Run this skill after ANY change to `ai-specs/skills/` or `ai-specs/agents/`
- Always verify both `.claude` and `.cursor` directories
- Use relative symlinks for portability
- Report all changes made for audit trail