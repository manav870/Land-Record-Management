@echo off
setlocal enabledelayedexpansion

REM ==============================================================================
REM Land Record Management - Quick Start Helper
REM This script checks prerequisites, installs dependencies (if needed),
REM and opens the three terminals required to run the project.
REM ==============================================================================

REM Remember the directory that contains this script.
set "PROJECT_ROOT=%~dp0"
REM Remove trailing backslash for consistency when needed.
if "%PROJECT_ROOT:~-1%"=="\" set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"

pushd "%PROJECT_ROOT%"

REM ------------------------------------------------------------------------------
REM 1. Prerequisite checks
REM ------------------------------------------------------------------------------
where node >NUL 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js was not found on this machine.
    echo         Please install Node.js v18 or later from https://nodejs.org/
    echo         Then rerun run.bat.
    echo.
    pause
    goto :end
)

where npm >NUL 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] npm was not found on this machine.
    echo         npm is included with the Node.js installer.
    echo         Install Node.js v18+ from https://nodejs.org/ and rerun this script.
    echo.
    pause
    goto :end
)

echo [OK] Node.js and npm detected.

echo.
echo ------------------------------------------------------------------------------
echo Installing project dependencies (if needed)...
echo ------------------------------------------------------------------------------

REM ------------------------------------------------------------------------------
REM 2. Backend dependencies (Hardhat)
REM ------------------------------------------------------------------------------
if exist "%PROJECT_ROOT%\node_modules\hardhat" (
    echo [SKIP] Backend dependencies already installed.
) else (
    echo [INFO] Installing backend dependencies in %PROJECT_ROOT% ...
    call npm install || goto :dep_fail
)

REM ------------------------------------------------------------------------------
REM 3. Frontend dependencies (React app)
REM ------------------------------------------------------------------------------
if exist "%PROJECT_ROOT%\frontend\node_modules\react" (
    echo [SKIP] Frontend dependencies already installed.
) else (
    echo [INFO] Installing frontend dependencies in %PROJECT_ROOT%\frontend ...
    call npm install --prefix frontend || goto :dep_fail
)

echo.
echo ------------------------------------------------------------------------------
echo Launching project terminals...
echo ------------------------------------------------------------------------------

echo [INFO] Terminal 1: Hardhat node
start "" cmd /k "cd /d ^"%PROJECT_ROOT%^" && npm run node"

echo [INFO] Waiting 5 seconds to allow the Hardhat node to start...
timeout /t 5 >NUL

echo [INFO] Terminal 2: Deploy smart contract
start "" cmd /k "cd /d ^"%PROJECT_ROOT%^" && npm run deploy && echo. && echo Deployment complete. Copy the contract address above and update frontend\src\utils\contract.js if necessary. && echo Press any key to close this window. && pause"

echo [INFO] Terminal 3: React frontend
start "" cmd /k "cd /d ^"%PROJECT_ROOT%\frontend^" && npm start"

echo.
echo ==============================================================================
echo All terminals launched!
echo 1) Keep the Hardhat node window open.
echo 2) After deployment finishes, copy the contract address if it differs from the existing one in frontend\src\utils\contract.js.
echo 3) The React app is available at http://localhost:3000 once it finishes compiling.
echo ------------------------------------------------------------------------------
echo If MetaMask is not configured on this machine:
echo  - Add the Hardhat Local network (RPC: http://127.0.0.1:8545, Chain ID: 1337).
echo  - Import one of the private keys shown in the Hardhat node window.
echo ============================================================================== 

echo.
echo Press any key to exit this helper window. Leave the spawned terminals open.
pause >NUL

goto :end

:dep_fail
echo.
echo [ERROR] An npm command failed. Review the errors above, fix them, and rerun run.bat.
echo.
pause

:end
popd
exit /b
