@echo off
cd /d "%~dp0"
echo ===== PHASE A START ===== > setup-log.txt
echo Time: %DATE% %TIME% >> setup-log.txt
echo. >> setup-log.txt

echo === Checking winget === >> setup-log.txt
where winget >> setup-log.txt 2>&1

echo === Installing Node.js LTS via winget === >> setup-log.txt
winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements >> setup-log.txt 2>&1
echo Node install exit code: %errorlevel% >> setup-log.txt
echo. >> setup-log.txt

set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"

echo === node -v === >> setup-log.txt
node -v >> setup-log.txt 2>&1
echo === npm -v === >> setup-log.txt
call npm -v >> setup-log.txt 2>&1
echo. >> setup-log.txt

echo === npm install (this can take a few minutes) === >> setup-log.txt
call npm install >> setup-log.txt 2>&1
echo npm install exit code: %errorlevel% >> setup-log.txt
echo. >> setup-log.txt

echo ===== PHASE A DONE ===== >> setup-log.txt
