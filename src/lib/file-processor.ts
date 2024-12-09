import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ModelInput } from './model';

export interface ProcessedFile {
  data: ModelInput[];
  errors: string[];
}

function validateRow(row: any, index: number): ModelInput {
  const numericFields = ['QC_Re', 'QC_Rm', 'QC_A', 'Dimension'];
  const input: any = {};

  for (const field of numericFields) {
    const value = Number(row[field]);
    if (isNaN(value)) {
      throw new Error(`Invalid ${field} value`);
    }
    input[field] = value;
  }

  if (!row.Manufacturer) {
    throw new Error('Missing Manufacturer');
  }
  input.Manufacturer = row.Manufacturer;

  if (!row.Grade || !['S355', 'S690'].includes(row.Grade)) {
    throw new Error('Invalid Grade (must be S355 or S690)');
  }
  input.Grade = row.Grade;

  return input as ModelInput;
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
            data.push(validateRow(row, index));
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

export async function processExcel(file: File): Promise<ProcessedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data: ModelInput[] = [];
        const errors: string[] = [];

        const workbook = XLSX.read(e.target?.result, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet);

        rows.forEach((row: any, index: number) => {
          try {
            data.push(validateRow(row, index));
          } catch (err) {
            errors.push(`Row ${index + 1}: ${err.message}`);
          }
        });

        resolve({ data, errors });
      } catch (err) {
        reject(new Error(`Failed to parse Excel file: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };

    reader.readAsArrayBuffer(file);
  });
}