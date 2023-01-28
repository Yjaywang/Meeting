import React, { useState } from "react";
import SettingImg from "../../../../assets/images/setting.svg";

const SettingBtn = () => {
  const [isSetting, setIsSetting] = useState(false);
  const handler = () => {
    //pending develop setting panel, function
    setIsSetting(!isSetting);
  };
  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img
          className="setting-btn-img function-btn-img"
          src={SettingImg}
          alt=""
        />
        <div className="function-btn-name">Settings</div>
      </div>
    </div>
  );
};

export default SettingBtn;
