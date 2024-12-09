@echo off
echo Installing Steel Yield Predictor...

REM Check for Node.js
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Node.js...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi' -OutFile 'node-installer.msi'"
    msiexec /i node-installer.msi /qn
    del node-installer.msi
)

REM Install dependencies
npm install

REM Build application
npm run build

REM Create executable
npm run package

echo Installation complete!
start "" "%~dp0dist\win-unpacked\steel-yield-predictor.exe"
pause