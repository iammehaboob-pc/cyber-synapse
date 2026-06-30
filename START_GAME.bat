@echo off
title Neon Memory - Game Setup & Launcher
color 0B
cls

echo ============================================
echo   NEON MEMORY - AUTO SETUP ^& LAUNCHER
echo ============================================
echo.
echo [1/4] Installing Server packages...
echo.
cd /d "c:\Users\kukan\game.ik\server"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Server npm install failed!
    pause
    exit /b 1
)
echo.
echo [2/4] Server packages installed successfully!
echo.

echo [3/4] Installing Client packages...
echo.
cd /d "c:\Users\kukan\game.ik\client"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Client npm install failed!
    pause
    exit /b 1
)
echo.
echo [4/4] Client packages installed successfully!
echo.

echo ============================================
echo   STARTING BOTH SERVERS...
echo ============================================
echo.
echo Backend  : http://localhost:5000
echo Frontend : http://localhost:3000
echo.
echo NOTE: Two terminal windows will open.
echo Close them to stop the servers.
echo.

REM Start Backend Server in new window
start "Neon Memory - BACKEND SERVER" cmd /k "cd /d c:\Users\kukan\game.ik\server && npm run dev"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak > nul

REM Start Frontend Server in new window
start "Neon Memory - FRONTEND CLIENT" cmd /k "cd /d c:\Users\kukan\game.ik\client && npm run dev"

REM Wait 5 seconds then open browser
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo.
echo ============================================
echo   GAME IS RUNNING!
echo   Open http://localhost:3000 in browser
echo ============================================
echo.
pause
