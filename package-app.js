const fs = require('fs-extra');
const archiver = require('archiver');
const path = require('path');

async function packageApp() {
  const output = fs.createWriteStream('SteelYieldPredictor.zip');
  const archive = archiver('zip');

  output.on('close', () => {
    console.log('Package created successfully!');
  });

  archive.pipe(output);

  // Add all necessary files
  const filesToInclude = [
    'install.bat',
    'setup.iss',
    'package.json',
    'electron/',
    'src/',
    'public/',
    'README.md'
  ];

  filesToInclude.forEach(file => {
    if (fs.lstatSync(file).isDirectory()) {
      archive.directory(file, file);
    } else {
      archive.file(file, { name: path.basename(file) });
    }
  });

  await archive.finalize();
}

packageApp();