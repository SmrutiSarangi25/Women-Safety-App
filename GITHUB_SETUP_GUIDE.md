# GitHub Repository Setup Guide

## ✅ What's Been Set Up

This guide walks you through configuring your GitHub repository for best practices in CI/CD, security, and collaboration.

### 1. GitHub Actions Workflows (Automated)

Four workflows have been created in `.github/workflows/`:

#### **Frontend CI** (`frontend-ci.yml`)
- Runs on: Push to main/develop and PRs
- Tests: Node 18.x and 20.x
- Checks: ESLint, Build verification, Unit tests

#### **Backend CI** (`backend-ci.yml`)
- Runs on: Push to main/develop and PRs
- Tests: Node 18.x and 20.x
- Checks: ESLint, Tests, Build verification

#### **Code Quality** (`code-quality.yml`)
- Runs on: All pushes and PRs
- Security scanning with Trivy
- Results uploaded to GitHub Security tab

#### **Deploy Preview** (`deploy-preview.yml`)
- Runs on: develop branch and PRs
- Builds frontend
- Saves artifacts for 7 days

---

## 🔧 Manual GitHub Configuration

After pushing these files to GitHub, configure these settings:

### Repository Settings

1. **Go to**: Settings → General
   - [ ] Make repository private (if needed)
   - [ ] Enable "Automatically delete head branches"
   - [ ] Enable "Require branches to be up to date before merging"

2. **Code Security & Analysis** (Settings → Security)
   - [ ] Enable "Dependabot alerts"
   - [ ] Enable "Dependabot security updates"
   - [ ] Enable "Secret scanning"
   - [ ] Enable "Code scanning"

3. **Branch Protection Rules** (Settings → Branches)
   - [ ] Click "Add rule"
   - Pattern: `main`
   - [ ] Require pull request reviews before merging
   - [ ] Require 1 approval
   - [ ] Require CODEOWNERS review
   - [ ] Enforce admin rules
   - [ ] Require branches to be up to date before merging
   - [ ] Require status checks to pass (select CI workflows)

4. **Branch Protection for Develop** (Settings → Branches)
   - Pattern: `develop`
   - [ ] Require pull request reviews
   - [ ] Require 1 approval
   - [ ] Require status checks to pass

---

## 📋 Quick Start for Contributors

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_REPO
   cd women-safety-app
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Setup development environment**
   ```bash
   # Frontend
   cd frontend && npm install && npm run dev
   
   # Backend (in new terminal)
   cd backend && npm install && npm run dev
   ```

4. **Before committing**
   ```bash
   # Frontend
   cd frontend && npm run lint && npm run build
   
   # Backend
   cd backend && npm run lint
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🔐 Secrets & Environment Variables

For GitHub Actions to work with environment-specific configs:

1. Go to **Settings → Secrets and variables → Actions**
2. Add these secrets:
   - `MONGO_URI` - MongoDB connection string
   - `CLOUDINARY_NAME` - Cloudinary name
   - `CLOUDINARY_API_KEY` - Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Cloudinary secret
   - `TWILIO_ACCOUNT_SID` - Twilio SID
   - `TWILIO_AUTH_TOKEN` - Twilio token
   - `JWT_SECRET` - JWT secret key
   - `GOOGLE_CLIENT_ID` - Google OAuth ID

3. Update workflow files if needed to use these secrets

---

## 📊 Monitoring & Insights

- **Actions Tab**: Monitor all workflow runs
- **Security Tab**: View security alerts and scanning results
- **Insights → Dependency graph**: Track dependencies
- **Insights → Network**: View branch/fork activity
- **Issues & Discussions**: Community engagement

---

## 🚀 Deployment Options

Consider adding workflows for:
- Automatic deployment to Vercel/Netlify (frontend)
- Backend deployment to Heroku/Railway/Render
- Docker containerization

---

## 📝 Template Files Included

- `.github/ISSUE_TEMPLATE/bug_report.md` - Bug report template
- `.github/ISSUE_TEMPLATE/feature_request.md` - Feature request template
- `.github/pull_request_template/pull_request_template.md` - PR template
- `CONTRIBUTING.md` - Contribution guidelines

---

## ✨ Next Steps

1. **Push these changes to GitHub**
   ```bash
   git add .github/ CONTRIBUTING.md
   git commit -m "Add GitHub Actions and repository configuration"
   git push origin main
   ```

2. **Configure branch protection rules** (see Manual Configuration above)
3. **Add repository secrets** (see Secrets section above)
4. **Monitor first workflow run** in Actions tab
5. **Share CONTRIBUTING.md in README**

### Your GitHub Username: **@SmrutiSarangi25**

---

## 🆘 Troubleshooting

**Workflows not running?**
- Check GitHub Actions are enabled: Settings → Actions → General
- Verify branch names match (`main`, `develop`)
- Check for permission issues on secrets

**Failing workflows?**
- Check Actions tab for error logs
- Ensure dependencies are in `package.json`
- Verify environment variables/secrets are set

**Need help?**
- Review GitHub Actions documentation: https://docs.github.com/actions
- Check workflow files in `.github/workflows/`
- Enable debug logging in Actions

---

**Updated**: March 30, 2026
**Status**: ✅ Ready for GitHub
