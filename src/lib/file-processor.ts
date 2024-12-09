import Papa from 'papaparse';
import { ModelInput } from './model';

export interface ProcessedFile {
  data: ModelInput[];
  errors: string[];
}

export async function processCSV(file: File): Promise<ProcessedFile> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: ModelInput[] = [];
        const errors: string[] = [];

        results.data.forEach((row: any, index: number) => {
          try {
            const input: ModelInput = {
              QC_Re: Number(row.QC_Re),
              QC_Rm: Number(row.QC_Rm),
              QC_A: Number(row.QC_A),
              Dimension: Number(row.Dimension),
              Manufacturer: row.Manufacturer,
              Grade: row.Grade
            };

            if (Object.values(input).some(isNaN)) {
              throw new Error('Invalid numeric value');
            }

            data.push(input);
          } catch (err) {
            errors.push(`Row ${index + 1}: ${err.message}`);
          }
        });

        resolve({ data, errors });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
}

export async function processExcel(file: ArrayBuffer): Promise<ProcessedFile> {
  // Implementation for Excel processing would go here
  throw new Error('Excel processing not implemented yet');
}