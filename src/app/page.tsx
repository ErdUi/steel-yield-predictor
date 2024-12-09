"use client"

import { useState } from 'react';
import { loadModel, preprocessInput } from '../lib/model-loader';
import { PredictionForm } from '../components/prediction-form';
import { PredictionChart } from '../components/prediction-chart';

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  
  async function handlePredict(data) {
    const model = await loadModel();
    const input = preprocessInput(data);
    const output = await model.predict(input);
    setPrediction(await output.data());
    input.dispose();
    output.dispose();
  }

  return (
    <main className="container mx-auto p-4">
      <PredictionForm onPredict={handlePredict} />
      {prediction && <PredictionChart data={prediction} />}
    </main>
  );
}