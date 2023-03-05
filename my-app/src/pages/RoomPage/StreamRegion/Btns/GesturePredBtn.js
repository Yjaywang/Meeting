import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import emotionMapping from "../../../../utils/emotionMapping";
import { sendEmotionStatus } from "../../../../utils/webRTCApi";
import TensorflowOnImg from "../../../../assets/images/tensorflow_on.svg";
import TensorflowOffImg from "../../../../assets/images/tensorflow_off.svg";
import demoImg from "../../../../assets/images/all_hand_pose.png";
import loadingImg from "../../../../assets/images/sing-in-loading.png";

const GesturePredBtn = () => {
  //state variable is for btn click check state
  //let variable state is for tensorflow check state
  const [isPred, setIsPred] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [triggerEmotionForHandler, setTriggerEmotionForHandler] =
    useState(false);
  let intervalIdForDetect = 0;
  const [net, setNet] = useState(null);
  let previousClass;
  let counter;
  let triggerEmotion = false;
  const webcamRef = useRef(null);

  const handler = () => {
    //need to prevent btn can be clicked during detect 5s cold time
    if (!triggerEmotionForHandler) {
      setLoading(true);
      if (!isPred) {
        intervalIdForDetect = setInterval(() => {
          detect(net);
        }, 20);
        setIntervalId(intervalIdForDetect);
      } else {
        clearInterval(intervalId);
      }
      const predictBtnImgEl =
        document.querySelector(".Predict-btn-img").parentNode.parentNode;
      predictBtnImgEl.classList.toggle("function-btn-selected");
      setIsPred(!isPred);
    }
  };

  // Main function
  const runCoco = async () => {
    try {
      const net = await tf.loadGraphModel(process.env.REACT_APP_TF_MODEL_URL);
      setNet(net);
    } catch (error) {
      console.log("error: ", error);
    }
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

      try {
        //Make Detections
        const img = tf.browser.fromPixels(video);
        const resized = tf.image.resizeBilinear(img, [640, 480]);
        const casted = resized.cast("int32");
        const expanded = casted.expandDims(0);
        const obj = await net.executeAsync(expanded);

        const classes = await obj[0].array();
        const scores = await obj[3].array();

        //start detect, remove loading
        setLoading(false);

        //score > 0.85 judge ok
        let val = scores[0][0] > 0.85 ? 1 : 0;

        console.log(`${classes[0][0]}, ${scores[0][0]}, ${val}`);

        if (val === 1) {
          if (previousClass === classes[0][0]) {
            counter++;
          } else {
            previousClass = classes[0][0];
            counter = 1;
          }
        } else {
          previousClass = 0;
          counter = 0;
        }

        if (counter >= 5) {
          if (triggerEmotion === false) {
            const emotion = emotionMapping[previousClass];
            console.log("send emotion ", emotion);
            sendEmotionStatus(emotion);
            clearInterval(intervalIdForDetect);
            triggerEmotion = true;
            setTriggerEmotionForHandler(true);
            const gestureBtnEl = document.querySelector(".gesture-detect-btn");
            gestureBtnEl.classList.add("disable-click");

            //wait 5s reStart detection
            setTimeout(() => {
              reStart();
              sendEmotionStatus("");
              triggerEmotion = false;
              setTriggerEmotionForHandler(false);
              previousClass = 0;
              counter = 0;
              const gestureBtnEl = document.querySelector(
                ".gesture-detect-btn"
              );
              gestureBtnEl.classList.remove("disable-click");
            }, 5000);
          }
        }

        //release resource
        tf.dispose(img);
        tf.dispose(resized);
        tf.dispose(casted);
        tf.dispose(expanded);
        tf.dispose(obj);
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  function reStart() {
    intervalIdForDetect = setInterval(() => {
      detect(net);
    }, 20);
    setIntervalId(intervalIdForDetect);
  }

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div
      className="function-btn-container gesture-detect-btn"
      onClick={handler}
    >
      <div className="predict-container">
        <img
          className="Predict-btn-img function-btn-img"
          src={isPred ? TensorflowOnImg : TensorflowOffImg}
          alt=""
        />
        <div className="function-btn-name">
          {isPred ? "Detect on" : "Detect off"}
        </div>
        {loading && (
          <img src={loadingImg} className="predict-loading-img" alt="" />
        )}
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            top: 0,
            left: 0,
          }}
        />
      </div>
      <div className="gesture-img-container">
        <img className="gesture-img" src={demoImg} alt="" />
      </div>
    </div>
  );
};

export default GesturePredBtn;
