import * as tf from '@tensorflow/tfjs';
import { ModelInput, Prediction } from './model';

export class RandomForestModel {
  private model: tf.GraphModel | null = null;
  private NUM_TREES = 500;
  
  async loadModel() {
    this.model = await tf.loadGraphModel('/models/model.json');
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
  }
}