# Steel Yield Predictor Setup
$ErrorActionPreference = 'Stop'

# Configuration
$appName = "Steel Yield Predictor"
$installDir = "$env:LOCALAPPDATA\$appName"

# Create install directory
New-Item -ItemType Directory -Force -Path $installDir

# Extract application files
Expand-Archive -Path "$PSScriptRoot\app.zip" -DestinationPath $installDir -Force

# Create shortcut
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\$appName.lnk")
$Shortcut.TargetPath = "$installDir\steel-yield-predictor.exe"
$Shortcut.Save()

# Start application
Start-Process "$installDir\steel-yield-predictor.exe"
