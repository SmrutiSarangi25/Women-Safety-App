# Women Safety App - Quick Setup Guide
# =====================================

echo "🚀 Women Safety App - Setup Verification"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

echo ""
echo "🔧 Configuration Check..."
echo ""

# Check backend .env
if [ -f "../backend/.env" ]; then
    echo "✅ Backend .env file exists"

    # Check for required environment variables
    if grep -q "CLOUDINARY_CLOUD_NAME=your_cloudinary" "../backend/.env"; then
        echo "⚠️  Cloudinary credentials need to be configured"
        echo "   Get credentials from: https://cloudinary.com"
    else
        echo "✅ Cloudinary credentials configured"
    fi

    if grep -q "TWILIO_ACCOUNT_SID=YOUR_TWILIO" "../backend/.env"; then
        echo "⚠️  Twilio credentials need to be configured"
        echo "   Get credentials from: https://twilio.com"
    else
        echo "✅ Twilio credentials configured"
    fi
else
    echo "❌ Backend .env file missing"
fi

# Check frontend .env
if [ -f ".env" ]; then
    echo "✅ Frontend .env file exists"

    if grep -q "VITE_GOOGLE_MAPS_KEY=your_google" ".env"; then
        echo "⚠️  Google Maps API key needs to be configured"
        echo "   Get API key from: https://console.cloud.google.com"
    else
        echo "✅ Google Maps API key configured"
    fi
else
    echo "❌ Frontend .env file missing"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Configure Cloudinary credentials in backend/.env"
echo "2. Configure Twilio credentials in backend/.env"
echo "3. Configure Google Maps API key in frontend/.env"
echo "4. Run the application:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "📖 For detailed setup instructions, see README.md"
echo ""
echo "🚨 Women Safety App Setup Complete!"