import React, { useEffect } from "react";

import peopleImg from "../../assets/images/people.svg";

const Avatar = () => {
  useEffect(() => {
    //add event listener to drawer
    const navAvatarImgEl = document.querySelector(".nav-avatar-img");
    const navDrawerContainerEl = document.querySelector(
      ".nav-drawer-container"
    );
    if (navAvatarImgEl) {
      navAvatarImgEl.addEventListener("click", () => {
        console.log("tttttt");
        navDrawerContainerEl.classList.toggle("hide");
      });
    }

    document.addEventListener("click", (e) => {
      if (
        !navDrawerContainerEl.contains(e.target) &&
        !navAvatarImgEl.contains(e.target)
      ) {
        console.log("sssss");
        navDrawerContainerEl.classList.add("hide");
      }
    });
  }, []);
  return (
    <div>
      <img className="nav-avatar-img" src={peopleImg} alt="" />
    </div>
  );
};

export default Avatar;
