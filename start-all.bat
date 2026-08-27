@echo off
title ShopZone Microservices Platform Launcher
echo ======================================================================
echo    ShopZone E-Commerce Microservices Architecture (React + Spring Boot)
echo ======================================================================
echo.
echo 1. Starting Product Microservice (Port 8081)...
start "Product Microservice [8081]" cmd /k "cd /d %~dp0product-service && ..\tools\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"

echo 2. Starting Order & Cart Microservice (Port 8082)...
start "Order and Cart Microservice [8082]" cmd /k "cd /d %~dp0order-cart-service && ..\tools\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"

echo 3. Waiting 5 seconds before launching React frontend...
timeout /t 5 /nobreak >nul

echo 4. Starting React Frontend (Port 3000)...
start "React Frontend [3000]" cmd /k "cd /d %~dp0frontend-react && npm run dev"

echo.
echo ======================================================================
echo All 3 services are launching in separate windows!
echo - Product Microservice:      http://localhost:8081/api/products
echo - Order & Cart Microservice: http://localhost:8082/api/cart/1
echo - React Frontend Web UI:     http://localhost:3000
echo ======================================================================
pause
