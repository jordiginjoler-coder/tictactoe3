@echo off
REM ============================================================
REM Feature Deployment Script - Windows Batch
REM Requirements: Port conflict resolution, health checks, verified URLs
REM ============================================================

setlocal enabledelayedexpansion

REM Configuration
set CHANGE_NAME=%~1
set ENVIRONMENT=%~2
set IMAGE_TAG=%~3

if "%CHANGE_NAME%"=="" (
    echo ERROR: Usage: deploy-feature.bat ^<change_name^> ^<staging^|production^> ^<image_tag^>
    exit /b 1
)

if "%ENVIRONMENT%"=="" set ENVIRONMENT=staging
if "%IMAGE_TAG%"=="" set IMAGE_TAG=latest

echo ============================================================
echo DEPLOYING FEATURE: %CHANGE_NAME%
echo Environment: %ENVIRONMENT%
echo Image: %IMAGE_TAG%
echo ============================================================

REM ------------------------------------------------------------
REM Step 1: Pre-flight checks
REM ------------------------------------------------------------
echo [1/6] Pre-flight validation...

if not exist "openspec\changes\%CHANGE_NAME%\archive.md" (
    echo ERROR: Change %CHANGE_NAME% not archived (missing archive.md)
    exit /b 1
)

echo ✅ Change %CHANGE_NAME% is archived

REM Check if Docker is available
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker not available
    exit /b 1
)
echo ✅ Docker available

REM ------------------------------------------------------------
REM Step 2: Port conflict resolution
REM ------------------------------------------------------------
echo [2/6] Resolving port conflicts...

set BASE_PORT=3000
set PORT=%BASE_PORT%

:PORT_LOOP
netstat -ano | findstr ":%PORT% " >nul
if %errorlevel% equ 0 (
    echo Port %PORT% in use, trying next...
    set /a PORT=%PORT%+1
    if %PORT% gtr 3100 (
        echo ERROR: No available ports in range 3000-3100
        exit /b 1
    )
    goto PORT_LOOP
)

echo ✅ Port %PORT% available

REM ------------------------------------------------------------
REM Step 3: Pull and start container
REM ------------------------------------------------------------
echo [3/6] Starting container on port %PORT%...

docker pull %IMAGE_TAG% >nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to pull image %IMAGE_TAG%
    exit /b 1
)

REM Stop existing container on this port if any
for /f "tokens=1" %%i in ('docker ps -q --filter "publish=%PORT%"') do (
    echo Stopping existing container on port %PORT%...
    docker stop %%i >nul
    docker rm %%i >nul
)

REM Start new container
set CONTAINER_NAME=feature-%CHANGE_NAME%-%PORT%
docker run -d ^
    --name %CONTAINER_NAME% ^
    -p %PORT%:3000 ^
    -e NODE_ENV=production ^
    -e PORT=3000 ^
    %IMAGE_TAG% >nul

if %errorlevel% neq 0 (
    echo ERROR: Failed to start container
    exit /b 1
)

echo ✅ Container %CONTAINER_NAME% started on port %PORT%

REM ------------------------------------------------------------
REM Step 4: Health checks with retries
REM ------------------------------------------------------------
echo [4/6] Running health checks...

set MAX_RETRIES=30
set RETRY=0
set HEALTHY=0

:HEALTH_LOOP
set /a RETRY=%RETRY%+1
echo Waiting for health check... (Attempt %RETRY%/%MAX_RETRIES%)

curl -sf http://localhost:%PORT%/health >nul 2>&1
if %errorlevel% equ 0 (
    set HEALTHY=1
    goto HEALTH_DONE
)

if %RETRY% geq %MAX_RETRIES% (
    goto HEALTH_DONE
)

timeout /t 2 /nobreak >nul
goto HEALTH_LOOP

:HEALTH_DONE
if %HEALTHY% equ 0 (
    echo ❌ Health check FAILED after %MAX_RETRIES% attempts
    echo Stopping container...
    docker stop %CONTAINER_NAME% >nul
    docker rm %CONTAINER_NAME% >nul
    exit /b 1
)

echo ✅ Health check PASSED

REM ------------------------------------------------------------
REM Step 5: Verify all endpoints
REM ------------------------------------------------------------
echo [5/6] Verifying endpoints...

set ENDPOINTS=/health /api/v1/candidates /api/v1/positions /api/v1/interviews
set ALL_OK=1

for %%e in (%ENDPOINTS%) do (
    echo Checking http://localhost:%PORT%%%e ...
    curl -sf http://localhost:%PORT%%%e >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Verified: http://localhost:%PORT%%%e
    ) else (
        echo ❌ FAILED: http://localhost:%PORT%%%e
        set ALL_OK=0
    )
)

if %ALL_OK% equ 0 (
    echo ❌ Some endpoints failed verification
    echo Stopping container...
    docker stop %CONTAINER_NAME% >nul
    docker rm %CONTAINER_NAME% >nul
    exit /b 1
)

echo ✅ All endpoints verified

REM ------------------------------------------------------------
REM Step 6: Update deployment record
REM ------------------------------------------------------------
echo [6/6] Updating deployment record...

set DEPLOY_URL=http://localhost:%PORT%
echo DEPLOY_URL=%DEPLOY_URL%

REM Update archive.md with deployment info
set ARCHIVE_FILE=openspec\changes\%CHANGE_NAME%\archive.md
if exist "%ARCHIVE_FILE%" (
    echo. >> "%ARCHIVE_FILE%"
    echo ## Production Deployment >> "%ARCHIVE_FILE%"
    echo - **Date:** %DATE% %TIME% >> "%ARCHIVE_FILE%"
    echo - **Environment:** %ENVIRONMENT% >> "%ARCHIVE_FILE%"
    echo - **URL:** %DEPLOY_URL% >> "%ARCHIVE_FILE%"
    echo - **Image:** %IMAGE_TAG% >> "%ARCHIVE_FILE%"
    echo - **Container:** %CONTAINER_NAME% >> "%ARCHIVE_FILE%"
    echo - **Port:** %PORT% >> "%ARCHIVE_FILE%"
)

REM Save port for rollback
echo %PORT% > .current_port

echo ============================================================
echo 🎉 DEPLOYMENT SUCCESSFUL
echo ============================================================
echo Change: %CHANGE_NAME%
echo Environment: %ENVIRONMENT%
echo URL: %DEPLOY_URL%
echo Container: %CONTAINER_NAME%
echo Port: %PORT%
echo Image: %IMAGE_TAG%
echo ============================================================

REM Output for CI/CD integration
echo ::set-output name=deploy_url::%DEPLOY_URL%
echo ::set-output name=container::%CONTAINER_NAME%
echo ::set-output name=port::%PORT%

endlocal
exit /b 0