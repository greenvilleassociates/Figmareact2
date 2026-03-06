# Git Workflow for Fusion Project Manager

## Architecture Overview

**Fusion Project Manager** is a multi-tenant application:
- **Main Repository:** `greenvilleassociates/Figmareact2` - The core multi-tenant application codebase
- **Tenant Instances:** Each deployment (like `usc242`) is a separate instance of the application
- **Current Instance:** `jssg33/usc242` - Your working instance for USC course work

## Prerequisites
- Git installed on your system
- Node.js 24 or higher installed
- Access to the GitHub repository: https://github.com/greenvilleassociates/Figmareact2

## Initial Setup (First Time Only)

### 1. Clone the Repository
```bash
git clone https://github.com/greenvilleassociates/Figmareact2.git
cd Figmareact2
```

### 2. Configure Git (if not already done)
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Daily Workflow

### Before Making Changes: Pull Latest Code

Always pull the latest changes from GitHub before you start working:

```bash
# Make sure you're on the main branch
git checkout main

# Pull the latest changes
git pull origin main
```

If you have uncommitted changes and need to pull:

```bash
# Save your current work temporarily
git stash

# Pull the latest changes
git pull origin main

# Reapply your saved changes
git stash pop
```

### Making Changes and Pushing

1. **Check what files changed:**
```bash
git status
```

2. **Stage your changes:**
```bash
# Add all changed files
git add .

# Or add specific files
git add src/app/components/LoginPage.tsx
```

3. **Commit your changes:**
```bash
git commit -m "Add login page with API authentication"
```

4. **Push to GitHub:**
```bash
git push origin main
```

## Common Git Commands

### View Commit History
```bash
git log --oneline
```

### Discard Local Changes
```bash
# Discard changes to a specific file
git checkout -- filename.tsx

# Discard all local changes (CAREFUL!)
git reset --hard HEAD
```

### Create a Branch (for experimental features)
```bash
# Create and switch to a new branch
git checkout -b feature/new-feature

# Push the branch to GitHub
git push origin feature/new-feature
```

### Merge Branch Back to Main
```bash
# Switch to main
git checkout main

# Merge your feature branch
git merge feature/new-feature

# Push to GitHub
git push origin main
```

## Resolving Merge Conflicts

If you encounter merge conflicts during `git pull`:

1. **Identify conflicted files:**
```bash
git status
```

2. **Open conflicted files and look for:**
```
<<<<<<< HEAD
Your local changes
=======
Changes from GitHub
>>>>>>> origin/main
```

3. **Edit the file to keep the correct code**

4. **Mark as resolved:**
```bash
git add conflicted-file.tsx
git commit -m "Resolve merge conflicts"
```

## Project-Specific Notes

### Multi-Tenant Architecture

**Main Application Repository:**
- **Repository:** https://github.com/greenvilleassociates/Figmareact2
- **Purpose:** Core multi-tenant application codebase
- **GitHub Pages:** https://greenvilleassociates.github.io/Figmareact2

**Tenant Instance (USC242):**
- **Repository:** https://github.com/jssg33/usc242
- **Purpose:** Your working instance for USC course work
- **GitHub Pages:** https://jssg33.github.io/usc242
- **Configuration:** Set in the Settings page within the application
- **Note:** This is one of many possible tenant deployments of Figmareact2

### Development Workflow

When working on the **multi-tenant application** (`Figmareact2`):
- Changes to core features, components, and functionality
- Push to `greenvilleassociates/Figmareact2`
- These changes will be available to all tenant instances

When working on a **specific tenant instance** (`usc242`):
- Instance-specific configurations, data, and customizations
- Deploy to the specific tenant repository (e.g., `jssg33/usc242`)
- Configured through the Settings page in the application

### Node.js Version Requirement
This project requires **Node.js 24 or higher** as defined in `package.json`:

```json
"engines": {
  "node": ">=24.0.0",
  "npm": ">=10.0.0"
}
```

To check your Node.js version:
```bash
node --version
```

To upgrade Node.js:
- Visit https://nodejs.org/
- Download and install Node.js 24 LTS or higher
- Or use a version manager like `nvm`:
  ```bash
  nvm install 24
  nvm use 24
  ```

### Build and Deploy

After pulling latest changes:

```bash
# Install dependencies (if package.json changed)
npm install

# Build the project
npm run build
```

## Quick Reference Cheat Sheet

```bash
# Daily workflow
git pull origin main          # Get latest changes
# ... make your changes ...
git add .                     # Stage all changes
git commit -m "Description"   # Commit changes
git push origin main          # Push to GitHub

# Check status
git status                    # See what changed
git log --oneline            # View commit history

# Undo changes
git stash                     # Temporarily save changes
git stash pop                 # Restore saved changes
git reset --hard HEAD         # Discard all local changes (CAREFUL!)

# Branch management
git branch                    # List branches
git checkout -b branch-name   # Create new branch
git checkout main             # Switch to main branch
```

## Getting Help

If you're stuck:
1. Check the error message carefully
2. Use `git status` to see what state your repository is in
3. Search the error message online
4. Use `git help <command>` for detailed help on any command

## Safety Tips

1. **Always pull before making changes** - Avoid conflicts
2. **Commit frequently** - Small commits are easier to manage
3. **Write clear commit messages** - Future you will thank you
4. **Test before pushing** - Make sure your code works
5. **Keep a backup** - Consider keeping a separate copy of important work