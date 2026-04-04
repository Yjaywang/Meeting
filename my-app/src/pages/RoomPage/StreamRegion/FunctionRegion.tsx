import React, { useState } from "react";
import StreamBtns from "./StreamBtns";
import RecordRTC from "recordrtc";

interface StreamRegionProps {
  roomId: string;
  isShare: boolean;
  screenStream: MediaStream | null;
  setScreenStream: (stream: MediaStream | null) => void;
  isAttendee: boolean;
  setIsAttendee: (isAttendee: boolean) => void;
  isChat: boolean;
  setIsChat: (isChat: boolean) => void;
}

const StreamRegion: React.FC<StreamRegionProps> = ({
  roomId,
  isShare,
  screenStream,
  setScreenStream,
  isAttendee,
  setIsAttendee,
  isChat,
  setIsChat,
}) => {
  const [streamRecorder, setStreamRecorder] = useState<RecordRTC | null>(null);
  return (
    <div className="flex justify-between items-center px-2.5 h-full max-[870px]:justify-around">
      <StreamBtns
        roomId={roomId}
        isShare={isShare}
        screenStream={screenStream}
        setScreenStream={setScreenStream}
        streamRecorder={streamRecorder}
        setStreamRecorder={setStreamRecorder}
        isAttendee={isAttendee}
        setIsAttendee={setIsAttendee}
        isChat={isChat}
        setIsChat={setIsChat}
      />
    </div>
  );
};

export default StreamRegion;
