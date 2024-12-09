import { useState, useEffect } from 'react';
import { ModelInput, Prediction } from '../lib/model';
import { RandomForestModel } from '../lib/rf-model';

const model = new RandomForestModel();

export function usePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    loadModel();
  }, []);

  async function loadModel() {
    try {
      await model.loadModel();
      setIsModelLoaded(true);
    } catch (err) {
      setError('Failed to load model');
      console.error(err);
    }
  }

  async function predict(input: ModelInput) {
    if (!isModelLoaded) {
      setError('Model not loaded');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await model.predict(input);
      setPrediction(result);
    } catch (err) {
      setError('Prediction failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return { predict, prediction, isLoading, error, isModelLoaded };
}