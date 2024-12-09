export interface ValidationResult {
  isValid: boolean;
  message: string;
}

interface GradeRequirements {
  QC_Re: [number, number];
  QC_Rm: [number, number];
  QC_A: [number, number];
  Dimension: [number, number];
}

const gradeRequirements: Record<string, GradeRequirements> = {
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
  field: string,
  grade: string
): ValidationResult {
  if (isNaN(value)) {
    return {
      isValid: false,
      message: `${field} must be a number`
    };
  }

  const requirements = gradeRequirements[grade];
  if (!requirements || !requirements[field]) {
    return { isValid: true, message: '' };
  }

  const [min, max] = requirements[field];
  const isValid = value >= min && value <= max;

  return {
    isValid,
    message: isValid ? '' : `For ${grade}, ${field} must be between ${min} and ${max}`
  };
}

export function getGradeRequirements(grade: string): GradeRequirements | null {
  return gradeRequirements[grade] || null;
}