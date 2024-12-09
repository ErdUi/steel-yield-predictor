import * as tf from '@tensorflow/tfjs';

export interface TrainingData {
  QC_Re: number;
  QC_Rm: number;
  QC_A: number;
  Dimension: number;
  Manufacturer: string;
  Grade: string;
}

export interface Prediction {
  predictedStrength: number;
  lowerCI: number;
  upperCI: number;
  passes: boolean;
  margin: number;
}

export function getMinYieldStrength(thickness: number, grade: string): number {
  if (grade === 'S355') {
    if (thickness <= 16) return 355;
    if (thickness <= 40) return 345;
    if (thickness <= 63) return 335;
    if (thickness <= 80) return 325;
    if (thickness <= 100) return 315;
    if (thickness <= 150) return 295;
    if (thickness <= 200) return 285;
    if (thickness <= 250) return 275;
    if (thickness <= 400) return 265;
    return 265;
  } else if (grade === 'S690') {
    if (thickness <= 50) return 690;
    if (thickness <= 100) return 650;
    if (thickness <= 150) return 630;
    return 630;
  }
  return 0;
}

export function calculateEnhancedFeatures(data: TrainingData) {
  const {QC_Re, QC_Rm, QC_A, Dimension} = data;
  
  return {
    Yield_Ductility_Product: QC_Re * QC_A,
    Work_Hardening_Range: QC_Rm - QC_Re,
    Normalized_Work_Hardening: (QC_Rm - QC_Re) / QC_Re,
    Work_Hardening_Ductility: (QC_Rm - QC_Re) * QC_A,
    Ductility_Weighted_Strength: QC_Rm * Math.sqrt(QC_A),
    Quality_Index: QC_Rm + 150 * Math.log(QC_A),
    Performance_Index: QC_Re * Math.pow(QC_A, 0.333),
    Strain_Hardening_Coefficient: Math.log(QC_Rm/QC_Re) / Math.log(QC_A/100),
    Strain_Energy: (QC_Rm + QC_Re) * QC_A / 2,
    Strength_Ductility_Balance: (QC_Rm * QC_A) / QC_Re,
    Formability_Index: QC_A * Math.sqrt(QC_Rm/QC_Re),
    Thickness_Strength_Index: QC_Rm / Math.log(Dimension + 1),
    Thickness_Ductility_Ratio: QC_A / Dimension,
    Hall_Petch_Approximation: QC_Re * Math.sqrt(Dimension),
    Size_Effect_Factor: QC_Re * Math.pow(Dimension, -0.5),
    Thickness_Quality_Index: (QC_Rm + 150 * Math.log(QC_A)) / Math.log(Dimension + 1),
    Thickness_Strain_Energy: ((QC_Rm + QC_Re) * QC_A / 2) / Dimension,
    Normalized_Thickness_Strength: QC_Re / (Dimension * QC_Rm),
    Thickness_Performance_Factor: QC_Re * Math.pow(QC_A, 0.333) / Math.sqrt(Dimension),
    Surface_Volume_Strength: QC_Re * (1 / Dimension)
  };
}