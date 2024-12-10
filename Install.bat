@echo off
echo Installing dependencies...
npm cache clean --force
npm install
echo Installation complete!
echo Running the application...
start start.bat
