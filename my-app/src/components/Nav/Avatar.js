import React, { useEffect } from "react";
import peopleImg from "../../assets/images/people.svg";

const Avatar = ({ avatar }) => {
  useEffect(() => {
    //get avatar
    async function getAvatar() {
      try {
        // const response = await fetchUserApi.getUserInfo();
        const navAvatarImgEl = document.querySelector(".nav-avatar-img");
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

  function clickHandler() {
    //add event listener to drawer
    const navDrawerContainerEl = document.querySelector(
      ".nav-drawer-container"
    );
    navDrawerContainerEl.classList.toggle("hide");
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
