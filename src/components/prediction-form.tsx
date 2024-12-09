import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ManufacturerCombobox } from "./manufacturer-combobox";
import { ParameterInput } from "./parameter-input";
import { usePrediction } from '../hooks/usePrediction';
import { validateInput } from '../lib/validator';
import { Loader2 } from 'lucide-react';

interface FormErrors {
  [key: string]: string;
}

export function PredictionForm() {
  const { predict, isLoading, error: predictionError } = usePrediction();
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedGrade, setSelectedGrade] = useState('S355');

  const validateField = (name: string, value: string) => {
    if (!value) {
      return `${name} is required`;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return `${name} must be a number`;
    }

    const validation = validateInput(numValue, name, selectedGrade);
    return validation.isValid ? '' : validation.message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newErrors: FormErrors = {};
    let hasErrors = false;

    ['QC_Re', 'QC_Rm', 'QC_A', 'Dimension'].forEach(field => {
      const value = formData.get(field) as string;
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const data = {
      QC_Re: Number(formData.get('QC_Re')),
      QC_Rm: Number(formData.get('QC_Rm')),
      QC_A: Number(formData.get('QC_A')),
      Dimension: Number(formData.get('Dimension')),
      Manufacturer: formData.get('Manufacturer') as string,
      Grade: selectedGrade
    };

    await predict(data);
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Prediction Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <ParameterInput 
              name="QC_Re" 
              placeholder="QC_Re" 
              explanation="Certificate yield strength"
              error={errors.QC_Re}
              onChange={handleChange}
            />
            <ParameterInput 
              name="QC_Rm" 
              placeholder="QC_Rm" 
              explanation="Certificate tensile strength"
              error={errors.QC_Rm}
              onChange={handleChange}
            />
            <ParameterInput 
              name="QC_A" 
              placeholder="QC_A" 
              explanation="Certificate Elongation"
              error={errors.QC_A}
              onChange={handleChange}
            />
            <ManufacturerCombobox />
            <ParameterInput 
              name="Dimension" 
              placeholder="Dimension" 
              explanation="Thickness in mm"
              error={errors.Dimension}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Button 
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
              className="w-full bg-blue-700 hover:bg-blue-600 text-blue-100"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Predicting...' : 'Predict'}
            </Button>

            {predictionError && (
              <Alert variant="destructive">
                <AlertDescription>{predictionError}</AlertDescription>
              </Alert>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}