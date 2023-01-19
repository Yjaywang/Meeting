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
    <div>
      <CamBtn />
      <MicBtn />
      <ShowAttendeesBtn />
      <ShowChatBtn />
      <ShareScreenBtn />
      <RecordBtn />
      <SettingBtn />
      <LeaveBtn />
    </div>
  );
};

export default StreamBtns;
