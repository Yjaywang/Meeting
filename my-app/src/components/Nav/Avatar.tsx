import React, { useEffect } from "react";
import peopleImg from "../../assets/images/people.svg";

interface AvatarProps {
  avatar: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatar }) => {
  useEffect(() => {
    //get avatar
    async function getAvatar(): Promise<void> {
      try {
        // const response = await fetchUserApi.getUserInfo();
        const navAvatarImgEl = document.querySelector(".nav-avatar-img") as HTMLImageElement | null;
        // const avatar = response.data.avatar;
        if (!avatar || !navAvatarImgEl) {
          return;
        }
        navAvatarImgEl.src = avatar;
      } catch (error) {
        console.error("error ", error);
      }
    }
    getAvatar();
  }, [avatar]);

  function clickHandler(): void {
    //add event listener to drawer
    const navDrawerContainerEl = document.querySelector(
      ".nav-drawer-container"
    ) as HTMLElement | null;
    navDrawerContainerEl?.classList.toggle("hide");
  }
  return (
    <div className="nav-avatar-img-container" onClick={clickHandler}>
      <img
        className="nav-avatar-img"
        src={avatar ? avatar : peopleImg}
        alt=""
      />
    </div>
  );
};

export default Avatar;
