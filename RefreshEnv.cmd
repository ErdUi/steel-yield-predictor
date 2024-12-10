@echo off
echo Refreshing environment variables...

:: Get System and User PATH values separately
for /f "usebackq delims=" %%A in (`reg query "HKLM\System\CurrentControlSet\Control\Session Manager\Environment" /v PATH`) do @set SysPath=%%A
for /f "usebackq delims=" %%A in (`reg query "HKCU\Environment" /v PATH`) do @set UserPath=%%A

:: Extract the data portion of the values
set SysPath=%SysPath:~22%
set UserPath=%UserPath:~22%

:: Combine System and User PATH values
set "PATH=%SysPath%;%UserPath%"

echo Environment variables refreshed
