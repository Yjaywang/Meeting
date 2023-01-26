import React from "react";
import CamBtn from "./Btns/CamBtn";
import LeaveBtn from "./Btns/LeaveBtn";
import MicBtn from "./Btns/MicBtn";
import RecordBtn from "./Btns/RecordBtn";
import SettingBtn from "./Btns/SettingBtn";
import ShareScreenBtn from "./Btns/ShareScreenBtn";
import ShowAttendeesBtn from "./Btns/ShowAttendeesBtn";
import ShowChatBtn from "./Btns/ShowChatBtn";

const StreamBtns = (props) => {
  return (
    <>
      <div className="btn-section-I">
        <CamBtn />
        <MicBtn />
      </div>
      <div className="btn-section-II">
        <ShowAttendeesBtn />
        <ShowChatBtn />
        <ShareScreenBtn />
        <RecordBtn />
        <SettingBtn />
      </div>
      <div className="btn-section-III">
        <LeaveBtn />
      </div>
    </>
  );
};

export default StreamBtns;
