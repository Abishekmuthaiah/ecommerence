@echo off
title ShopZone React Frontend [Port 3000]
echo ====================================================
echo Starting React Frontend on http://localhost:3000
echo ====================================================
cd /d "%~dp0frontend-react"
cmd.exe /c npm run dev
pause
