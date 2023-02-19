import { React, useEffect, useState } from "react";
import { connect } from "react-redux";
import AttendeesRegion from "./AttendeesRegion/AttendeesRegion";
import FunctionRegion from "./StreamRegion/FunctionRegion";
import * as webRTCApi from "../../utils/webRTCApi";
import Loading from "./Loading";
import "./RoomPage.css";

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
  } = props;

  useEffect(() => {
    if (!username) {
      window.location.href = "/";
    } else {
      webRTCApi.startCall(isHost, username, roomId, avatar);
    }
  }, []);

  useEffect(() => {
    if (attendCount <= 1) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.95);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.95
        )}px`;
      }
    } else if (attendCount === 2) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.95);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.48
        )}px`;
      }
    } else if (attendCount >= 3 && attendCount <= 4) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.48);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.48
        )}px`;
      }
    } else if (attendCount >= 5 && attendCount <= 6) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.3);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.48
        )}px`;
      }
    } else if (attendCount >= 7 && attendCount <= 9) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.3);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.3
        )}px`;
      }
    } else if (attendCount >= 10 && attendCount <= 12) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.22);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.3
        )}px`;
      }
    } else if (attendCount >= 13 && attendCount <= 16) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.22);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.22
        )}px`;
      }
    } else if (attendCount >= 17 && attendCount <= 20) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.18);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.22
        )}px`;
      }
    } else if (attendCount >= 21 && attendCount <= 25) {
      const videoContainerEls = document.querySelectorAll(".video-container");
      for (let videoContainerEl of videoContainerEls) {
        const width = Math.round(videoRegionWidth * 0.18);
        videoContainerEl.style.width = width < 300 ? "300px" : `${width}px`;

        videoContainerEl.style.height = `${Math.round(
          videoRegionHeight * 0.18
        )}px`;
      }
    }
  }, [videoRegionWidth, videoRegionHeight, attendCount]);

  return (
    <div className="room-page-container">
      {initLoading && <Loading />}

      <div className="room-page-panel-I">
        <div className="video-region-container">
          <div className="video-region">
            <div id="videos-portal"></div>
          </div>
          <div className="share-region"></div>
        </div>
        <div className="attendee-chat-region-container width-zero">
          <AttendeesRegion />
        </div>
      </div>
      <div className="room-page-panel-II">
        <FunctionRegion roomId={roomId} isShare={isShare} />
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
