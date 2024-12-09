import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  const modelUrl = 'https://cdn.jsdelivr.net/gh/ErdUi/steel-yield-predictor@main/models/model.json';
  return await tf.loadLayersModel(modelUrl);
}

export function preprocessInput(data: any) {
  return tf.tidy(() => {
    const tensor = tf.tensor2d([Object.values(data)]);
    return tensor.div(tf.scalar(100));
  });
}