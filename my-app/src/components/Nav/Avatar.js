import React, { useEffect } from "react";
import peopleImg from "../../assets/images/people.svg";
import * as fetchUserApi from "../../utils/fetchUserApi";

const Avatar = () => {
  useEffect(() => {
    //add event listener to drawer
    const navAvatarImgEl = document.querySelector(".nav-avatar-img");
    const navDrawerContainerEl = document.querySelector(
      ".nav-drawer-container"
    );
    if (navAvatarImgEl) {
      navAvatarImgEl.addEventListener("click", () => {
        navDrawerContainerEl.classList.toggle("hide");
      });
    }

    document.addEventListener("click", (e) => {
      if (
        !navDrawerContainerEl.contains(e.target) &&
        !navAvatarImgEl.contains(e.target)
      ) {
        navDrawerContainerEl.classList.add("hide");
      }
    });

    //get avatar
    async function getAvatar() {
      try {
        const response = await fetchUserApi.getUserInfo();
        const navAvatarImgEl = document.querySelector(".nav-avatar-img");
        const avatar = response.data.avatar;
        if (!avatar || !navAvatarImgEl) {
          return;
        }
        navAvatarImgEl.src = avatar;
      } catch (error) {
        console.error("error ", error);
      }
    }
    getAvatar();
  }, []);
  return (
    <div>
      <img className="nav-avatar-img" src={peopleImg} alt="" />
    </div>
  );
};

export default Avatar;
