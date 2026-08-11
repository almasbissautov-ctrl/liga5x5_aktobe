@echo off
cd /d "%~dp0"
echo Running test application cleanup...
node cleanup-test-application.js
echo.
echo Done. Press any key to close.
pause >nul
