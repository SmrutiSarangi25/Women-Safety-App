# Women Safety App

## Project Abstract

This women safety web application provides real-time emergency response capabilities with location tracking, multi-channel communication (SMS and WhatsApp), and emergency contact workflows.

Status: Production-ready with deployment capabilities

## Problem Statement

Women worldwide face significant safety challenges.

- 1 in 3 women experience physical or sexual violence in their lifetime (WHO, 2021).
- 73% of women in India feel unsafe in public spaces (Thomson Reuters Foundation, 2018).
- Emergency response time is critical in crisis situations.
- Digital divide affects access to safety technology in rural areas.

This application addresses these gaps with:

- Instant emergency alerts with precise location data.
- Multi-channel communication (SMS plus WhatsApp) for reach.
- Offline resilience paths for poor-connectivity areas.
- User-friendly interface for quick emergency actions.

## Features

### Core Safety Features

- One-tap SOS button for emergency alerts with location.
- Real-time GPS tracking and sharing.
- Emergency contact management.
- Multi-channel alert delivery.
- Live location map integration.

### Advanced Features

- Emergency history and audit trail.
- End-to-end security protections.
- Offline-capable emergency workflows.
- AI chat safety assistant and analytics.
- Voice input and optional voice response support.

### User Experience

- Multi-language support (English, Odia, Hindi).
- Responsive design for desktop and mobile.
- Accessibility-aware interactions.

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Hook Form
- Axios
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- JWT
- Twilio
- Cloudinary

### Deployment

- Railway (backend)
- Vercel (frontend)
- MongoDB Atlas (database)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Twilio account (optional for SMS)
- Google Maps API key
- Cloudinary account

### 1. Clone Repository

```bash
git clone <repository-url>
cd women-safety-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create backend `.env`:

```env
PORT=8000
MONGO_URI=mongodb+srv://your_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+14155238886

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
SMTP_FROM_ADDRESS="Women Safety <your_email@gmail.com>"

OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4o-mini
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create frontend `.env`:

```env
VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

### 4. Run Application

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Deployment Guide

### Backend (Railway)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Frontend (Vercel)

```bash
npm install -g vercel
cd frontend
vercel --prod
```

## Testing Guide

### Manual Checklist

- User registration and login
- Emergency contact add and delete
- Contact photo upload
- Location permission and SOS flow
- Alert history visibility

### API Quick Check

```bash
curl http://localhost:8000/api/health
```

## Latest Updates

### Critical Fixes Applied

- Backend controller and auth fixes.
- Token cookie consistency updates.
- SOS route and model improvements.
- Frontend form state and validation fixes.

### Architecture

- User access interface for SOS and contact management.
- Admin access interface for monitoring and controls.

### Status

Production ready.

## Future Scope

### Phase 1

- Geofencing-based automatic alerts.
- Voice activation commands.
- Wearable integration.

### Phase 2

- ML risk scoring and pattern detection.
- Community-level safety analytics.

### Phase 3

- Offline maps.
- Expanded emergency service integrations.

## License

This project is licensed under the MIT License.

## Contact

Project Developer: Smruti Priyadarshani Sarangi

Email: smrutisarangi1234@gmail.com
