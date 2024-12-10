# Steel Yield Predictor

A desktop application for predicting steel yield strength using a Random Forest model.

## Overview

This application was originally developed as a web application and has been converted to a desktop application using Electron for better performance and offline capabilities.

## Features

- Predict steel yield strength using a trained Random Forest model
- Import and process Excel files
- Visualize prediction results
- Generate detailed reports
- Work offline with local data

## Installation

1. Download the latest `SteelYieldPredictor-Setup.exe` from the releases page
2. Run the installer
3. Launch the application

## Development

### Prerequisites

- Node.js 18+
- Python 3.8+
- pip for Python package management

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ErdUi/steel-yield-predictor.git
   cd steel-yield-predictor
   ```

2. Install dependencies:
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

### Building

To create an installer:
```bash
npm run build
```

## Project Structure

```
/
├── src/                    # Source files
│   ├── main/               # Electron main process
│   │   └── main.js         # Main entry point
│   ├── renderer/           # Electron renderer process
│   │   ├── components/     # UI components
│   │   └── pages/          # Application pages
│   └── model/              # Python ML model
│       └── predictor.py    # Random Forest model
├── dist/                   # Built application
├── release/                # Release files
└── docs/                   # Documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
