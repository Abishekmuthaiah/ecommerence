@echo off
title Order and Cart Microservice [Port 8082]
echo ====================================================
echo Starting Order & Cart Microservice on http://localhost:8082
echo ====================================================
cd /d "%~dp0order-cart-service"
..\tools\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
pause
