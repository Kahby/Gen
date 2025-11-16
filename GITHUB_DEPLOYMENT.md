# GitHub Deployment Guide

This guide will help you deploy your Prompt Masters project to GitHub.

## Step 1: Fix Embedded Git Repository Issue

If you see a warning about embedded git repository, remove it:

```bash
# Remove nested git repository from vite-project (if it exists)
rm -rf vite-project/.git
# Or on Windows:
rmdir /s /q vite-project\.git
```

## Step 2: Initialize Git Repository (if not already done)

```bash
# Navigate to project root
cd "C:\Users\The Computer Logic\Desktop\GenAi Club"

# Initialize git (if not already initialized)
git init

# Check status
git status
```

## Step 3: Add All Files

```bash
# Add all files to staging
git add .

# If you still see the embedded repo warning, remove it from cache:
git rm --cached vite-project
# Then add it again:
git add vite-project/
```

## Step 4: Create Initial Commit

```bash
# Create your first commit
git commit -m "Initial commit: Prompt Masters project"
```

## Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `prompt-masters` (or any name you prefer)
4. Description: "Prompt Masters - AI-powered prompt analysis platform"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 6: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/prompt-masters.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/prompt-masters.git

# Verify remote was added
git remote -v
```

## Step 7: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main

# If you get authentication error, you may need to:
# - Use GitHub Personal Access Token instead of password
# - Or set up SSH keys
```

## Step 8: Verify Deployment

1. Go to your GitHub repository page
2. You should see all your files uploaded
3. Check that `.env` files are NOT visible (they should be in .gitignore)

## Important Notes

### Files That Are NOT Committed (Protected by .gitignore):
- ✅ `.env` files (contains sensitive API keys)
- ✅ `node_modules/` (dependencies)
- ✅ `dist/` and `build/` folders (build outputs)
- ✅ `server/uploads/` (uploaded files)
- ✅ Log files

### Files That ARE Committed:
- ✅ All source code
- ✅ `package.json` files
- ✅ Configuration files
- ✅ README files

## Troubleshooting

### Issue: "Embedded git repository" warning
**Solution:**
```bash
git rm --cached vite-project
rm -rf vite-project/.git
git add vite-project/
```

### Issue: Authentication failed
**Solution:**
- Use GitHub Personal Access Token (Settings → Developer settings → Personal access tokens)
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Issue: Large file upload fails
**Solution:**
- Make sure `node_modules/` is in `.gitignore`
- Use Git LFS for large files if needed

## Next Steps After Deployment

1. **Add README.md** to explain your project
2. **Set up GitHub Actions** for CI/CD (optional)
3. **Add license** file (MIT, Apache, etc.)
4. **Create branches** for features/development
5. **Set up GitHub Pages** for frontend hosting (optional)

## Repository Structure

```
GenAi Club/
├── server/              # Backend (Node.js/Express)
│   ├── models/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── vite-project/        # Frontend (React/Vite)
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore          # Root gitignore
├── DEPLOYMENT.md       # Deployment guide
└── README.md           # Project documentation
```

## Security Reminder

⚠️ **NEVER commit:**
- `.env` files
- API keys
- Passwords
- Database credentials
- Personal access tokens

These are already in `.gitignore` but always double-check before committing!

