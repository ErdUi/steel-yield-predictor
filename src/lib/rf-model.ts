import * as tf from '@tensorflow/tfjs';
import { ModelInput, Prediction, getMinYieldStrength } from './model';

export class RandomForestModel {
  private model: tf.GraphModel | null = null;
  private loadAttempts = 0;
  private readonly MAX_ATTEMPTS = 3;
  
  async loadModel() {
    while (this.loadAttempts < this.MAX_ATTEMPTS) {
      try {
        this.model = await tf.loadGraphModel('/models/model.json');
        return;
      } catch (error) {
        this.loadAttempts++;
        if (this.loadAttempts === this.MAX_ATTEMPTS) {
          throw new Error(`Failed to load model after ${this.MAX_ATTEMPTS} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private preprocessInput(input: ModelInput) {
    const features = [
      input.QC_Re,
      input.QC_Rm,
      input.QC_A,
      input.Dimension
    ];
    return tf.tensor2d([features]);
  }

  async predict(input: ModelInput): Promise<Prediction> {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const features = this.preprocessInput(input);
    try {
      const prediction = await this.model.predict(features) as tf.Tensor;
      const predArray = await prediction.array();
      
      const predictedStrength = predArray[0][0];
      const stdDev = predArray[0][1];
      const CI_FACTOR = 2.576; // 99% confidence interval

      const lowerCI = predictedStrength - CI_FACTOR * stdDev;
      const upperCI = predictedStrength + CI_FACTOR * stdDev;
      
      const minRequired = getMinYieldStrength(input.Dimension, input.Grade);
      const passes = lowerCI >= minRequired;
      const margin = lowerCI - minRequired;

      features.dispose();
      prediction.dispose();

      return {
        predictedStrength,
        lowerCI,
        upperCI,
        passes,
        margin
      };
    } catch (error) {
      features.dispose();
      throw error;
    }
  }
}