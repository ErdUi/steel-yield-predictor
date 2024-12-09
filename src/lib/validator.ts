export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface ValidationRules {
  QC_Re?: [number, number];
  QC_Rm?: [number, number];
  QC_A?: [number, number];
  Dimension?: [number, number];
}

export const gradeRequirements: Record<string, ValidationRules> = {
  'S355': {
    QC_Re: [235, 355],
    QC_Rm: [340, 470],
    QC_A: [22, 40],
    Dimension: [0, 400]
  },
  'S690': {
    QC_Re: [690, 770],
    QC_Rm: [770, 940],
    QC_A: [14, 35],
    Dimension: [0, 150]
  }
};

export function validateInput(
  value: number,
  fieldName: string,
  grade: string
): ValidationResult {
  const requirements = gradeRequirements[grade];
  if (!requirements || !requirements[fieldName]) {
    return { isValid: true, message: '' };
  }

  const [min, max] = requirements[fieldName];
  const isValid = value >= min && value <= max;

  return {
    isValid,
    message: isValid ? '' : `Value must be between ${min} and ${max}`
  };
}