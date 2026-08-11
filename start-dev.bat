@echo off
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"
echo ===== DEV SERVER START ===== > dev-log.txt
echo Time: %DATE% %TIME% >> dev-log.txt
call npm run dev >> dev-log.txt 2>&1
