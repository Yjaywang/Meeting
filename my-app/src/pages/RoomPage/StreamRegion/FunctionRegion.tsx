import React, { useState } from "react";
import StreamBtns from "./StreamBtns";
import { connect } from "react-redux";
import { RootState } from "../../../types/redux";
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
    <div className="stream-region-container">
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

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(StreamRegion);
