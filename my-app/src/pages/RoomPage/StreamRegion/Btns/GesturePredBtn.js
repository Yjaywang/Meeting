import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import TensorflowOnImg from "../../../../assets/images/tensorflow_on.svg";
import TensorflowOffImg from "../../../../assets/images/tensorflow_off.svg";

const GesturePredBtn = () => {
  const [isPred, setIsPred] = useState(false);

  const handler = () => {
    const predictBtnImgEl =
      document.querySelector(".Predict-btn-img").parentNode.parentNode;
    predictBtnImgEl.classList.toggle("function-btn-selected");
    setIsPred(!isPred);
  };

  const webcamRef = useRef(null);
  // const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    // https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json
    const net = await tf.loadGraphModel(
      "https://d26qu93gsa16ou.cloudfront.net/tensorflow-2-SSD/model.json"
      // "https://taipei-day-trip-jaywang.s3.amazonaws.com/tensorflow-SSD/model.json"
      // "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json"
    );

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 20);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4 //HAVE_ENOUGH_DATA - enough data available to start playing
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      // canvasRef.current.width = videoWidth;
      // canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video);

      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);
      // console.log(obj);

      const classes = await obj[0].array();
      const scores = await obj[3].array();

      let val = scores[0][0] > 0.8 ? 1 : 0;

      console.log(`${classes[0][0]}, ${scores[0][0]}, ${val}`);

      // Draw mesh
      // const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)

      // requestAnimationFrame(() => {
      //   drawRect(
      //     boxes[0],
      //     classes[0],
      //     scores[0],
      //     0.8,
      //     videoWidth,
      //     videoHeight,
      //     ctx
      //   );
      // });

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img
          className="Predict-btn-img function-btn-img"
          src={isPred ? TensorflowOnImg : TensorflowOffImg}
          alt=""
        />
        <div className="function-btn-name">
          {isPred ? "Predict on" : "Predict off"}
        </div>
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            width: 640,
            height: 480,
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  );
};

export default GesturePredBtn;
