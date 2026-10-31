@echo off
title JoyStay Hostel System — Complete Suite (SQLite Database + Student App + Management App)
echo ============================================================================
echo   JOYSTAY SMART HOSTEL MANAGEMENT SYSTEM
echo   Starting:
echo     1. Shared SQLite Database ^& API Server  --^> http://localhost:4000
echo     2. Student App (Front-End Website)      --^> http://localhost:5173
echo     3. Management App (Admin ERP Website)   --^> http://localhost:5174
echo ============================================================================
echo.
cd /d "%~dp0"
if not exist "node_modules" (
    echo Installing required packages for first-time setup...
    call npm install
)
call npm run dev
pause

