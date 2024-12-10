@echo off
setlocal enabledelayedexpansion

:: Get the directory where the batch file is located
set "SCRIPT_DIR=%~dp0"

:: Change to the script directory
cd /d "%SCRIPT_DIR%"

echo Checking for package.json...
if not exist "package.json" (
    echo Error: package.json not found in current directory.
    echo Please make sure you're running this script from the project root directory.
    pause
    exit /b 1
)

echo Installing Steel Yield Predictor...

:: Clean npm cache and remove existing node_modules
echo Cleaning previous installation...
rd /s /q node_modules 2>nul
rd /s /q release 2>nul
npm cache clean --force

:: Check if Node.js is installed
node --version > nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Downloading and installing Node.js...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi' -OutFile 'node-installer.msi'}"
    start /wait msiexec /i node-installer.msi /qn
    del node-installer.msi
    
    :: Refresh environment variables
    call RefreshEnv.cmd
)

:: Install dependencies
echo Installing dependencies...
npm install --no-audit --no-fund

:: Build application
echo Building application...
call npm run build
if errorlevel 1 (
    echo Error: Build failed
    pause
    exit /b 1
)

:: Find and run the installer
for /r %%i in (*Setup*.exe) do (
    echo Running installer: %%i
    start "" "%%i"
    exit /b 0
)

echo Error: Could not find installer executable.
pause
exit /b 1