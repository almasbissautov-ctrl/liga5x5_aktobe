@echo off
cd /d "%~dp0"
if exist env-local-source.txt (
  move /Y env-local-source.txt .env.local >nul
)
if exist .env.local (
  copy /Y .env.local .env >nul
)
echo ===== PHASE B START ===== > setup-log-b.txt
echo Time: %DATE% %TIME% >> setup-log-b.txt
echo. >> setup-log-b.txt

set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"

echo === prisma migrate dev --name init === >> setup-log-b.txt
call npx prisma migrate dev --name init >> setup-log-b.txt 2>&1
echo migrate exit code: %errorlevel% >> setup-log-b.txt
echo. >> setup-log-b.txt

echo === npm run db:seed === >> setup-log-b.txt
call npm run db:seed >> setup-log-b.txt 2>&1
echo seed exit code: %errorlevel% >> setup-log-b.txt
echo. >> setup-log-b.txt

echo ===== PHASE B DONE ===== >> setup-log-b.txt
