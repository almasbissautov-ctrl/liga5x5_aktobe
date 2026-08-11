@echo off
cd /d "%~dp0"
echo ===== SYNC START ===== > sync-log.txt
echo Time: %DATE% %TIME% >> sync-log.txt
tar -xf liga5x5-aktobe-sync.zip >> sync-log.txt 2>&1
echo tar exit code: %errorlevel% >> sync-log.txt
del liga5x5-aktobe-sync.zip
echo ===== SYNC DONE ===== >> sync-log.txt
