import React, { useRef, useEffect, useState } from "react";
import PreviewBtns from "./PreviewBtns";
import { useNavigate } from "react-router-dom";
import { connectSocketIOServer } from "../../utils/webSocketApi";
import { previewCall, toggleMicBtn, toggleCamBtn } from "../../utils/webRTCApi";
import camCloseImg from "../../assets/images/cam_close.svg";
import camOpenImg from "../../assets/images/cam_open.svg";
import micCloseImg from "../../assets/images/mic_close.svg";
import micOpenImg from "../../assets/images/mic_open.svg";
import { useAppStore, useAppSelector } from "../../store/hooks";
import { selectSelfSocketId, selectRoomId } from "../../store/selectors";

interface PreviewContentProps {
  stream: MediaStream | null;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  isMuted: boolean;
  setIsMutedAction: (isMuted: boolean) => void;
  isCamOff: boolean;
  setIsCamOffAction: (isCamOff: boolean) => void;
  username: string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({ stream, setStream, isMuted, setIsMutedAction, isCamOff, setIsCamOffAction, username }) => {
  const navigate = useNavigate();
  const store = useAppStore();
  const selfSocketId = useAppSelector(selectSelfSocketId);
  const roomId = useAppSelector(selectRoomId);
  const screenSharingRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const constrain = { audio: { enabled: isMuted }, video: { width: 480, height: 360, enabled: isCamOff } };

  useEffect(() => {
    const getMedia = async () => {
      try {
        await connectSocketIOServer(store.dispatch, store.getState);
        const mediaStream = await previewCall(constrain as MediaStreamConstraints);
        if (mediaStream) setStream(mediaStream);
        setLoading(false);
      } catch (error) { console.log("error:", error); }
    };
    getMedia();
  }, []);

  useEffect(() => {
    const video = screenSharingRef.current;
    if (video) {
      video.srcObject = stream;
      video.onloadedmetadata = () => { video.play(); };
    }
  }, [stream]);

  function clickHandler() { if (loading) return; navigate("/room"); }
  function micClickHandler() { toggleMicBtn(!isMuted, selfSocketId, roomId); setIsMutedAction(!isMuted); }
  function camClickHandler() { toggleCamBtn(!isCamOff); setIsCamOffAction(!isCamOff); }

  return (
    <div className="flex flex-col max-[500px]:w-[320px]">
      <div className="w-[480px] h-[360px] drop-shadow-[0_0_0.2rem_#A0A0A0] bg-gray-600 border-[5px] border-gray-600 box-border rounded-lg relative shrink-0 max-[500px]:w-[320px] max-[500px]:h-[240px] max-[500px]:mx-auto">
        <video className="w-full h-full" muted autoPlay ref={screenSharingRef}></video>
        <div className="video-name-vol-container" id="video-container-">
          <div className="video-name-container">
            <img className="video-mic-img" id="mic-img-" src={isMuted ? micCloseImg : micOpenImg} alt="" />
            <div className="video-vol-bar-container"><div className="video-vol-bar" id="vol-bar-"></div></div>
            <div className="video-name-group"><div className="video-name" id="username-">{username}</div></div>
          </div>
        </div>
      </div>
      <div className="pt-[5px] text-muted">Before enter the room, check the camera and microphone status </div>
      <div className="flex flex-row gap-[5px] py-2.5">
        <img className="h-[50px] object-cover cursor-pointer" src={isCamOff ? camCloseImg : camOpenImg} alt="" onClick={camClickHandler} />
        <img className="h-[50px] object-cover cursor-pointer" src={isMuted ? micCloseImg : micOpenImg} alt="" onClick={micClickHandler} />
      </div>
      <PreviewBtns clickHandler={clickHandler} loading={loading} />
    </div>
  );
};

export default PreviewContent;
