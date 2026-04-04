import React from "react";
import peopleImg from "../../assets/images/people.svg";

interface AvatarProps {
  avatar: string;
  onToggleDrawer: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ avatar, onToggleDrawer }) => {
  return (
    <div onClick={onToggleDrawer}>
      <img
        className="w-[30px] object-cover rounded-xl cursor-pointer"
        src={avatar ? avatar : peopleImg}
        alt=""
      />
    </div>
  );
};

export default Avatar;
