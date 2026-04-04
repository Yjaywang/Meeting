import React, { useEffect, useRef, useState } from "react";
import AttendeesRegion from "./AttendeesRegion/AttendeesRegion";
import FunctionRegion from "./StreamRegion/FunctionRegion";
import VideoGrid from "./StreamRegion/VideoGrid";
import { useWebRTC } from "../../contexts/WebRTCContext";
import Loading from "./Loading";
import ScreenSharing from "./StreamRegion/Btns/ScreenSharing";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import {
  selectAvatar,
  selectUsername,
  selectRoomId,
  selectIsHost,
  selectSelfSocketId,
  selectInitLoading,
  selectIsShare,
  selectIsOtherShare,
  selectIsCamOff,
  selectIsMuted,
} from "../../store/selectors";
import { useVideoRegion } from "../../hooks/useVideoRegion";

const RoomPage: React.FC = () => {
  const videoRegionRef = useRef<HTMLDivElement>(null);
  const { width: videoRegionWidth, height: videoRegionHeight } = useVideoRegion(videoRegionRef);
  const { startCall } = useWebRTC();
  const navigate = useNavigate();
  const avatar = useAppSelector(selectAvatar);
  const roomId = useAppSelector(selectRoomId);
  const username = useAppSelector(selectUsername);
  const isHost = useAppSelector(selectIsHost);
  const selfSocketId = useAppSelector(selectSelfSocketId);
  const initLoading = useAppSelector(selectInitLoading);
  const isShare = useAppSelector(selectIsShare);
  const isOtherShare = useAppSelector(selectIsOtherShare);
  const isCamOff = useAppSelector(selectIsCamOff);
  const isMuted = useAppSelector(selectIsMuted);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isAttendee, setIsAttendee] = useState<boolean>(false);
  const [isChat, setIsChat] = useState<boolean>(false);
  const startCallInitialized = useRef(false);

  useEffect(() => {
    if (!username) {
      navigate("/");
    } else if (selfSocketId && !startCallInitialized.current) {
      startCallInitialized.current = true;
      startCall(isHost, username, roomId, avatar, selfSocketId, { isOtherShare, isCamOff, isMuted });
    }
  }, [selfSocketId]);

  return (
    <div className="w-full h-screen bg-surface-dark overflow-hidden">
      {initLoading && <Loading />}

      <div className="h-[calc(100vh-70px)] flex">
        <div className="flex-auto" ref={videoRegionRef} data-video-region>
          <VideoGrid
            width={videoRegionWidth}
            height={videoRegionHeight}
            isSidebarOpen={isChat || isAttendee}
          />
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
