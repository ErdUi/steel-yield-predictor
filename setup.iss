[Setup]
AppName=Steel Yield Predictor
AppVersion=1.0
DefaultDirName={pf}\Steel Yield Predictor
DefaultGroupName=Steel Yield Predictor
OutputDir=installer
OutputBaseFilename=SteelYieldPredictor_Setup

[Files]
Source: "dist\win-unpacked\*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{group}\Steel Yield Predictor"; Filename: "{app}\steel-yield-predictor.exe"
Name: "{commondesktop}\Steel Yield Predictor"; Filename: "{app}\steel-yield-predictor.exe"