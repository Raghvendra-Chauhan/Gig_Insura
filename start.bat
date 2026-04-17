@echo off
echo =========================================
echo       Starting GigInsura Services
echo =========================================
echo.

echo [1/3] Starting ML Service (Port 8000)...
start "ML Service" cmd /k "cd ml && title ML Service && python app.py"

echo [2/3] Starting Backend Service (Port 5000)...
start "Backend Service" cmd /k "cd backend && title Backend Service && node server.js"

echo [3/3] Starting Frontend (Expo)...
start "Frontend" cmd /k "cd frontend && title Frontend Expo && npx expo start"

echo.
echo =========================================
echo   All services launched in new windows!
echo =========================================
pause
