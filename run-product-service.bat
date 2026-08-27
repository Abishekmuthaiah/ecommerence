@echo off
title Product Microservice [Port 8081]
echo ====================================================
echo Starting Product Microservice on http://localhost:8081
echo ====================================================
cd /d "%~dp0product-service"
..\tools\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
pause
