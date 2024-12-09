@echo off
setlocal EnableDelayedExpansion

echo Installing Steel Yield Predictor...

:: Check for admin rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Please run as administrator
    pause
    exit /b 1
)

:: Create temp directory
set "TEMP_DIR=%TEMP%\SteelYieldPredictor"
mkdir "%TEMP_DIR%" 2>nul

:: Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Node.js...
    powershell -Command "& {
        $ProgressPreference = 'SilentlyContinue';
        Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi' -OutFile '%TEMP_DIR%\node.msi'
    }"
    start /wait msiexec /i "%TEMP_DIR%\node.msi" /qn
    set "PATH=%PATH%;%ProgramFiles%\nodejs"
)

:: Wait for Node.js to be available
:CHECK_NODE
where node >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 >nul
    goto CHECK_NODE
)

:: Install dependencies
call npm install --no-audit
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

:: Build application
call npm run build
if %errorlevel% neq 0 (
    echo Failed to build application
    pause
    exit /b 1
)

:: Create executable
call npm run package
if %errorlevel% neq 0 (
    echo Failed to create executable
    pause
    exit /b 1
)

:: Create desktop shortcut
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $shortcut = $ws.CreateShortcut([System.IO.Path]::Combine($ws.SpecialFolders.Item('Desktop'), 'Steel Yield Predictor.lnk')); $shortcut.TargetPath = '%~dp0dist\win-unpacked\steel-yield-predictor.exe'; $shortcut.Save()"

:: Cleanup
rd /s /q "%TEMP_DIR%" 2>nul

echo Installation complete!
echo Starting application...
start "" "%~dp0dist\win-unpacked\steel-yield-predictor.exe"

endlocal
pause