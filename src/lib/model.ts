export interface ModelInput {
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