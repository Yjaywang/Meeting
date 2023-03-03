import {
  setAttendCount,
  setInitLoading,
  setIsOtherShare,
  setMessages,
  setVideoRegionHeight,
  setVideoRegionWidth,
} from "../store/actions";
import store from "../store/store";
import { hostMeeting, joinMeeting } from "./webSocketApi";
import Peer from "simple-peer-light";
import * as webSocketApi from "./webSocketApi";
import { fetchTURNCredentials, getTURNCredentials } from "./turnServerApi";
import { storeMicIntervalData } from "../pages/RoomPage/StreamRegion/Btns/MicBtn";
import MicOnImg from "../assets/images/mic_open.svg";
import MicOffImg from "../assets/images/mic_close.svg";
import CamOnImg from "../assets/images/cam_open.svg";
import CamOffImg from "../assets/images/cam_close.svg";
import peopleImg from "../assets/images/people.svg";
import { postRecording } from "./fetchUserApi";
import soundEffect from "../assets/sounds/crrect_answer2.mp3";

//-----------------fix first user no socket id issue--------------------------------------------------
export function updateDomId(selfSocketId) {
  try {
    const containerEl = document.querySelector(".video-container");
    if (containerEl.id === "video-container-") {
      const videoMicEl = document.querySelector(".video-mic-img");
      const videoVolBarEl = document.querySelector(".video-vol-bar");
      const videoNameEl = document.querySelector(".video-name");
      const videoElementEl = document.querySelector(".video-element");
      const videoAvatarImgEl = document.querySelector(".video-avatar");
      const videoNameStatusEl = document.querySelector(".video-name-status");
      const videoNameHoseEl = document.querySelector(".video-name-host");
      const videoStatusContainerEl = document.querySelector(
        ".video-status-container"
      );
      const videoRecordingContainerEl = document.querySelector(
        ".video-recording-container"
      );
      const videoEmotionImgEl = document.querySelector(".video-emotion");

      containerEl.id = `video-container-${selfSocketId}`;
      videoMicEl.id = `mic-img-${selfSocketId}`;
      videoVolBarEl.id = `vol-bar-${selfSocketId}`;
      videoNameEl.id = `username-${selfSocketId}`;
      videoElementEl.id = `video-${selfSocketId}`;
      videoAvatarImgEl.id = `video-avatar-${selfSocketId}`;
      videoNameStatusEl.id = `user-status-${selfSocketId}`;
      videoNameHoseEl.id = `user-host-${selfSocketId}`;
      videoStatusContainerEl.id = `video-status-${selfSocketId}`;
      videoRecordingContainerEl.id = `video-recording-${selfSocketId}`;
      videoEmotionImgEl.id = `video-emotion-${selfSocketId}`;
    }
  } catch (error) {
    console.log("modify self dom id error: ", error);
  }
}
//-----------------add stream to room, construct the dom--------------------------------------------------
export function addStream(isHost, stream, connUserSocketId, username, avatar) {
  //rename self dom id
  const isOtherShare = store.getState().isOtherShare;
  const isCamOff = store.getState().isCamOff;
  const isMuted = store.getState().isMuted;

  const videosPortalEl = document.querySelector(".videos-portal");
  const divVideoContainer = document.createElement("div");
  divVideoContainer.classList.add("video-container");
  divVideoContainer.id = `video-container-${connUserSocketId}`;

  const divVideoStatusContainer = document.createElement("div");
  divVideoStatusContainer.classList.add("video-status-container");
  divVideoStatusContainer.id = `video-status-${connUserSocketId}`;

  const divVideoRecordingContainer = document.createElement("div");
  divVideoRecordingContainer.classList.add("video-recording-container", "hide");
  divVideoRecordingContainer.id = `video-recording-${connUserSocketId}`;

  const divVideoRecordingIcon = document.createElement("div");
  divVideoRecordingIcon.classList.add(
    "video-recording-icon",
    "recording-circle"
  );
  divVideoRecordingContainer.appendChild(divVideoRecordingIcon);

  const divVideoRecordingText = document.createElement("div");
  divVideoRecordingText.classList.add("video-recording-text");
  divVideoRecordingText.textContent = "REC";
  divVideoRecordingContainer.appendChild(divVideoRecordingText);
  divVideoStatusContainer.appendChild(divVideoRecordingContainer);
  divVideoContainer.appendChild(divVideoStatusContainer);

  const divVideoEmotion = document.createElement("div");
  divVideoEmotion.classList.add("video-emotion");
  divVideoEmotion.id = `video-emotion-${connUserSocketId}`;
  divVideoContainer.appendChild(divVideoEmotion);

  const imgVideoAvatar = document.createElement("img");
  const divVideoAvatarContainerEl = document.createElement("div");
  divVideoAvatarContainerEl.classList.add("video-avatar-container");
  imgVideoAvatar.src = avatar ? avatar : peopleImg;

  imgVideoAvatar.className = isCamOff ? "video-avatar" : "video-avatar hide";
  imgVideoAvatar.id = `video-avatar-${connUserSocketId}`;
  divVideoAvatarContainerEl.appendChild(imgVideoAvatar);
  divVideoContainer.appendChild(divVideoAvatarContainerEl);

  const divNameContainer = document.createElement("div");
  divNameContainer.classList.add("video-name-container");

  const imgVideoMic = document.createElement("img");
  imgVideoMic.classList.add("video-mic-img");
  imgVideoMic.id = `mic-img-${connUserSocketId}`;
  imgVideoMic.src = isMuted ? MicOffImg : MicOnImg;
  imgVideoMic.alt = "";
  divNameContainer.appendChild(imgVideoMic);

  const divVolBarContainer = document.createElement("div");
  const divVolBar = document.createElement("div");
  divVolBarContainer.classList.add("video-vol-bar-container");
  divVolBar.classList.add("video-vol-bar");
  divVolBar.id = `vol-bar-${connUserSocketId}`;
  divVolBarContainer.appendChild(divVolBar);
  divNameContainer.appendChild(divVolBarContainer);

  const divNameGroup = document.createElement("div");
  const divName = document.createElement("div");
  const spanHost = document.createElement("span");
  spanHost.classList.add("video-name-host");
  spanHost.id = `user-host-${connUserSocketId}`;
  const spanStatus = document.createElement("span");
  spanStatus.classList.add("video-name-status");
  spanStatus.id = `user-status-${connUserSocketId}`;
  divNameGroup.classList.add("video-name-group");
  divName.classList.add("video-name");
  divName.id = `username-${connUserSocketId}`;
  divName.textContent = username;
  if (isHost) {
    spanHost.textContent = " (Host)";
    divNameGroup.appendChild(divName);
    divNameGroup.appendChild(spanHost);
    divNameGroup.appendChild(spanStatus);
  } else {
    divNameGroup.appendChild(divName);
    divNameGroup.appendChild(spanHost);
    divNameGroup.appendChild(spanStatus);
  }
  divNameContainer.appendChild(divNameGroup);

  const divNameVolContainer = document.createElement("div");
  divNameVolContainer.classList.add("video-name-vol-container");
  divNameVolContainer.appendChild(divNameContainer);

  const VideoElement = document.createElement("video");
  VideoElement.classList.add("video-element");
  VideoElement.id = `video-${connUserSocketId}`;
  VideoElement.autoplay = true;
  VideoElement.muted = true;
  VideoElement.srcObject = stream;

  VideoElement.onloadedmetadata = () => {
    VideoElement.play();
  };

  divVideoContainer.appendChild(VideoElement);
  divVideoContainer.appendChild(divNameVolContainer);
  videosPortalEl.appendChild(divVideoContainer);

  if (isOtherShare) {
    const videoRegionEl = document.querySelector(".video-region");
    videoRegionEl.classList.add("sharing-video-region");
    videosPortalEl.classList.add("sharing-video-portal");
    divVideoContainer.classList.add("sharing-viewer-video-container");
  }

  //declare add new user dom
  const attendCount = store.getState().attendCount;
  store.dispatch(setAttendCount(attendCount + 1));
  console.log("attendee counts", attendCount + 1);
  console.log("add", username);
}

//-----------------show the volume change--------------------------------------------------
export function micVolume(data) {
  const { selfSocketId, avgAudioLevel, result } = data;

  if (!document.querySelector("#video-container-")) {
    const containerEl = document.querySelector(
      `#video-container-${selfSocketId}`
    );
    if (!containerEl.querySelector(".video-vol-bar")) {
      //if DOM still constructing, just return
      return;
    }
    const barEl = containerEl.querySelector(".video-vol-bar");
    if (result === "speaking") {
      containerEl.classList.add("video-container-speaking");
      if (Math.abs(((avgAudioLevel - 128) / 30) * 100) > 100) {
        barEl.style.height = `100%`;
      } else {
        barEl.style.height = `${Math.abs(((avgAudioLevel - 128) / 30) * 100)}%`;
      }
    } else {
      containerEl.classList.remove("video-container-speaking");
      barEl.style.height = `0%`;
    }
  } else {
    // for only 1 host in room condition
    const containerEl = document.querySelector("#video-container-");
    const barEl = containerEl.querySelector(".video-vol-bar");
    if (result === "speaking") {
      containerEl.classList.add("video-container-speaking");
      if (Math.abs(((avgAudioLevel - 128) / 30) * 100) > 100) {
        barEl.style.height = `100%`;
      } else {
        barEl.style.height = `${Math.abs(((avgAudioLevel - 128) / 30) * 100)}%`;
      }
    } else {
      containerEl.classList.remove("video-container-speaking");
      barEl.style.height = `0%`;
    }
  }
}

export function toggleMicStatus(data) {
  const { isMuted, selfSocketId } = data;
  if (!document.querySelector("#mic-img-")) {
    const attendeeImgEl = document.querySelector(
      `#attendee-mic-img-${selfSocketId}`
    );

    const videoImgEl = document.querySelector(`#mic-img-${selfSocketId}`);
    attendeeImgEl.src = isMuted ? MicOffImg : MicOnImg;
    videoImgEl.src = isMuted ? MicOffImg : MicOnImg;
  } else {
    const attendeeImgEl = document.querySelector(
      `#attendee-mic-img-${selfSocketId}`
    );

    const videoImgEl = document.querySelector(`#mic-img-`);
    attendeeImgEl.src = isMuted ? MicOffImg : MicOnImg;
    videoImgEl.src = isMuted ? MicOffImg : MicOnImg;
  }
}
