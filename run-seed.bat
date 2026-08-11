@echo off
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"
echo ===== SEED START ===== > seed-log.txt
call npx prisma generate >> seed-log.txt 2>&1
echo generate exit code: %errorlevel% >> seed-log.txt
call npm run db:seed >> seed-log.txt 2>&1
echo seed exit code: %errorlevel% >> seed-log.txt
echo ===== SEED DONE ===== >> seed-log.txt
