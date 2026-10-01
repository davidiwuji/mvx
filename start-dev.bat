@echo off
cd /d "%~dp0"
echo Starting MVX Development Server on http://localhost:3000 ...
npx next dev -p 3000
pause
