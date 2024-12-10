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

:: Check for nested directory structure
if exist "%SCRIPT_DIR%steel-yield-predictor-main\package.json" (
    echo Found nested project directory
    cd "%SCRIPT_DIR%steel-yield-predictor-main"
) else (
    cd /d "%SCRIPT_DIR%"
)

:: Create a log file
set "LOG_FILE=%CD%\install_log.txt"
echo Installation started at %date% %time% > "%LOG_FILE%"
echo Working directory: %CD% >> "%LOG_FILE%"

echo Checking for package.json...
echo Checking for package.json at: %CD% >> "%LOG_FILE%"

if not exist "package.json" (
    echo ERROR: package.json not found in: %CD% >> "%LOG_FILE%"
    echo ERROR: package.json not found in current directory.
    echo Please make sure all files are properly extracted.
    echo Current directory: %CD%
    echo.
    type "%LOG_FILE%"
    pause
    exit /b 1
)

echo Found package.json >> "%LOG_FILE%"
type package.json >> "%LOG_FILE%"

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
)

:: Display Node.js version
echo Node.js version: >> "%LOG_FILE%"
node --version >> "%LOG_FILE%"

:: Clean previous installation
echo.
echo Cleaning previous installation...
if exist node_modules (
    echo Removing old node_modules...
    rd /s /q node_modules
)
if exist release (
    echo Removing old release files...
    rd /s /q release
)

echo Cleaning npm cache...
call npm cache clean --force

:: Show current directory contents
echo.
echo Directory contents: >> "%LOG_FILE%"
dir >> "%LOG_FILE%"

:: Install dependencies
echo.
echo Installing dependencies...
echo Installing dependencies... >> "%LOG_FILE%"
call npm install --verbose >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
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
    echo ERROR: Build failed
    echo Check install_log.txt for details
    type "%LOG_FILE%"
    pause
    exit /b 1
)

:: Find and run the installer
echo.
echo Searching for installer...
set "FOUND_INSTALLER=0"
for /r %%i in (*Setup*.exe) do (
    echo Found installer: %%i
    echo Found installer: %%i >> "%LOG_FILE%"
    echo Starting installer...
    start "" "%%i"
    set "FOUND_INSTALLER=1"
    goto INSTALLER_FOUND
)

:INSTALLER_CHECK
if "%FOUND_INSTALLER%"=="0" (
    echo ERROR: Could not find installer executable
    echo Contents of release directory: >> "%LOG_FILE%"
    dir /s release >> "%LOG_FILE%"
    type "%LOG_FILE%"
    pause
    exit /b 1
)

:INSTALLER_FOUND
echo.
echo Installation process completed!
echo Check install_log.txt for detailed installation log.
echo.
pause