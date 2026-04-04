import React from "react";
import DisplayRoomId from "../DisplayRoomId";
import CamBtn from "./Btns/CamBtn";
import GesturePredBtn from "./Btns/GesturePredBtn";
import LeaveBtn from "./Btns/LeaveBtn";
import MicBtn from "./Btns/MicBtn";
import RecordBtn from "./Btns/RecordBtn";
import ShareScreenBtn from "./Btns/ShareScreenBtn";
import ShowAttendeesBtn from "./Btns/ShowAttendeesBtn";
import ShowChatBtn from "./Btns/ShowChatBtn";
import RecordRTC from "recordrtc";

interface StreamBtnsProps {
  roomId: string;
  isShare: boolean;
  screenStream: MediaStream | null;
  setScreenStream: (stream: MediaStream | null) => void;
  streamRecorder: RecordRTC | null;
  setStreamRecorder: (recorder: RecordRTC | null) => void;
  isAttendee: boolean;
  setIsAttendee: (isAttendee: boolean) => void;
  isChat: boolean;
  setIsChat: (isChat: boolean) => void;
}

const StreamBtns: React.FC<StreamBtnsProps> = ({
  roomId,
  isShare,
  screenStream,
  setScreenStream,
  streamRecorder,
  setStreamRecorder,
  isAttendee,
  setIsAttendee,
  isChat,
  setIsChat,
}) => {
  return (
    <>
      <div className="flex items-center justify-start h-full">
        <CamBtn />
        <MicBtn />
      </div>
      <div className="flex h-full">
        <ShowAttendeesBtn
          isAttendee={isAttendee}
          setIsAttendee={setIsAttendee}
        />
        <ShowChatBtn isChat={isChat} setIsChat={setIsChat} />
        <ShareScreenBtn
          screenStream={screenStream}
          setScreenStream={setScreenStream}
          streamRecorder={streamRecorder}
          setStreamRecorder={setStreamRecorder}
        />
        {isShare && (
          <RecordBtn
            screenStream={screenStream}
            streamRecorder={streamRecorder}
            setStreamRecorder={setStreamRecorder}
          />
        )}
        <GesturePredBtn />
      </div>
      <div className="flex items-center gap-5 max-[450px]:gap-2.5">
        <DisplayRoomId roomId={roomId} />
        <LeaveBtn />
      </div>
    </>
  );
};

export default StreamBtns;
