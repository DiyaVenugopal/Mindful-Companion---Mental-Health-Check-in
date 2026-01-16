@echo off
title Mindful Companion Server
color 0A
echo ========================================
echo   Mindful Companion - Starting Server
echo ========================================
echo.
echo Server will start on: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "start-server.ps1"

pause
