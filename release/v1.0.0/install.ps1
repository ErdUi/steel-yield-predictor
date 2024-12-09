$ErrorActionPreference = 'Stop'
$appName = "Steel Yield Predictor"
$installDir = "$env:LOCALAPPDATA\$appName"

try {
    # Check Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "Please install Node.js first from: https://nodejs.org"
        exit 1
    }

    # Create directory
    New-Item -ItemType Directory -Force -Path $installDir

    # Extract app
    Expand-Archive -Path "$PSScriptRoot\app.zip" -DestinationPath $installDir -Force

    # Create shortcut
    $WshShell = New-Object -comObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\$appName.lnk")
    $Shortcut.TargetPath = "$installDir\steel-yield-predictor.exe"
    $Shortcut.Save()

    Write-Host "Installation successful!"
    Start-Process "$installDir\steel-yield-predictor.exe"
} catch {
    Write-Host "Installation failed: $_"
    exit 1
}