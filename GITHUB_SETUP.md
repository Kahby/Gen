# Quick GitHub Deployment Guide

## Step-by-Step Instructions

### Step 1: Remove Nested Git Repository (if exists)

Open Git Bash or Command Prompt in your project folder and run:

```bash
# Remove nested git repository
rm -rf vite-project/.git

# Or on Windows CMD:
rmdir /s /q vite-project\.git
```

### Step 2: Clean Git Cache

```bash
# Reset git staging area
git reset

# Remove any problematic files from cache
git rm --cached -r vite-project 2>/dev/null || true
```

### Step 3: Add Files Properly

```bash
# Add files one by one to avoid issues
git add .gitignore
git add README.md
git add DEPLOYMENT.md
git add GITHUB_DEPLOYMENT.md
git add server/
git add vite-project/src/
git add vite-project/public/
git add vite-project/package.json
git add vite-project/vite.config.js
git add vite-project/tailwind.config.js
git add vite-project/postcss.config.js
git add vite-project/index.html
```

Or if the above doesn't work, try:

```bash
# Add everything except problematic files
git add --all
```

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Prompt Masters project"
```

### Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `prompt-masters`
3. Description: "AI-powered prompt analysis platform"
4. Choose Public or Private
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### Step 6: Connect and Push

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/prompt-masters.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Manual File Upload

If git commands are causing issues, you can:

1. Create repository on GitHub
2. Use GitHub Desktop app
3. Or upload files directly through GitHub web interface

## Troubleshooting

### If you see "embedded git repository" warning:
```bash
git rm --cached vite-project
rm -rf vite-project/.git
git add vite-project/
```

### If authentication fails:
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys

### If files are too large:
- Make sure `node_modules/` is in `.gitignore`
- Don't commit `dist/` or `build/` folders

## What Gets Committed

✅ **Will be committed:**
- Source code files
- Configuration files
- README and documentation

❌ **Will NOT be committed (protected by .gitignore):**
- `.env` files
- `node_modules/`
- `dist/` and `build/` folders
- `server/uploads/`
- Log files

