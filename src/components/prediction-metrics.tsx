import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Prediction } from '../lib/model';

interface PredictionMetricsProps {
  prediction: Prediction;
}

export function PredictionMetrics({ prediction }: PredictionMetricsProps) {
  const metrics = [
    { name: 'Predicted Strength', value: `${prediction.predictedStrength.toFixed(1)} MPa` },
    { name: 'Lower CI', value: `${prediction.lowerCI.toFixed(1)} MPa` },
    { name: 'Upper CI', value: `${prediction.upperCI.toFixed(1)} MPa` },
    { name: 'Passes Requirement', value: prediction.passes ? 'Yes' : 'No' },
    { name: 'Safety Margin', value: `${prediction.margin.toFixed(1)} MPa` },
  ];

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Prediction Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.name}>
                <TableCell className="font-medium">{metric.name}</TableCell>
                <TableCell className={metric.name === 'Passes Requirement' ? 
                  (prediction.passes ? 'text-green-400' : 'text-red-400') : 
                  'text-blue-300'
                }>
                  {metric.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}