# Git Quick Reference Guide

A quick reference for common Git operations when working with VS Code and GitHub.

## Daily Workflow

### 1. Start Work
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git switch -c feature/your-feature-name
```

### 2. During Work
```bash
# See changes
git status
git diff

# Stage changes
git add .                    # All files
git add specific-file.js     # Specific file

# Commit
git commit -m "feat: add new feature"
```

### 3. Before Push
```bash
# Update your branch with latest from main
git pull --rebase origin main

# Resolve conflicts if any
# ...

# Push to GitHub
git push -u origin feature/your-feature-name
```

### 4. After Review & Merge
```bash
# Switch back to main
git checkout main
git pull origin main

# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote branch
git push origin --delete feature/your-feature-name
```

## Common Commands

### Pull (Download Changes)
```bash
git pull origin main                    # Standard pull
git pull --rebase origin main          # Clean history (recommended)
git fetch origin main                   # Download without merging
```

### Push (Upload Changes)
```bash
git push origin main                    # Push to main
git push -u origin feature-branch       # Push new branch
git push                                # Push if branch exists
git push --force-with-lease            # Force push (use carefully!)
```

### Merge (Combine Branches)
```bash
git merge feature-branch               # Standard merge
git merge --no-ff feature-branch       # Always create merge commit
git merge --squash feature-branch      # One commit instead of many
```

### Branch Management
```bash
git branch                              # List branches
git branch -a                          # List all branches (including remote)
git checkout -b new-branch             # Create & switch
git branch -d old-branch                # Delete local branch
git push origin --delete old-branch    # Delete remote branch
```

### Undo Changes
```bash
git checkout -- file.js                # Unstage & discard file changes
git reset HEAD file.js                 # Unstage only
git reset --hard HEAD                  # Discard all uncommitted changes
git commit --amend -m "new message"    # Fix last commit message
```

## Resolve Conflicts

When you see conflict markers:
```
<<<<<<< HEAD
Your code
=======
Their code
>>>>>>> feature-branch
```

1. Open the file
2. Choose the correct code
3. Remove `<<<<<<<`, `=======`, `>>>>>>>` markers
4. Save the file
5. Stage and commit:
```bash
git add resolved-file.js
git commit
```

## Commit Message Format

Use conventional commits:

```
type: short description

Optional detailed description
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login timeout issue"
git commit -m "docs: update API documentation"
```

## VS Code Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+Shift+G` | Open Source Control |
| `Ctrl+~` | Open Terminal |
| `Ctrl+Enter` | Quick commit |
| `Alt+Click` | Multi-line select |
| `Ctrl+Shift+P` | Command Palette |

## Scenarios

### Working with Team
1. Always `git pull --rebase` before pushing
2. Commit frequently
3. Push at least daily
4. Communicate with team before force pushing

### Fixing a Bug (Hotfix)
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug
# ... fix bug ...
git commit -m "hotfix: fix critical bug"
git push -u origin hotfix/critical-bug
# Create PR and merge quickly
```

### Continuing After Days
```bash
git checkout your-branch
git pull --rebase origin main
# ... resolve conflicts if any ...
# ... continue working ...
git add .
git commit -m "continue work"
git push
```

## Useful Tips

1. **Commit often** - Small, focused commits are easier to review
2. **Write good messages** - Be clear and descriptive
3. **Pull before push** - Avoid conflicts
4. **Check status** - Use `git status` frequently
5. **Use branches** - Don't work directly on main

## Troubleshooting

### Push Rejected
```bash
git pull --rebase origin main
git push
```

### Wrong Commit Message
```bash
git commit --amend -m "correct message"
```

### Forgot to Add File
```bash
git add forgotten-file.js
git commit --amend --no-edit
```

### See Commit History
```bash
git log --oneline -10           # Last 10 commits
git log --graph --oneline       # Graph view
git show <commit-hash>          # Show commit details
```

---

For detailed information, see `GIT_GUIDE_FA.md` (Persian guide).
