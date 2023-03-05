import * as tf from "@tensorflow/tfjs";

// Main function
export const runCoco = async () => {
  const net = await tf.loadGraphModel(process.env.REACT_APP_TF_MODEL_URL);
  return net;
};
