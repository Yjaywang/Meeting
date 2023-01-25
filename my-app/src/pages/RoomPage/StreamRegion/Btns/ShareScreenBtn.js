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

        //if user click browser's "stop sharing"
        stream.getVideoTracks()[0].onended = async function (e) {
          console.log(e);

          //switch back to video cam
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          webRTCApi.toggleScreenSharing(!isShared, stream);
          setIsShared(false);
          //stop sharing screen
          // e.target.value.stop();

          setShareScreenStream(null);
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
    }

    // setIsShared(!isShared);
  };
  return (
    <>
      <div>
        <img
          className="share-screen-btn-img"
          onClick={handler}
          src={ShareScreenImg}
          alt=""
        />
      </div>
      {isShared && <ScreenSharing stream={shareScreenStream} />}
    </>
  );
};

export default ShareScreenBtn;
