import React, { useEffect } from "react";
import streamImg from "../../assets/images/landing-page-stream.svg";
import chatImg from "../../assets/images/landing-page-chat.svg";
import recordingImg from "../../assets/images/record_start.svg";
import shareScreenImg from "../../assets/images/share_screen.svg";
import tensorflowImg from "../../assets/images/tensorflow_on.svg";
import demoBasicImg from "../../assets/images/demo-basic.png";
import demoRecordingImg from "../../assets/images/demo-recording.png";
import demoDetectImg from "../../assets/images/demo-tensorflow.gif";
import allHandPoseImg from "../../assets/images/all_hand_pose.png";

const Screen2: React.FC = () => {
  useEffect(() => {
    const slider = document.querySelector(".slider")!;
    const nextBtn = document.querySelector(".next-btn")!;
    const prevBtn = document.querySelector(".prev-btn")!;
    const slides = document.querySelectorAll(".slide");
    const slideIcons = document.querySelectorAll(".slide-icon");
    const numberOfSlides = slides.length;
    let slideNumber = 0;

    nextBtn.addEventListener("click", () => {
      slides.forEach((slide) => { slide.classList.remove("active"); });
      slideIcons.forEach((slideIcon) => { slideIcon.classList.remove("active"); });
      slideNumber++;
      if (slideNumber > numberOfSlides - 1) { slideNumber = 0; }
      slides[slideNumber].classList.add("active");
      slideIcons[slideNumber].classList.add("active");
    });

    prevBtn.addEventListener("click", () => {
      slides.forEach((slide) => { slide.classList.remove("active"); });
      slideIcons.forEach((slideIcon) => { slideIcon.classList.remove("active"); });
      slideNumber--;
      if (slideNumber < 0) { slideNumber = numberOfSlides - 1; }
      slides[slideNumber].classList.add("active");
      slideIcons[slideNumber].classList.add("active");
    });

    let playSlider: ReturnType<typeof setInterval>;
    let repeater = () => {
      playSlider = setInterval(function () {
        slides.forEach((slide) => { slide.classList.remove("active"); });
        slideIcons.forEach((slideIcon) => { slideIcon.classList.remove("active"); });
        slideNumber++;
        if (slideNumber > numberOfSlides - 1) { slideNumber = 0; }
        slides[slideNumber].classList.add("active");
        slideIcons[slideNumber].classList.add("active");
      }, 4000);
    };
    repeater();

    slider.addEventListener("mouseover", () => { clearInterval(playSlider); });
    slider.addEventListener("mouseout", () => { repeater(); });
  });
  return (
    <div className="w-full overflow-hidden flex justify-center gap-5 mx-auto flex-col">
      <div className="flex items-center w-full">
        <div className="bg-primary text-surface text-3xl font-bold h-[100px] w-[20%] text-center leading-[100px] max-[820px]:w-[30%] max-[570px]:text-xl max-[570px]:w-[40%]">Meeting</div>
        <div className="bg-surface-dark text-surface text-3xl font-bold h-[100px] flex-auto text-center break-words flex items-center justify-center max-[570px]:text-xl">
          <div>Solutions for modern team collaboration</div>
        </div>
      </div>
      <div className="slider group relative w-[1200px] h-[calc(100vh-150px)] mx-auto overflow-hidden max-[1200px]:w-[90%]">
        <div className="slide active flex justify-center mx-auto">
          <div className="screen-2-bottom-set-container flex flex-col justify-center items-start gap-[30px] mx-auto">
            <div>
              <div className="text-3xl font-bold">Real time streaming platform</div>
              <div className="text-xl">Make an instant connection with others</div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className="flex gap-5 items-center">
                <img className="w-[30px] object-cover" src={streamImg} alt="" />
                <div>Real time streaming</div>
              </div>
              <div className="flex gap-5 items-center">
                <img className="w-[30px] object-cover" src={chatImg} alt="" />
                <div>Real time messaging</div>
              </div>
            </div>
            <div className="screen-2-bottom-img-container flex gap-5 h-[400px] max-[1200px]:gap-[10px]">
              <img className="screen-2-bottom-demo-img w-full h-full object-cover rounded-xl drop-shadow-[0_0_0.2rem_gray] max-[820px]:h-[280px]" src={demoBasicImg} alt="" />
            </div>
          </div>
        </div>
        <div className="slide flex justify-center mx-auto">
          <div className="screen-2-bottom-set-container flex flex-col justify-center items-start gap-[30px] mx-auto">
            <div>
              <div className="text-3xl font-bold">Easy work</div>
              <div className="text-xl">Share your screen with others and make work easier</div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className="flex gap-5 items-center">
                <img className="w-[30px] object-cover" src={shareScreenImg} alt="" />
                <div>Screen sharing</div>
              </div>
              <div className="flex gap-5 items-center">
                <img className="w-[30px] object-cover" src={recordingImg} alt="" />
                <div>Recording</div>
              </div>
            </div>
            <div className="screen-2-bottom-img-container flex gap-5 h-[400px] max-[1200px]:gap-[10px]">
              <img className="screen-2-bottom-demo-img w-full h-full object-cover rounded-xl drop-shadow-[0_0_0.2rem_gray] max-[820px]:h-[280px]" src={demoRecordingImg} alt="" />
            </div>
          </div>
        </div>
        <div className="slide flex justify-center mx-auto">
          <div className="screen-2-bottom-set-container flex flex-col justify-center items-start gap-[30px] mx-auto">
            <div>
              <div className="text-3xl font-bold">Hand pose detection</div>
              <div className="text-xl">Express your emotions through hand poses, breaking the gap between virtual and reality</div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className="flex gap-5 items-center">
                <img className="w-[30px] object-cover" src={tensorflowImg} alt="" />
                <div>hand pose detection</div>
              </div>
            </div>
            <div className="screen-2-bottom-img-container flex gap-5 h-[400px] max-[1200px]:gap-[10px]">
              <img className="screen-2-bottom-demo-img-tf w-[70%] object-cover rounded-xl drop-shadow-[0_0_0.2rem_gray] max-[1200px]:w-[49%] max-[650px]:w-[200px] max-[570px]:w-[140px]" src={demoDetectImg} alt="" />
              <img className="screen-2-bottom-hand-pose-img h-full object-cover rounded-xl drop-shadow-[0_0_0.2rem_gray] max-[570px]:h-[200px]" src={allHandPoseImg} alt="" />
            </div>
          </div>
        </div>
        <div className="navigation h-[calc(100vh-150px)] flex items-center justify-between opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
          <div className="prev-btn z-[999] text-[50px] leading-[40px] cursor-pointer h-[50px] drop-shadow-[0_0_0.2rem_gray] rounded-tr-sm rounded-br-sm">{"<"}</div>
          <div className="next-btn z-[999] text-[50px] leading-[40px] cursor-pointer h-[50px] drop-shadow-[0_0_0.2rem_gray] rounded-tl-sm rounded-bl-sm">{">"}</div>
        </div>
        <div className="z-[999] flex justify-center">
          <div className="slide-icon active z-[999] w-5 h-[10px] -translate-y-[30px] mx-[6px] rounded-xs shadow-slider"></div>
          <div className="slide-icon z-[999] w-5 h-[10px] -translate-y-[30px] mx-[6px] rounded-xs shadow-slider"></div>
          <div className="slide-icon z-[999] w-5 h-[10px] -translate-y-[30px] mx-[6px] rounded-xs shadow-slider"></div>
        </div>
      </div>
    </div>
  );
};

export default Screen2;
