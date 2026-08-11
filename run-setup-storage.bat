@echo off
cd /d "%~dp0"
echo Setting up Supabase Storage bucket...
node setup-storage.js
echo.
echo Done. Press any key to close.
pause >nul
