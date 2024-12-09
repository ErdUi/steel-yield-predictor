import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prediction } from '../lib/model';

interface PredictionChartProps {
  prediction: Prediction;
}

export function PredictionChart({ prediction }: PredictionChartProps) {
  const data = [{
    name: 'Prediction',
    predicted: prediction.predictedStrength,
    lower: prediction.lowerCI,
    upper: prediction.upperCI
  }];

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Prediction Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8884d8" 
                name="Predicted Strength" 
              />
              <Line 
                type="monotone" 
                dataKey="lower" 
                stroke="#82ca9d" 
                name="Lower CI" 
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="upper" 
                stroke="#ffc658" 
                name="Upper CI" 
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}