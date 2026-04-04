import React, { useEffect, useState } from "react";
import AttendeesRegion from "./AttendeesRegion/AttendeesRegion";
import FunctionRegion from "./StreamRegion/FunctionRegion";
import { startCall } from "../../utils/webRTCApi";
import Loading from "./Loading";
import ScreenSharing from "./StreamRegion/Btns/ScreenSharing";
import { useAppSelector } from "../../store/hooks";

const RoomPage: React.FC = () => {
  const avatar = useAppSelector((state) => state.user.avatar);
  const attendCount = useAppSelector((state) => state.room.attendCount);
  const videoRegionWidth = useAppSelector((state) => state.media.videoRegionWidth);
  const videoRegionHeight = useAppSelector((state) => state.media.videoRegionHeight);
  const roomId = useAppSelector((state) => state.room.roomId);
  const username = useAppSelector((state) => state.user.username);
  const isHost = useAppSelector((state) => state.room.isHost);
  const initLoading = useAppSelector((state) => state.room.initLoading);
  const isShare = useAppSelector((state) => state.media.isShare);
  const isOtherShare = useAppSelector((state) => state.media.isOtherShare);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isAttendee, setIsAttendee] = useState<boolean>(false);
  const [isChat, setIsChat] = useState<boolean>(false);
  useEffect(() => {
    if (!username) {
      window.location.href = "/";
    } else {
      startCall(isHost, username, roomId, avatar);
    }
  }, []);

  useEffect(() => {
    if (!isShare && !isOtherShare) {
      if (attendCount <= 1) {
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
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
        const videoPortalEl = document.querySelector(".videos-portal") as HTMLElement | null;
        if (videoPortalEl) {
          videoPortalEl.style.width = `${videoRegionWidth - 300}px`;
        }
        //setting viewer container size
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
        for (let videoContainerEl of videoContainerEls) {
          videoContainerEl.style.width = "300px";
          videoContainerEl.style.height = "182px";
        }
        //setting sharing container size
        if (document.querySelector(".sharing-video-container")) {
          //sharing container setting
          const sharingContainerEl = document.querySelector(
            ".sharing-video-container"
          ) as HTMLElement | null;
          if (sharingContainerEl) {
            sharingContainerEl.style.width = `${videoRegionWidth - 300}px`;
            sharingContainerEl.style.height = `${videoRegionHeight - 195}px`;
          }
        }
      } else {
        // setting portal size
        const videoPortalEl = document.querySelector(".videos-portal") as HTMLElement | null;
        if (videoPortalEl) {
          videoPortalEl.style.width = `${videoRegionWidth}px`;
        }
        //setting viewer container size
        const videoContainerEls = document.querySelectorAll(".video-container") as NodeListOf<HTMLElement>;
        for (let videoContainerEl of videoContainerEls) {
          videoContainerEl.style.width = "300px";
          videoContainerEl.style.height = "182px";
        }
        //setting sharing container size
        if (document.querySelector(".sharing-video-container")) {
          //sharing container setting
          const sharingContainerEl = document.querySelector(
            ".sharing-video-container"
          ) as HTMLElement | null;
          if (sharingContainerEl) {
            sharingContainerEl.style.width = `${videoRegionWidth}px`;
            sharingContainerEl.style.height = `${videoRegionHeight - 195}px`;
          }
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
    <div className="w-full h-screen bg-surface-dark overflow-hidden">
      {initLoading && <Loading />}

      <div className="h-[calc(100vh-70px)] flex">
        <div className="flex-auto">
          <div className="flex items-center justify-center h-full mt-[5px]">
            <div className="videos-portal flex justify-center h-full gap-[5px] flex-wrap overflow-y-auto"></div>
          </div>
          <div className="share-region">
            {isShare && <ScreenSharing stream={screenStream} />}
          </div>
        </div>
        <div className={`bg-surface flex flex-col max-[600px]:h-[calc(100vh-70px)] max-[600px]:absolute max-[600px]:z-[999] max-[600px]:right-0 ${isChat || isAttendee ? "w-[300px]" : "w-0"}`}>
          <AttendeesRegion isAttendee={isAttendee} isChat={isChat} />
        </div>
      </div>
      <div className="bg-surface-darkest h-[70px]">
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

export default RoomPage;
