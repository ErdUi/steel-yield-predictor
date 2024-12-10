# Steel Yield Predictor Installation Script

$host.UI.RawUI.WindowTitle = "Steel Yield Predictor Installation"

# Function to show progress bar
function Show-Progress {
    param (
        [string]$Activity,
        [int]$PercentComplete
    )
    Write-Progress -Activity $Activity -Status "$PercentComplete% Complete" -PercentComplete $PercentComplete
}

# Function to select installation directory
function Select-InstallDirectory {
    Add-Type -AssemblyName System.Windows.Forms
    $folderBrowser = New-Object System.Windows.Forms.FolderBrowserDialog
    $folderBrowser.Description = "Select Installation Directory"
    $folderBrowser.RootFolder = "MyComputer"
    
    if ($folderBrowser.ShowDialog() -eq "OK") {
        return $folderBrowser.SelectedPath
    }
    return $null
}

# Welcome message
Write-Host "`nWelcome to Steel Yield Predictor Installation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check for admin privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run this installer as Administrator" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Select installation directory
Write-Host "Please select installation directory:"
$installDir = Select-InstallDirectory
if ($null -eq $installDir) {
    Write-Host "Installation cancelled by user." -ForegroundColor Yellow
    exit
}

# Create installation directory if it doesn't exist
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
}

# Set working directory
Set-Location $installDir

# Initialize progress
Show-Progress "Checking Prerequisites" 0

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Show-Progress "Installing Node.js" 10
    Write-Host "Installing Node.js..." -ForegroundColor Yellow
    
    $nodeInstaller = "$env:TEMP\node-installer.msi"
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi" -OutFile $nodeInstaller
    Start-Process msiexec -ArgumentList "/i `"$nodeInstaller`" /qn" -Wait
    Remove-Item $nodeInstaller
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
}

Show-Progress "Cleaning previous installation" 20
Write-Host "Cleaning previous installation..." -ForegroundColor Yellow

# Clean previous installation
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "release") { Remove-Item -Recurse -Force "release" }

# Clean npm cache
Show-Progress "Cleaning npm cache" 30
npm cache clean --force

# Install dependencies
Show-Progress "Installing dependencies" 40
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install --no-audit --no-fund

# Build application
Show-Progress "Building application" 70
Write-Host "Building application..." -ForegroundColor Yellow
npm run dist

# Find and run the installer
Show-Progress "Launching installer" 90
Write-Host "Launching installer..." -ForegroundColor Yellow

$installer = Get-ChildItem -Recurse -Filter "*Setup*.exe" | Select-Object -First 1
if ($installer) {
    Start-Process -FilePath $installer.FullName
    Show-Progress "Installation Complete" 100
    Write-Host "`nInstallation process completed successfully!" -ForegroundColor Green
} else {
    Write-Host "`nError: Could not find installer executable" -ForegroundColor Red
}

Write-Host "`nPress Enter to exit..."
Read-Host