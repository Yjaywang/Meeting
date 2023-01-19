import React, { useState } from "react";
import SettingImg from "../../../../assets/images/setting.svg";

const SettingBtn = () => {
  const [isSetting, setIsSetting] = useState(false);
  const handler = () => {
    //pending develop setting panel, function
    setIsSetting(!isSetting);
  };
  return (
    <div>
      <img
        className="setting-btn-img"
        onClick={handler}
        src={SettingImg}
        alt=""
      />
    </div>
  );
};

export default SettingBtn;
