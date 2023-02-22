import { React, useEffect, useState } from "react";
import { connect } from "react-redux";
import AttendeesRegion from "./AttendeesRegion/AttendeesRegion";
import FunctionRegion from "./StreamRegion/FunctionRegion";
import * as webRTCApi from "../../utils/webRTCApi";
import Loading from "./Loading";
import "./RoomPage.css";
import ScreenSharing from "./StreamRegion/Btns/ScreenSharing";

const RoomPage = (props) => {
  const {
    avatar,
    attendCount,
    videoRegionWidth,
    videoRegionHeight,
    roomId,
    username,
    isHost,
    initLoading,
    isShare,
    isOtherShare,
  } = props;
  const [screenStream, setScreenStream] = useState(null);
  const [isAttendee, setIsAttendee] = useState(false);
  const [isChat, setIsChat] = useState(false);
  useEffect(() => {
    if (!username) {
      window.location.href = "/";
    } else {
      webRTCApi.startCall(isHost, username, roomId, avatar);
    }
  }, []);

  useEffect(() => {
    if (!isShare && !isOtherShare) {
      if (attendCount <= 1) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.95);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.95
          )}px`;
        }
      } else if (attendCount === 2) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.95);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.48
          )}px`;
        }
      } else if (attendCount >= 3 && attendCount <= 4) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.48);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.48
          )}px`;
        }
      } else if (attendCount >= 5 && attendCount <= 6) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.3);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.48
          )}px`;
        }
      } else if (attendCount >= 7 && attendCount <= 9) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.3);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.3
          )}px`;
        }
      } else if (attendCount >= 10 && attendCount <= 12) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.22);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.3
          )}px`;
        }
      } else if (attendCount >= 13 && attendCount <= 16) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.22);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.22
          )}px`;
        }
      } else if (attendCount >= 17 && attendCount <= 20) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.18);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.22
          )}px`;
        }
      } else if (attendCount >= 21 && attendCount <= 25) {
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          const width = Math.round(videoRegionWidth * 0.18);
          if (isChat || isAttendee) {
            videoContainerEl.style.width =
              width - 300 < 300 ? "300px" : `${width - 300}px`;
          } else {
            videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;
          }

          videoContainerEl.style.height = `${Math.round(
            videoRegionHeight * 0.18
          )}px`;
        }
      }
    } else {
      // sharing part
      if (isChat || isAttendee) {
        // setting portal size
        const videoPortalEl = document.querySelector(".videos-portal");
        videoPortalEl.style.width = `${videoRegionWidth - 300}px`;
        //setting viewer container size
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          videoContainerEl.style.width = "300px";
          videoContainerEl.style.height = "170px";
        }
        //setting sharing container size
        if (document.querySelector(".sharing-video-container")) {
          //sharing container setting
          const sharingContainerEl = document.querySelector(
            ".sharing-video-container"
          );
          sharingContainerEl.style.width = `${videoRegionWidth - 300}px`;
          sharingContainerEl.style.height = `${videoRegionHeight - 195}px`;
        }
      } else {
        // setting portal size
        const videoPortalEl = document.querySelector(".videos-portal");
        videoPortalEl.style.width = `${videoRegionWidth}px`;
        //setting viewer container size
        const videoContainerEls = document.querySelectorAll(".video-container");
        for (let videoContainerEl of videoContainerEls) {
          videoContainerEl.style.width = "300px";
          videoContainerEl.style.height = "170px";
        }
        //setting sharing container size
        if (document.querySelector(".sharing-video-container")) {
          //sharing container setting
          const sharingContainerEl = document.querySelector(
            ".sharing-video-container"
          );
          sharingContainerEl.style.width = `${videoRegionWidth}px`;
          sharingContainerEl.style.height = `${videoRegionHeight - 195}px`;
        }
      }
    }
  }, [
    videoRegionWidth,
    videoRegionHeight,
    attendCount,
    isShare,
    isOtherShare,
    isChat,
    isAttendee,
  ]);

  return (
    <div className="room-page-container">
      {initLoading && <Loading />}

      <div className="room-page-panel-I">
        <div className="video-region-container">
          <div className="video-region">
            <div className="videos-portal"></div>
          </div>
          <div className="share-region">
            {isShare && <ScreenSharing stream={screenStream} />}
          </div>
        </div>
        <div className="attendee-chat-region-container width-zero">
          <AttendeesRegion />
        </div>
      </div>
      <div className="room-page-panel-II">
        <FunctionRegion
          roomId={roomId}
          isShare={isShare}
          screenStream={screenStream}
          setScreenStream={setScreenStream}
          isAttendee={isAttendee}
          setIsAttendee={setIsAttendee}
          isChat={isChat}
          setIsChat={setIsChat}
        />
      </div>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(RoomPage);
