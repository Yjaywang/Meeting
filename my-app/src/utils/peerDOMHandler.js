import { setAttendCount, setIsOtherShare } from "../store/actions";
import store from "../store/store";
import MicOnImg from "../assets/images/mic_open.svg";
import MicOffImg from "../assets/images/mic_close.svg";
import CamOnImg from "../assets/images/cam_open.svg";
import CamOffImg from "../assets/images/cam_close.svg";
import peopleImg from "../assets/images/people.svg";
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
//-----------------handle mic status change--------------------------------------------------
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
//-----------------handle recording status change--------------------------------------------------
export function toggleRecordingStatus(data) {
  const { isRecording, selfSocketId } = data;
  const attendeeRecordingEl = document.querySelector(
    `#attendee-recording-${selfSocketId}`
  );
  if (!document.querySelector("#video-recording-")) {
    const videoRecordingEl = document.querySelector(
      `#video-recording-${selfSocketId}`
    );
    if (isRecording) {
      attendeeRecordingEl.classList.remove("hide");
      videoRecordingEl.classList.remove("hide");
    } else {
      attendeeRecordingEl.classList.add("hide");
      videoRecordingEl.classList.add("hide");
    }
  } else {
    const videoRecordingEl = document.querySelector(`#video-recording-`);
    if (isRecording) {
      attendeeRecordingEl.classList.remove("hide");
      videoRecordingEl.classList.remove("hide");
    } else {
      attendeeRecordingEl.classList.add("hide");
      videoRecordingEl.classList.add("hide");
    }
  }
}
//-----------------handle sharing status change--------------------------------------------------
export function toggleShareStatus(data) {
  const { isShare, isCamOff, selfSocketId } = data;
  const yourselfSocketId = store.getState().selfSocketId;
  const videoRegionWidth = store.getState().videoRegionWidth;
  const videoRegionHeight = store.getState().videoRegionHeight;

  if (selfSocketId !== yourselfSocketId) {
    //this part for others page setting
    //if I'm sharing, don't touch otherSharing state
    store.dispatch(setIsOtherShare(isShare));
    const videoContainerEls = document.querySelectorAll(".video-container");
    const videoPortalEl = document.querySelector(".videos-portal");
    const videoRegionEl = document.querySelector(".video-region");
    if (isShare) {
      for (let videoContainerEl of videoContainerEls) {
        if (videoContainerEl.id === `video-container-${selfSocketId}`) {
          const videoAvatarEl = videoContainerEl.querySelector(
            ".video-avatar-container"
          );
          videoAvatarEl.classList.add("hide");
          videoContainerEl.classList.add("sharing-video-container");
          //initialize other sharing layout width and height
          videoContainerEl.style.width = `${videoRegionWidth}px`;
          videoContainerEl.style.height = `${videoRegionHeight - 195}px`;
        } else {
          videoContainerEl.classList.add("sharing-viewer-video-container");
        }
      }
      videoPortalEl.classList.add("sharing-video-portal");
      videoRegionEl.classList.add("sharing-video-region");
    } else {
      for (let videoContainerEl of videoContainerEls) {
        if (videoContainerEl.id === `video-container-${selfSocketId}`) {
          const videoAvatarEl = videoContainerEl.querySelector(
            ".video-avatar-container"
          );

          if (isCamOff) {
            videoAvatarEl.classList.remove("hide");
          }
          videoContainerEl.classList.remove("sharing-video-container");
        } else {
          videoContainerEl.classList.remove("sharing-viewer-video-container");
        }
      }
      videoPortalEl.classList.remove("sharing-video-portal");
      videoRegionEl.classList.remove("sharing-video-region");
      videoPortalEl.style.removeProperty("width");
    }
  } else {
    //this part for you are sharing
    const videoContainerEls = document.querySelectorAll(".video-container");
    const videoPortalEl = document.querySelector(".videos-portal");
    const videoRegionEl = document.querySelector(".video-region");

    if (isShare) {
      for (let videoContainerEl of videoContainerEls) {
        videoContainerEl.classList.add("sharing-viewer-video-container");
      }
      videoPortalEl.classList.add("sharing-video-portal");
      videoRegionEl.classList.add("sharing-video-region");
    } else {
      for (let videoContainerEl of videoContainerEls) {
        videoContainerEl.classList.remove("sharing-viewer-video-container");
      }
      videoPortalEl.classList.remove("sharing-video-portal");
      videoRegionEl.classList.remove("sharing-video-region");
      videoPortalEl.style.removeProperty("width");
    }
  }

  const attendeeShareEl = document.querySelector(
    `#attendee-share-${selfSocketId}`
  );
  if (!document.querySelector("#user-status-")) {
    const videoNameStatusEl = document.querySelector(
      `#user-status-${selfSocketId}`
    );
    if (isShare) {
      videoNameStatusEl.textContent = "(sharing)";
      attendeeShareEl.textContent = "(sharing)";
    } else {
      videoNameStatusEl.textContent = "";
      attendeeShareEl.textContent = "";
    }
  } else {
    const videoNameStatusEl = document.querySelector(`#user-status-`);
    if (isShare) {
      videoNameStatusEl.textContent = "(sharing)";
      attendeeShareEl.textContent = "(sharing)";
    } else {
      videoNameStatusEl.textContent = "";
      attendeeShareEl.textContent = "";
    }
  }
}
//-----------------handle cam status change--------------------------------------------------
export function toggleCamStatus(data) {
  const { isCamOff, selfSocketId } = data;
  const attendeeImgEl = document.querySelector(
    `#attendee-cam-img-${selfSocketId}`
  );
  if (!document.querySelector("#video-avatar-")) {
    const videoAvatarImgEl = document.querySelector(
      `#video-avatar-${selfSocketId}`
    );
    if (isCamOff) {
      attendeeImgEl.src = CamOffImg;
      videoAvatarImgEl.classList.remove("hide");
    } else {
      attendeeImgEl.src = CamOnImg;
      videoAvatarImgEl.classList.add("hide");
    }
  } else {
    const videoAvatarImgEl = document.querySelector(`#video-avatar-`);
    if (isCamOff) {
      attendeeImgEl.src = CamOffImg;
      videoAvatarImgEl.classList.remove("hide");
    } else {
      attendeeImgEl.src = CamOnImg;
      videoAvatarImgEl.classList.add("hide");
    }
  }
}
//-----------------handle emotion status change--------------------------------------------------
export function showEmotion(data) {
  const { emotion, selfSocketId } = data;
  const audioEffect = new Audio(soundEffect);

  if (!document.querySelector("#video-emotion-")) {
    const videoEmotionEl = document.querySelector(
      `#video-emotion-${selfSocketId}`
    );
    videoEmotionEl.textContent = emotion;
    if (emotion) {
      audioEffect.play();
    }
  } else {
    const videoEmotionEl = document.querySelector(`#video-emotion-`);
    videoEmotionEl.textContent = emotion;
    if (emotion) {
      audioEffect.play();
    }
  }
}

//-----------------update new comer's video state--------------------------------------------------
export function updateVideoState(data) {
  const { videoEnabledState, selfSocketId } = data;

  const videoAvatarEl = document.querySelector(`#video-avatar-${selfSocketId}`);
  const attendeeCamEl = document.querySelector(
    `#attendee-cam-img-${selfSocketId}`
  );

  if (!videoEnabledState) {
    videoAvatarEl.classList.remove("hide");
    attendeeCamEl.src = CamOffImg;
  } else {
    videoAvatarEl.classList.add("hide");
    attendeeCamEl.src = CamOnImg;
  }
}

//-----------------update new comer's mic state--------------------------------------------------
export function updateAudioState(data) {
  const { audioEnabledState, selfSocketId } = data;

  const videoMicEl = document.querySelector(`#mic-img-${selfSocketId}`);
  const attendeeMicEl = document.querySelector(
    `#attendee-mic-img-${selfSocketId}`
  );
  if (!audioEnabledState) {
    videoMicEl.src = MicOffImg;
    attendeeMicEl.src = MicOffImg;
  } else {
    videoMicEl.src = MicOnImg;
    attendeeMicEl.src = MicOnImg;
  }
}

//-----------------update new comer's sharing state--------------------------------------------------
export function updateSharingState(data) {
  const { isShare, selfSocketId } = data;

  const videoRegionWidth = store.getState().videoRegionWidth;
  const videoRegionHeight = store.getState().videoRegionHeight;

  if (!isShare) {
    return;
  } else {
    store.dispatch(setIsOtherShare(isShare));
    const videoContainerEls = document.querySelectorAll(".video-container");
    const videoPortalEl = document.querySelector(".videos-portal");
    const videoRegionEl = document.querySelector(".video-region");

    for (let videoContainerEl of videoContainerEls) {
      if (videoContainerEl.id === `video-container-${selfSocketId}`) {
        const videoAvatarEl = videoContainerEl.querySelector(
          ".video-avatar-container"
        );
        videoAvatarEl.classList.add("hide");
        videoContainerEl.classList.add("sharing-video-container");
        //initialize other sharing layout width and height
        videoContainerEl.style.width = `${videoRegionWidth}px`;
        videoContainerEl.style.height = `${videoRegionHeight - 195}px`;
      } else {
        videoContainerEl.classList.add("sharing-viewer-video-container");
      }
    }
    videoPortalEl.classList.add("sharing-video-portal");
    videoRegionEl.classList.add("sharing-video-region");
  }

  const attendeeShareEl = document.querySelector(
    `#attendee-share-${selfSocketId}`
  );
  if (!document.querySelector("#user-status-")) {
    const videoNameStatusEl = document.querySelector(
      `#user-status-${selfSocketId}`
    );
    if (isShare) {
      videoNameStatusEl.textContent = "(sharing)";
      attendeeShareEl.textContent = "(sharing)";
    } else {
      videoNameStatusEl.textContent = "";
      attendeeShareEl.textContent = "";
    }
  } else {
    const videoNameStatusEl = document.querySelector(`#user-status-`);
    if (isShare) {
      videoNameStatusEl.textContent = "(sharing)";
      attendeeShareEl.textContent = "(sharing)";
    } else {
      videoNameStatusEl.textContent = "";
      attendeeShareEl.textContent = "";
    }
  }
}

//-----------------update new comer's recording state--------------------------------------------------
export function updateRecordingState(data) {
  const { isRecording, selfSocketId } = data;

  if (!isRecording) {
    return;
  } else {
    const attendeeRecordingEl = document.querySelector(
      `#attendee-recording-${selfSocketId}`
    );
    if (!document.querySelector("#video-recording-")) {
      const videoRecordingEl = document.querySelector(
        `#video-recording-${selfSocketId}`
      );
      attendeeRecordingEl.classList.remove("hide");
      videoRecordingEl.classList.remove("hide");
    } else {
      const videoRecordingEl = document.querySelector(`#video-recording-`);
      attendeeRecordingEl.classList.remove("hide");
      videoRecordingEl.classList.remove("hide");
    }
  }
}

//-----------------if the one is sharing and sudden leaving,
//can set other sharing state to false and handle whole dom back--------------------------------------------------
export function removeLeavePeerSharingState(data) {
  const { socketId } = data;

  const videoContainerEl = document.querySelector(
    `#video-container-${socketId}`
  );
  const isShare = videoContainerEl.classList.contains(
    "sharing-video-container"
  );
  if (isShare) {
    store.dispatch(setIsOtherShare(false));
    const videoContainerEls = document.querySelectorAll(".video-container");
    const videoPortalEl = document.querySelector(".videos-portal");
    const videoRegionEl = document.querySelector(".video-region");

    for (let videoContainerEl of videoContainerEls) {
      if (videoContainerEl.id === `video-container-${socketId}`) {
        const videoAvatarEl = videoContainerEl.querySelector(
          ".video-avatar-container"
        );
        videoAvatarEl.classList.remove("hide");
        videoContainerEl.classList.remove("sharing-video-container");
      } else {
        videoContainerEl.classList.remove("sharing-viewer-video-container");
      }
    }
    videoPortalEl.classList.remove("sharing-video-portal");
    videoRegionEl.classList.remove("sharing-video-region");
    videoPortalEl.style.removeProperty("width");
  }
}
