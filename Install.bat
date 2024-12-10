@echo off
echo Installing Steel Yield Predictor...

:: Check if Node.js is installed
node --version > nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Downloading and installing Node.js...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi' -OutFile 'node-installer.msi'}"
    start /wait msiexec /i node-installer.msi /qn
    del node-installer.msi
)

:: Install dependencies and build
echo Installing dependencies...
npm install

echo Building application...
npm run dist

:: Find and run the installer
for /r %%i in (*Setup*.exe) do (
    echo Running installer: %%i
    start "" "%%i"
    exit
)
