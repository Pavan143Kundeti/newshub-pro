@echo off
echo 🚀 NewsHub Pro - Deployment Script
echo =================================

echo.
echo Choose your deployment method:
echo 1. Netlify (Drag & Drop)
echo 2. Vercel (CLI)
echo 3. GitHub Pages
echo 4. Build Only
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto netlify
if "%choice%"=="2" goto vercel
if "%choice%"=="3" goto github
if "%choice%"=="4" goto build
goto invalid

:netlify
echo.
echo 🌐 Netlify Deployment:
echo 1. Go to https://netlify.com
echo 2. Sign up/Login with GitHub
echo 3. Drag your 'build' folder to the deploy area
echo 4. Your site will be live instantly!
echo.
echo Opening Netlify...
start https://netlify.com
goto end

:vercel
echo.
echo ⚡ Vercel Deployment:
echo Deploying with Vercel CLI...
vercel
goto end

:github
echo.
echo 📚 GitHub Pages Deployment:
echo Deploying to GitHub Pages...
npm run deploy
goto end

:build
echo.
echo 🔨 Building for production...
npm run build
echo Build completed! Check the 'build' folder.
goto end

:invalid
echo Invalid choice! Please run the script again.
pause

:end
echo.
echo Deployment process completed!
pause 