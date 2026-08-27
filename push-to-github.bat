@echo off
title Push to GitHub - ShopZone
echo ======================================================================
echo    Pushing ShopZone Project to GitHub
echo ======================================================================
echo.
cd /d "%~dp0"
echo 1. Checking git status...
git status
echo.
echo 2. Pushing main branch to origin...
git push -u origin main
echo.
echo ======================================================================
if %ERRORLEVEL% EQU 0 (
    echo Successfully pushed to GitHub!
) else (
    echo Push encountered an error or requires GitHub authentication.
)
echo ======================================================================
pause
