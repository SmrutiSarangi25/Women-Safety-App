# 🚀 Women Safety App - Startup Quick Start Guide

## Phase 1: MVP Development (Current)

### What's Ready Now ✅
- **Email/Password Authentication** 
- **Database with Sample Data**
- **Core Features**: Emergency Contacts, SOS Alerts, Location Sharing, Reviews
- **Admin Dashboard**
- **Real-time Features**: Location Tracking, Map Integration

### What's Planned 📋
- Google OAuth (Phase 2)
- Google Maps Integration (Phase 2)
- Advanced Analytics (Phase 3)
- Push Notifications Enhancement (Phase 3)

---

## Quick Start (2 minutes)

### 1. Start the Servers
Both backend and frontend are already running on ports 8000 and 5173.

### 2. Access the App
- **App URL**: http://localhost:5173
- **API**: http://localhost:8000

### 3. Test User Credentials

**👤 Test Account 1: Sarah Jane**
- Email: `sarah@demo.com`
- Password: `Demo@123456`
- Pre-configured emergency contacts & location history

**👤 Test Account 2: Priya Sharma**
- Email: `priya@demo.com`
- Password: `Demo@123456`

**👨‍💼 Admin Account**
- Email: `admin@demo.com`
- Password: `Admin@123456`
- Dashboard: http://localhost:5173/admin

---

## Authentication Flow (MVP Version)

### Current (Phase 1)
```
Email/Password → Backend Validation → JWT Token → Session
```

### Coming (Phase 2)
```
Email/Password OR Google OAuth → Backend Validation → JWT Token → Session
```

**Why we skipped Google OAuth for now:**
- Reduces startup complexity
- Google doesn't allow OAuth for localhost apps in production
- Email/password auth is production-ready immediately
- Google could be added in 1-2 hours when deploying to production

---

## Project Structure

```
women-safety-app/
├── backend/              # Express API Server
│   ├── Controllers/      # Business logic
│   ├── Models/          # MongoDB schemas
│   ├── Routes/          # API endpoints
│   └── Middlewares/     # Auth, validation
├── frontend/            # React + Vite
│   ├── Components/      # UI Components
│   ├── Context/         # State management
│   ├── API/             # API client config
│   └── src/             # Main app code
└── README.md           # Full documentation
```

---

## Common Development Tasks

### Add a New Feature
1. Create backend API endpoint in `backend/Routes/`
2. Create controller in `backend/Controllers/`
3. Create React component in `frontend/src/Components/`
4. Connect with API client in `frontend/API/Config.js`

### Add a Database Field
1. Update model in `backend/Models/`
2. Update form in frontend component
3. Restart backend: `npm run dev` in backend folder

### Test Admin Features
- Login as admin: `admin@demo.com` / `Admin@123456`
- Go to: http://localhost:5173/admin

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=          # Leave blank for Phase 1
VITE_GOOGLE_MAPS_KEY=           # Can be added later
```

### Backend (.env)
```
MONGO_URI=mongodb://your_connection_string
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## Phase Roadmap

### ✅ Phase 1: MVP Core (NOW)
- Basic authentication
- Emergency contacts management
- SOS alert system
- Real-time location sharing
- User profiles
- Reviews system

### 📋 Phase 2: Enhanced Authentication (Week 2)
- Google OAuth integration
- Two-factor authentication
- Social login improvements

### 📋 Phase 3: Advanced Features (Week 3)
- Push notifications
- AI-powered safety tips
- Community forums
- Advanced analytics
- Cloud backup

### 📋 Phase 4: Production Ready (Week 4)
- Security audit
- Performance optimization
- Deployment to cloud
- Mobile app (React Native)

---

## Troubleshooting

### "Cannot find localhost:5173"
- Check if Vite dev server is running
- Run: `cd frontend && npm run dev`

### "Cannot connect to database"
- Check MongoDB is running
- Update MONGO_URI in .env

### "Google Sign-in still showing error"
- That's expected in Phase 1! Use email/password instead
- We'll add real Google OAuth in Phase 2

### Tests failing
- Clear node_modules: `rm -rf node_modules && npm install`
- Restart servers
- Check MongoDB connection

---

## Next Steps for Team

1. **Familiarize yourself** with test accounts and features
2. **Create feature branches**: `git checkout -b feature/your-feature`
3. **Work on Phase 2 items** from the roadmap
4. **Test before committing** with provided test accounts
5. **Document changes** in commit messages

---

## Support

- Issues in backend? Check `/backend/.env` and MongoDB connection
- Frontend UI issues? Check browser DevTools (F12)
- Need database help? Use `backend/view_database.js` to inspect data

---

**Remember: We're building an MVP first. Features can be added incrementally!** 🚀

Last updated: March 29, 2026
