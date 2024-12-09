@echo off
echo Installing Steel Yield Predictor...

REM Check if Node.js is installed
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Node.js...
    curl -o node-installer.msi https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi
    msiexec /i node-installer.msi /qn
    del node-installer.msi
)

REM Install dependencies and build
echo Installing dependencies...
npm install

echo Building application...
npm run build

echo Creating executable...
npm run package

echo Installation complete!
echo The application can be found in the dist folder.
pause