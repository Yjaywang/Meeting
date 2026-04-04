import React from "react";
import BasicInfo from "./BasicInfo";
import Password from "./Password";
import { useAppSelector } from "../../../store/hooks";
import { selectGoogleId } from "../../../store/selectors";

const ProfileRegion: React.FC = () => {
  const googleId = useAppSelector(selectGoogleId);

  return (
    <>
      <BasicInfo />
      {!googleId && (
        <>
          <div className="bg-surface-secondary p-[5px] rounded-md my-[30px]">Change Password</div>
          <Password />
        </>
      )}
    </>
  );
};

export default ProfileRegion;
