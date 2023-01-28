import React, { useState } from "react";
import ShareScreenImg from "../../../../assets/images/share_screen.svg";
import ScreenSharing from "./ScreenSharing";
import * as webRTCApi from "../../../../utils/webRTCApi";

const constrains = {
  audio: false,
  video: true,
};
const ShareScreenBtn = () => {
  const [isShared, setIsShared] = useState(false);
  const [shareScreenStream, setShareScreenStream] = useState(null);

  const handler = async () => {
    if (!isShared) {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia(constrains);
      } catch (error) {
        console.log("share screen error: ", error);
      }
      if (stream) {
        //share screen
        //shareScreenStream will update after render
        setShareScreenStream(stream);
        webRTCApi.toggleScreenSharing(!isShared, stream);
        setIsShared(true);
        const attendeeContainerEl = document.querySelector(
          ".share-screen-btn-img"
        ).parentNode.parentNode;
        attendeeContainerEl.classList.toggle("function-btn-selected");

        //if user click browser's "stop sharing"
        stream.getVideoTracks()[0].onended = async function (e) {
          //switch back to video cam
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          webRTCApi.toggleScreenSharing(!isShared, stream);
          setIsShared(false);
          setShareScreenStream(null);

          const attendeeContainerEl = document.querySelector(
            ".share-screen-btn-img"
          ).parentNode.parentNode;
          attendeeContainerEl.classList.toggle("function-btn-selected");
        };
      }
    } else {
      // if user click screen share again when sharing, close share stream
      //switch back to video cam
      webRTCApi.toggleScreenSharing(!isShared);
      setIsShared(false);
      //stop sharing screen
      shareScreenStream.getTracks().forEach((track) => {
        track.stop();
      });
      setShareScreenStream(null);

      const attendeeContainerEl = document.querySelector(
        ".share-screen-btn-img"
      ).parentNode.parentNode;
      attendeeContainerEl.classList.toggle("function-btn-selected");
    }

    // setIsShared(!isShared);
  };
  console.log("iss", isShared);
  return (
    <>
      <div className="function-btn-container" onClick={handler}>
        <div>
          <img
            className="share-screen-btn-img function-btn-img"
            src={ShareScreenImg}
            alt=""
          />
          <div className="function-btn-name share-btn-name">
            {isShared ? "Stop share" : "Start share"}
          </div>
        </div>
      </div>

      {isShared && <ScreenSharing stream={shareScreenStream} />}
    </>
  );
};

export default ShareScreenBtn;
