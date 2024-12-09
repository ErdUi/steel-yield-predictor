@echo off
powershell Compress-Archive -Path ../* -DestinationPath SteelYieldPredictor.zip
echo Package created: SteelYieldPredictor.zip