# Steel Yield Strength Predictor

A Windows application for predicting steel yield strength using Random Forest model.

## Features

- Real-time yield strength prediction
- Support for S355 and S690 steel grades
- Confidence interval visualization
- Material requirement validation
- Excel file processing support

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Usage

1. Enter material parameters (QC_Re, QC_Rm, QC_A)
2. Select manufacturer
3. Input dimension
4. Click predict to get results

## Technology Stack

- Next.js
- React
- TensorFlow.js
- Recharts
- Tailwind CSS