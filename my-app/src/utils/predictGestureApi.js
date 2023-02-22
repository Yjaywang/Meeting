import * as tf from "@tensorflow/tfjs";

// Main function
export const runCoco = async () => {
  const net = await tf.loadGraphModel(
    "https://d26qu93gsa16ou.cloudfront.net/tensorflow-SSD/model.json"
    // "https://taipei-day-trip-jaywang.s3.amazonaws.com/tensorflow-SSD/model.json"
  );
  return net;
};
