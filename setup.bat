@echo off
echo 🚀 Women Safety App - Setup Verification
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%

echo.
echo 📦 Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    cd ..
    pause
    exit /b 1
)

echo.
echo 📦 Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    cd ..
    pause
    exit /b 1
)

echo.
echo 🔧 Configuration Check...
echo.

REM Check backend .env
if exist "../backend/.env" (
    echo ✅ Backend .env file exists

    findstr /C:"CLOUDINARY_CLOUD_NAME=your_cloudinary" "../backend/.env" >nul
    if %errorlevel% equ 0 (
        echo ⚠️  Cloudinary credentials need to be configured
        echo    Get credentials from: https://cloudinary.com
    ) else (
        echo ✅ Cloudinary credentials configured
    )

    findstr /C:"TWILIO_ACCOUNT_SID=YOUR_TWILIO" "../backend/.env" >nul
    if %errorlevel% equ 0 (
        echo ⚠️  Twilio credentials need to be configured
        echo    Get credentials from: https://twilio.com
    ) else (
        echo ✅ Twilio credentials configured
    )
) else (
    echo ❌ Backend .env file missing
)

REM Check frontend .env
if exist ".env" (
    echo ✅ Frontend .env file exists

    findstr /C:"VITE_GOOGLE_MAPS_KEY=your_google" ".env" >nul
    if %errorlevel% equ 0 (
        echo ⚠️  Google Maps API key needs to be configured
        echo    Get API key from: https://console.cloud.google.com
    ) else (
        echo ✅ Google Maps API key configured
    )
) else (
    echo ❌ Frontend .env file missing
)

cd ..
echo.
echo 🎯 Next Steps:
echo 1. Configure Cloudinary credentials in backend/.env
echo 2. Configure Twilio credentials in backend/.env
echo 3. Configure Google Maps API key in frontend/.env
echo 4. Run the application:
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: cd frontend ^&^& npm run dev
echo.
echo 📖 For detailed setup instructions, see README.md
echo.
echo 🚨 Women Safety App Setup Complete!
pause