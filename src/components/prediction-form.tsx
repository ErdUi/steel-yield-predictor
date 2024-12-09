import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManufacturerCombobox } from "./manufacturer-combobox";
import { ParameterInput } from "./parameter-input";
import { usePrediction } from '../hooks/usePrediction';
import { Loader2 } from 'lucide-react';

export interface PredictionFormProps {
  onPredictionComplete?: () => void;
}

export function PredictionForm({ onPredictionComplete }: PredictionFormProps) {
  const { predict, isLoading, error } = usePrediction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      QC_Re: Number(formData.get('QC_Re')),
      QC_Rm: Number(formData.get('QC_Rm')),
      QC_A: Number(formData.get('QC_A')),
      Dimension: Number(formData.get('Dimension')),
      Manufacturer: formData.get('Manufacturer') as string,
      Grade: formData.get('Grade') as string,
    };

    try {
      await predict(data);
      onPredictionComplete?.();
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Prediction Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ParameterInput 
            name="QC_Re" 
            placeholder="QC_Re" 
            explanation="Certificate yield strength"
          />
          <ParameterInput 
            name="QC_Rm" 
            placeholder="QC_Rm" 
            explanation="Certificate tensile strength"
          />
          <ParameterInput 
            name="QC_A" 
            placeholder="QC_A" 
            explanation="Certificate Elongation"
          />
          <ManufacturerCombobox />
          <ParameterInput 
            name="Dimension" 
            placeholder="Dimension" 
            explanation="Thickness in mm"
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-600 text-blue-100"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Predicting...' : 'Predict'}
          </Button>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}