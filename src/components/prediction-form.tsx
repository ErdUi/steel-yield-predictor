import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ManufacturerCombobox } from "./manufacturer-combobox";
import { ParameterInput } from "./parameter-input";
import { GradeSelector } from "./grade-selector";
import { usePrediction } from '../hooks/usePrediction';
import { validateInput } from '../lib/validator';
import { Loader2 } from 'lucide-react';

export function PredictionForm() {
  const { predict, isLoading, error: predictionError } = usePrediction();
  const [errors, setErrors] = useState({});
  const [selectedGrade, setSelectedGrade] = useState('S355');

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    // Revalidate all fields with new grade requirements
    const form = document.querySelector('form');
    if (form) {
      const formData = new FormData(form);
      const newErrors = {};
      ['QC_Re', 'QC_Rm', 'QC_A', 'Dimension'].forEach(field => {
        const value = formData.get(field);
        if (value) {
          const error = validateInput(Number(value), field, grade);
          if (!error.isValid) {
            newErrors[field] = error.message;
          }
        }
      });
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

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
          <GradeSelector 
            value={selectedGrade} 
            onChange={handleGradeChange}
          />
          <ParameterInput 
            name="QC_Re" 
            placeholder="QC_Re" 
            explanation="Certificate yield strength"
            error={errors.QC_Re}
          />
          <ParameterInput 
            name="QC_Rm" 
            placeholder="QC_Rm" 
            explanation="Certificate tensile strength"
            error={errors.QC_Rm}
          />
          <ParameterInput 
            name="QC_A" 
            placeholder="QC_A" 
            explanation="Certificate Elongation"
            error={errors.QC_A}
          />
          <ManufacturerCombobox />
          <ParameterInput 
            name="Dimension" 
            placeholder="Dimension" 
            explanation="Thickness in mm"
            error={errors.Dimension}
          />
          <Button 
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
            className="w-full bg-blue-700 hover:bg-blue-600 text-blue-100"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Predicting...' : 'Predict'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}