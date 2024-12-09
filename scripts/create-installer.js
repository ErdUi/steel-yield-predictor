const electronInstaller = require('electron-winstaller');
const path = require('path');

async function createInstaller() {
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: path.join('dist', 'win-unpacked'),
      outputDirectory: path.join('dist', 'installer'),
      authors: 'Your Organization',
      exe: 'steel-yield-predictor.exe',
      setupIcon: path.join('public', 'icon.ico'),
      loadingGif: path.join('public', 'installer.gif')
    });
    console.log('Installer created successfully!');
  } catch (e) {
    console.log(`Error creating installer: ${e.message}`);
  }
}