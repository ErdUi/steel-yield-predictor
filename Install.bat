@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo     Steel Yield Predictor Installer
echo ==========================================
echo.

:: Enable error output
set "DEBUG=electron-builder"

:: Get the directory where the batch file is located
set "SCRIPT_DIR=%~dp0"
echo Installation directory: %SCRIPT_DIR%

:: Change to the script directory
cd /d "%SCRIPT_DIR%"

:: Create a log file
set "LOG_FILE=%SCRIPT_DIR%\install_log.txt"
echo Installation started at %date% %time% > "%LOG_FILE%"

echo Checking for package.json...
echo Checking for package.json... >> "%LOG_FILE%"

if not exist "package.json" (
    echo ERROR: package.json not found in: %CD% >> "%LOG_FILE%"
    echo ERROR: package.json not found in current directory.
    echo Please make sure all files are extracted from the zip file.
    echo.
    type "%LOG_FILE%"
    pause
    exit /b 1
)

echo Checking Node.js installation...
echo Checking Node.js installation... >> "%LOG_FILE%"

:: Check if Node.js is installed
node --version > nul 2>&1
if errorlevel 1 (
    echo Installing Node.js... >> "%LOG_FILE%"
    echo Installing Node.js...
    echo This may take a few minutes...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi' -OutFile 'node-installer.msi'}"
    if errorlevel 1 (
        echo ERROR: Failed to download Node.js installer >> "%LOG_FILE%"
        echo ERROR: Failed to download Node.js installer
        type "%LOG_FILE%"
        pause
        exit /b 1
    )

    echo Running Node.js installer... >> "%LOG_FILE%"
    start /wait msiexec /i node-installer.msi /qn
    if errorlevel 1 (
        echo ERROR: Node.js installation failed >> "%LOG_FILE%"
        echo ERROR: Node.js installation failed
        type "%LOG_FILE%"
        pause
        exit /b 1
    )
    del node-installer.msi
    
    echo Node.js installed successfully >> "%LOG_FILE%"
    echo Node.js installed successfully
    
    :: Refresh environment variables
    echo Refreshing environment variables... >> "%LOG_FILE%"
    call RefreshEnv.cmd
)

:: Clean previous installation
echo.
echo Cleaning previous installation...
echo Cleaning previous installation... >> "%LOG_FILE%"

if exist node_modules (
    echo Removing old node_modules... >> "%LOG_FILE%"
    rd /s /q node_modules
)
if exist release (
    echo Removing old release files... >> "%LOG_FILE%"
    rd /s /q release
)

echo Cleaning npm cache... >> "%LOG_FILE%"
echo Cleaning npm cache...
call npm cache clean --force

:: Show current directory and contents for debugging
echo Current directory: %CD% >> "%LOG_FILE%"
dir >> "%LOG_FILE%"

:: Install dependencies
echo.
echo Installing dependencies...
echo Installing dependencies... >> "%LOG_FILE%"
echo This may take several minutes...

call npm install --no-audit --no-fund >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install dependencies >> "%LOG_FILE%"
    echo ERROR: Failed to install dependencies
    echo Check install_log.txt for details
    type "%LOG_FILE%"
    pause
    exit /b 1
)

:: Build application
echo.
echo Building application...
echo Building application... >> "%LOG_FILE%"

call npm run build >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo ERROR: Build failed >> "%LOG_FILE%"
    echo ERROR: Build failed
    echo Check install_log.txt for details
    type "%LOG_FILE%"
    pause
    exit /b 1
)

:: Find and run the installer
echo.
echo Searching for installer...
echo Searching for installer... >> "%LOG_FILE%"

set "FOUND_INSTALLER=0"
for /r %%i in (*Setup*.exe) do (
    echo Found installer: %%i >> "%LOG_FILE%"
    echo Found installer: %%i
    echo Starting installer...
    start "" "%%i"
    set "FOUND_INSTALLER=1"
    goto INSTALLER_FOUND
)

:INSTALLER_CHECK
if "%FOUND_INSTALLER%"=="0" (
    echo ERROR: Could not find installer executable >> "%LOG_FILE%"
    echo ERROR: Could not find installer executable
    echo Please check install_log.txt for details
    type "%LOG_FILE%"
    pause
    exit /b 1
)

:INSTALLER_FOUND
echo.
echo Installation process completed successfully! >> "%LOG_FILE%"
echo Installation process completed successfully!
echo The installer should now be running.
echo If the installer didn't start, please check the release folder.
echo.
echo Full installation log is available in install_log.txt
echo.
pause