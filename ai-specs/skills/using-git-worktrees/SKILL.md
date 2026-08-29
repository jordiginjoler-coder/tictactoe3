---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans. Ensures an isolated workspace exists via native tools or git worktree fallback.
author: LIDR.co
version: 1.1.0
---

# Using Git Worktrees

Ensure work happens in an isolated workspace. Prefer native worktree tools. Fall back to manual git worktrees only when no native tool is available.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0: Detect Existing Isolation

Before creating anything, check if already in an isolated workspace:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside git submodules. Verify not in a submodule:

```bash
# If this returns a path, you're in a submodule, not a worktree
git rev-parse --show-superproject-working-tree 2>/dev/null
```

- **If `GIT_DIR != GIT_COMMON` (and not a submodule):** Already in a linked worktree. Skip to Step 3.
  - On branch: "Already in isolated workspace at `<path>` on branch `<name>`."
  - Detached HEAD: "Already in isolated workspace at `<path>` (detached HEAD, externally managed)."

- **If `GIT_DIR == GIT_COMMON` (or in a submodule):** Normal repo checkout. Ask for consent before creating worktree.

## Step 1: Create Isolated Workspace

### 1a. Native Worktree Tools (Preferred)

If you have a native tool (`EnterWorktree`, `WorktreeCreate`, `/worktree`, `--worktree` flag), use it. Skip to Step 3.

Native tools handle directory placement, branch creation, cleanup automatically.

If native flow doesn't propagate Claude/Cursor settings and user expects parity, copy `.claude/settings.json` and `.claude/settings.local.json` from primary workspace after native tool finishes.

### 1b. Git Worktree Fallback (Only if 1a unavailable)

#### Directory Selection
Use single location: `.worktrees/` inside repository root.

```bash
SOURCE_ROOT=$(git rev-parse --show-toplevel)
LOCATION="$SOURCE_ROOT/.worktrees"
mkdir -p "$LOCATION"
path="$LOCATION/$BRANCH_NAME"
```

#### Safety Verification
**MUST verify `.worktrees/` is ignored before creating worktree:**

```bash
git check-ignore -q .worktrees 2>/dev/null
```

**If NOT ignored:** Add `.worktrees/` to `.gitignore`, commit, then proceed.

#### Create the Worktree

```bash
project=$(basename "$(git rev-parse --show-toplevel)")
SOURCE_ROOT=$(git rev-parse --show-toplevel)
path="$LOCATION/$BRANCH_NAME"

git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

**Sandbox fallback:** If `git worktree add` fails with permission error, report sandbox blocked worktree creation and work in current directory instead.

#### Copy Claude Configuration (Step 1b only)

After creating worktree with git, copy local Claude settings from main checkout:

```bash
copied_claude_settings=false
for claude_settings in ".claude/settings.json" ".claude/settings.local.json"; do
    if [ -f "$SOURCE_ROOT/$claude_settings" ]; then
        mkdir -p ".claude"
        cp -p "$SOURCE_ROOT/$claude_settings" "./$claude_settings"
        echo "Copied $claude_settings to worktree"
        copied_claude_settings=true
    fi
done

if [ "$copied_claude_settings" = false ]; then
    echo "No local Claude settings found"
fi
```

## Step 3: Project Setup

Auto-detect and run appropriate setup:

```bash
# Node.js
if [ -f package.json ]; then npm install; fi
# Rust
if [ -f Cargo.toml ]; then cargo build; fi
# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi
# Go
if [ -f go.mod ]; then go mod download; fi
```

## Step 4: Verify Clean Baseline

Run tests to ensure workspace starts clean:

```bash
npm test / cargo test / pytest / go test ./...
```

- **If tests fail:** Report failures, ask whether to proceed or investigate.
- **If tests pass:** Report ready.

### Report
```
Worktree ready at <full-path>
Claude settings copied (or none found / skipped per harness)
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## Step 5: Cleanup — Remove Worktree When Done

Run cleanup once work is complete (branch merged, PR closed, experiment discarded, or user confirms no longer needed).

### 5.0 Detect Cleanup Mode

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

- **If `GIT_DIR == GIT_COMMON`:** Never in a linked worktree. Skip Step 5.
- **If `GIT_DIR != GIT_COMMON`:** Inside a linked worktree. Continue.

### 5.1 Verify Work Is Saved

```bash
git status --porcelain                 # Must be empty
git log @{u}.. 2>/dev/null             # Must be empty
```

**If either returns output:** Stop. Report unsaved work, ask how to proceed.

Capture worktree path and branch name:

```bash
WORKTREE_PATH=$(git rev-parse --show-toplevel)
BRANCH_NAME=$(git branch --show-current)
```

### 5.2 Native Worktree Tools (Preferred)

If used native tool in Step 1a, use matching native command to remove (`LeaveWorktree`, `WorktreeRemove`, `/worktree remove`).

### 5.3 Git Worktree Fallback Cleanup

```bash
# 1. Move out of worktree
cd "$GIT_COMMON/.."

# 2. Remove worktree
git worktree remove "$WORKTREE_PATH"

# 3. Force-remove if needed (confirm with user)
git worktree remove --force "$WORKTREE_PATH"

# 4. Delete local branch if created for this worktree AND merged/no longer needed
git branch -d "$BRANCH_NAME"            # safe delete
git branch -D "$BRANCH_NAME"            # force delete (user confirmation only)

# 5. Prune stale metadata
git worktree prune
```

**Sandbox fallback:** If removal fails due to permissions, report failure and path needing manual cleanup.

### 5.4 Verify Cleanup

```bash
git worktree list                      # WORKTREE_PATH must not appear
ls -d "$WORKTREE_PATH" 2>/dev/null     # Must return nothing
```

### Report
```
Worktree removed: <full-path>
Branch <name> deleted (or kept, if still needed)
Main checkout left untouched
```