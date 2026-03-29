# 🔐 GitHub Upload Security Checklist

Before uploading your Women Safety App to GitHub, follow this checklist to ensure NO secrets are exposed!

## ✅ COMPLETED FIXES

I've already fixed these issues:
- ✅ Removed hardcoded Google Client ID from `frontend/API/Config.js`
- ✅ Updated `.env.example` files to remove real Google Client ID
- ✅ Updated utility scripts to use environment variables for MongoDB URI
- ✅ Verified `.gitignore` is properly configured

## 📋 YOUR CHECKLIST BEFORE PUSHING TO GITHUB

### 1. **CRITICAL: Create `.env` files locally (DO NOT commit)**

**Backend Setup:**
```bash
cd backend
```

Create `backend/.env` file with YOUR secrets:
```env
# Database Configuration
MONGO_URI=mongodb://your_username:your_password@your_host:27017/women-safety-app
PASSWORD=your_password

# JWT Configuration
JWT_SECRET=create_a_strong_random_secret_here_at_least_32_chars
JWT_EXPIRY=30d

# Twilio Configuration (SMS & WhatsApp)
TWILIO_ACCOUNT_SID=your_actual_twilio_sid
TWILIO_AUTH_TOKEN=your_actual_twilio_token
TWILIO_FROM_NUMBER=+1xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+1xxxxxxxxxx

# Email Configuration (Gmail/SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_USER=noreply@raksha.app
ADMIN_EMAIL=admin@raksha.app

# Cloudinary Configuration (Image Upload)
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_SECRET=your_actual_secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret

# Node Environment
NODE_ENV=development
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Frontend Setup:**
```bash
cd frontend
```

Create `frontend/.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Authentication URLs
VITE_SIGNUP_URL=http://localhost:8000/api/user/signup
VITE_LOGIN_URL=http://localhost:8000/api/user/login
VITE_LOGOUT_URL=http://localhost:8000/api/user/logout
VITE_CHECKAUTH_URL=http://localhost:8000/api/user/auth-check

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id

# Google OAuth URLs
VITE_GOOGLELOGIN_URL=http://localhost:8000/api/user/googleLogin

# User APIs
VITE_BASE_URL=http://localhost:8000/api/user
VITE_GETDATA_URL=http://localhost:8000/api/user/get-data

# Contacts APIs
VITE_ADDCONTACT_URL=http://localhost:8000/api/contacts/addcontact
VITE_DELETECONTACT_URL=http://localhost:8000/api/contacts/delete-contact

# Emergency Contacts APIs
VITE_EMERGENCY_CONTACTS_URL=http://localhost:8000/api/emergency-contacts

# Location APIs
VITE_LOCATION_URL=http://localhost:8000/api/location

# SOS APIs
VITE_SOS_URL=http://localhost:8000/api/sos

# Google Maps API
VITE_GOOGLE_MAPS_KEY=your_actual_google_maps_api_key
```

### 2. **Verify .gitignore is working**

```bash
git status
```

**Expected Result:** You should NOT see:
- `.env`
- `.env.local`
- `backend/.env`
- `frontend/.env`
- `node_modules/`
- `dist/`
- `build/`

If these appear in git status, add them to `.gitignore` immediately.

### 3. **Clean up git history (if you already committed secrets)**

If you've already pushed commits with secrets to any repository:

**Option A: Remove from recent commits (recommended)**
```bash
# Remove secrets from the last 5 commits (adjust number as needed)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env frontend/.env .env 2>/dev/null' \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
git push origin --force --tags
```

**Option B: Use BFG Repo-Cleaner (simpler)**
```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clean the repository
bfg --delete-files backend/.env --delete-files frontend/.env

# Prune and push
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push origin --force --all
```

### 4. **Create Production Environment Variables**

For GitHub Actions or production deployment:

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add each secret:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - etc.

### 5. **Final Security Check**

Run this command to scan for secrets:
```bash
# Install truffleHog (optional but recommended)
# pip install truffleHog

# Scan your repository
truffleHog git file://. --regex
```

### 6. **Create a Secure README Section**

Add this to your main README.md:

```markdown
## 🔒 Environment Variables Setup

### Prerequisites
- Node.js v16 or higher
- MongoDB instance
- Twilio account (for SMS/WhatsApp)
- Cloudinary account (for image uploads)
- Google OAuth credentials

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Women-Safety-App.git
   cd Women-Safety-App
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your actual credentials
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your actual credentials
   npm run dev
   ```

### Environment Variables Reference
See `.env.example` files in both `backend/` and `frontend/` directories for all required variables.

⚠️ **NEVER commit `.env` files to the repository!**
```

## 🚨 Things to NEVER do:

❌ DON'T commit `.env` files
❌ DON'T hardcode API keys in source code
❌ DON'T push database credentials
❌ DON'T commit environment secrets
❌ DON'T share .env file contents publicly

## ✅ Things to ALWAYS do:

✅ Use `.env.example` as a template
✅ Add secrets to GitHub Secrets for CI/CD
✅ Keep environment variables in `.env` files (LOCAL ONLY)
✅ Review git status before pushing
✅ Rotate secrets immediately if exposed

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [npm: dotenv](https://www.npmjs.com/package/dotenv)

## 🎯 Summary

Once you've completed this checklist:
1. Create local `.env` files with your actual secrets
2. Verify `.gitignore` is working
3. Run `git status` to confirm no secrets will be pushed
4. Set up GitHub Secrets for CI/CD
5. Push safely to GitHub! 🚀

**Questions? Issues?** Double-check `.gitignore` and make sure `.env` is in it.
