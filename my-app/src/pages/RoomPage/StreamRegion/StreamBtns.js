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

const StreamBtns = ({
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
      <div className="btn-section-I">
        <CamBtn />
        <MicBtn />
      </div>
      <div className="btn-section-II">
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
            setScreenStream={setScreenStream}
            streamRecorder={streamRecorder}
            setStreamRecorder={setStreamRecorder}
          />
        )}
        <GesturePredBtn />
      </div>
      <div className="btn-section-III">
        <DisplayRoomId roomId={roomId} />
        <LeaveBtn />
      </div>
    </>
  );
};

export default StreamBtns;
