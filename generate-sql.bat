@echo off
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"
echo ===== GENERATE SQL START ===== > generate-sql-log.txt
call npx prisma migrate diff --from-empty --to-schema-datamodel prisma\schema.prisma --script > migration.sql 2> generate-sql-log.txt
echo exit code: %errorlevel% >> generate-sql-log.txt
echo ===== GENERATE SQL DONE ===== >> generate-sql-log.txt
