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

let localStream;
let shareStream;

export const previewCall = async (constrain) => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(constrain);
    console.log("receive local stream success!");
    return localStream;
  } catch (error) {
    console.log("error: ", error);
  }
};
export const startCall = async (isHost, username, roomId = "", avatar) => {
  try {
    await fetchTURNCredentials();

    //selfSocketId not update yet
    const selfSocketId = store.getState().selfSocketId;
    const isCamOff = store.getState().isCamOff;
    const isMuted = store.getState().isMuted;

    //observe the room-page-panel-I as video region height and width size
    const videoRegionContainerEl = document.querySelector(".room-page-panel-I");
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        store.dispatch(setVideoRegionHeight(entry.contentRect.height));
        store.dispatch(setVideoRegionWidth(entry.contentRect.width));
      }
    });
    observer.observe(videoRegionContainerEl);

    //create dom
    addStream(isHost, localStream, selfSocketId, username, avatar);
    store.dispatch(setInitLoading(false)); //disable loading svg

    isHost
      ? hostMeeting(isHost, username, avatar)
      : joinMeeting(isHost, username, roomId, avatar);
  } catch (error) {
    console.log(`startCall error: ${error}`);
  }
};

let peers = {}; //{[{socketId:socketId}, ....]}
let streams = [];
//allow us get internet connection info
const getConfiguration = () => {
  const turnIceServers = getTURNCredentials();
  if (turnIceServers) {
    console.log("use TURN server");
    console.log(turnIceServers);
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        ...turnIceServers,
      ],
    };
  } else {
    console.warn("STUN server only");
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
  }
};

const messengerChannel = "messenger";

export const newPeerConnect = (
  connUserSocketId,
  username,
  isMakeConnection
) => {
  const configuration = getConfiguration();
  //all user except you
  peers[connUserSocketId] = new Peer({
    initiator: isMakeConnection,
    config: configuration,
    stream: localStream, //attendee's localStream
    channelName: messengerChannel,
  });
  peers[connUserSocketId].on("error", (err) => {
    console.log("error: ", err);
  });

  peers[connUserSocketId].on("signal", (data) => {
    //webRTC offer, answer, ice candidates
    console.log("signal");

    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
      username: username,
    };
    webSocketApi.signalPeerData(signalData);
  });

  peers[connUserSocketId].on("stream", (stream) => {
    console.log("new stream");

    const attendees = store.getState().attendees;
    let newComerIsHost = false;
    let newComerAvatar = "";
    //connUserSocketId is new comer, create new comer dom
    attendees.forEach((attendee) => {
      if (attendee.socketId === connUserSocketId) {
        newComerIsHost = attendee.isHost;
        newComerAvatar = attendee.avatar;
      }
    });
    addStream(
      newComerIsHost,
      stream,
      connUserSocketId,
      username,
      newComerAvatar
    );
    streams = [...streams, stream];
  });
  let initializePeer = peers[connUserSocketId];
  peers[connUserSocketId].on("connect", () => {
    //once connect, those initial state should update
    //send my current status let new comer modify my state and vice versa.
    sendVideoTrackStateToPeer(initializePeer);
    sendAudioTrackStateToPeer(initializePeer);
    sendSharingStateToPeer(initializePeer);
    sendRecordingStateToPeer(initializePeer);

    const isShare = store.getState().isShare;
    if (isShare) {
      initialReplaceStreamTrack(shareStream, initializePeer);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const sharingStateData = JSON.parse(data);
    if (sharingStateData.dataSource === "is sharing") {
      //update new comer's state
      updateSharingState(sharingStateData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const recordingStateData = JSON.parse(data);
    if (recordingStateData.dataSource === "is recording") {
      //update new comer's state
      updateRecordingState(recordingStateData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const videoTrackStateData = JSON.parse(data);
    if (videoTrackStateData.dataSource === "video track") {
      //update new comer's state
      updateVideoState(videoTrackStateData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const audioTrackStateData = JSON.parse(data);
    if (audioTrackStateData.dataSource === "audio track") {
      console.log("aaaa", audioTrackStateData);
      //update new comer's state
      updateAudioState(audioTrackStateData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const messageData = JSON.parse(data);
    if (messageData.dataSource === "chat room") {
      appendNewMessage(messageData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const micData = JSON.parse(data);
    if (micData.dataSource === "mic data") {
      micVolume(micData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const micStatusData = JSON.parse(data);
    if (micStatusData.dataSource === "toggle mic status") {
      toggleMicStatus(micStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const camStatusData = JSON.parse(data);
    if (camStatusData.dataSource === "toggle cam status") {
      toggleCamStatus(camStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const recordingStatusData = JSON.parse(data);
    if (recordingStatusData.dataSource === "toggle recording status") {
      toggleRecordingStatus(recordingStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const shareStatusData = JSON.parse(data);
    if (shareStatusData.dataSource === "toggle share status") {
      toggleShareStatus(shareStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const emotionData = JSON.parse(data);
    if (emotionData.dataSource === "send emotion") {
      showEmotion(emotionData);
    }
  });

  peers[connUserSocketId].on("track", (track, stream) => {
    // console.log("aaaaaaa", stream.getAudioTracks());
    // console.log("vvvvvvvvvvv", stream.getVideoTracks());
    // console.log("sttttttttttream", stream);
    // if (track.kind === "video") {
    //   const isCameraOpen = track.enabled;
    //   console.log(`Camera is ${isCameraOpen ? "open" : "closed"}`);
    // }
    // if (track.kind === "audio") {
    //   const isMicOpen = track.enabled;
    //   console.log(`Mic is ${isMicOpen ? "open" : "closed"}`);
    // }
  });
};

export function removePeerConnection(data) {
  const { socketId } = data;
  // const isShare = store.getState().isShare;
  // //if leave room but still sharing, will send message to other to change isOtherShare state
  // if (isShare) {
  //   sendShareStatus(!isShare);
  // }

  const videoContainerEl = document.querySelector(
    `#video-container-${socketId}`
  );
  const videoElementEl = document.querySelector(`#video-${socketId}`);
  if (videoContainerEl && videoElementEl) {
    const tracks = videoElementEl.srcObject.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    videoElementEl.srcObject = null;
    videoElementEl.remove();
    videoContainerEl.remove();

    if (peers[socketId]) {
      peers[socketId].destroy();
      delete peers[socketId];
    }
  }

  const attendCount = store.getState().attendCount;
  store.dispatch(setAttendCount(attendCount - 1));
  console.log("attendee counts", attendCount - 1);
}

export function signalingDataHandler(data) {
  //add signal data to peers to make connection, note that here socket id is peer's, not new comer
  peers[data.connUserSocketId].signal(data.signal);
}
//////////////////////////////////////////video dom////////////////////////////////
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

function addStream(isHost, stream, connUserSocketId, username, avatar) {
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

function updateVideoState(data) {
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

function updateAudioState(data) {
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

function updateSharingState(data) {
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

  const attendeeShareEl = document.querySelector(`#attendee-share-${socketId}`);
  if (!document.querySelector("#user-status-")) {
    const videoNameStatusEl = document.querySelector(
      `#user-status-${socketId}`
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

function updateRecordingState(data) {
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

/////////////////////buttons////////////////////////////////////////////////////////////////////////////////
export function togglePreviewMicBtn(isMuted) {
  //if isMute = true => enabled = false
  localStream.getAudioTracks()[0].enabled = isMuted ? false : true;
}

export function toggleMicBtn(isMuted) {
  //if isMute = true => enabled = false
  localStream.getAudioTracks()[0].enabled = isMuted ? false : true;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 1024;

  const source = audioContext.createMediaStreamSource(localStream);
  const gainNode = audioContext.createGain();

  gainNode.gain.value = 700; // Increase the gain by 700x
  source.connect(gainNode);
  gainNode.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  const audioLevels = [];

  let detectMic = window.setInterval(() => {
    analyser.getByteTimeDomainData(dataArray);
    //audio level: 0~255, mic off=128
    const audioLevel =
      dataArray.reduce((sum, value) => sum + value) / dataArray.length;
    audioLevels.push(audioLevel);

    //use moving average to prevent level sudden drop.
    if (audioLevels.length >= 5) {
      // audio average level in 1 second
      const averageAudioLevel =
        audioLevels.reduce((sum, value) => sum + value) / audioLevels.length;
      //mic off=128
      const threshold = 128;
      let result = "not speaking";
      if (averageAudioLevel > threshold) {
        result = "speaking";
      } else {
        result = "not speaking";
      }
      //remove first element
      audioLevels.splice(0, audioLevels.length - 5);

      if (
        result === "speaking" ||
        result !== storeMicIntervalData.previousResult
      ) {
        //send to peer
        //speaking data pass, and no speaking only 1 time
        const micData = {
          result: result,
          avgAudioLevel: averageAudioLevel,
        };
        console.log(micData);
        sendMicDataThroughDataChannel(micData);
      }

      storeMicIntervalData.previousResult = result;
    }
  }, 200);

  if (isMuted) {
    const resetMicData = {
      result: "not speaking",
      avgAudioLevel: 128,
    };
    sendMicDataThroughDataChannel(resetMicData);
    audioContext.close();
    console.log("audioContext", audioContext);
    clearInterval(detectMic);
    clearInterval(storeMicIntervalData.id); //clear previous id
  } else {
    storeMicIntervalData.id = detectMic; //remember id wait for next time delete it
  }
}

function micVolume(data) {
  const { selfSocketId, avgAudioLevel, result } = data;

  if (!document.querySelector("#video-container-")) {
    const containerEl = document.querySelector(
      `#video-container-${selfSocketId}`
    );
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

function sendMicDataThroughDataChannel(micData) {
  const username = store.getState().username;
  const selfSocketId = store.getState().selfSocketId;
  const micDataToChannel = {
    dataSource: "mic data",
    result: micData.result,
    username: username,
    selfSocketId: selfSocketId,
    avgAudioLevel: micData.avgAudioLevel,
  };
  //append to state, render your page
  micVolume(micDataToChannel);

  //object to JSON, JSON can pass the data channel
  const stringifyMicDataToChannel = JSON.stringify(micDataToChannel);
  //send message to all user except you
  for (let socketId in peers) {
    peers[socketId].send(stringifyMicDataToChannel);
  }
}

export function toggleCamBtn(isCamOff) {
  localStream.getVideoTracks()[0].enabled = isCamOff ? false : true;
}

export function toggleScreenSharing(isShare, shareScreenStream) {
  if (isShare) {
    shareStream = shareScreenStream;
    replaceStreamTrack(shareScreenStream);
  } else {
    shareStream = null;
    replaceStreamTrack(localStream);
  }
}

export function initialReplaceStreamTrack(stream = null, initializePeer) {
  for (let peersTrack in initializePeer.streams[0].getTracks()) {
    for (let shareTrack in stream.getTracks()) {
      if (
        initializePeer.streams[0].getTracks()[peersTrack].kind ===
        stream.getTracks()[shareTrack].kind
      ) {
        initializePeer.replaceTrack(
          initializePeer.streams[0].getTracks()[peersTrack],
          stream.getTracks()[shareTrack],
          initializePeer.streams[0]
        );
        break;
      }
    }
  }
}

export function replaceStreamTrack(stream = null) {
  for (let socketId in peers) {
    for (let peersTrack in peers[socketId].streams[0].getTracks()) {
      for (let shareTrack in stream.getTracks()) {
        if (
          peers[socketId].streams[0].getTracks()[peersTrack].kind ===
          stream.getTracks()[shareTrack].kind
        ) {
          peers[socketId].replaceTrack(
            peers[socketId].streams[0].getTracks()[peersTrack],
            stream.getTracks()[shareTrack],
            peers[socketId].streams[0]
          );
          break;
        }
      }
    }
  }
}

let recorderBackup = null;
export async function toggleScreenRecording(isRecording, recorder) {
  if (isRecording) {
    recorderBackup = recorder;
    startRecording(recorder);
  } else {
    const response = await stopRecording(recorderBackup);
    return response;
  }
}

function startRecording(recorder) {
  recorder.startRecording();
}

//need to use promise to await it fulfill, then return the resolve value
//so toggleScreenRecording can await stopRecording's response
async function stopRecording(recorder) {
  if (recorder) {
    return new Promise((resolve, reject) => {
      recorder.stopRecording(async function () {
        const blob = await recorder.getBlob();
        const roomId = store.getState().roomId;
        const selfSocketId = store.getState().selfSocketId;
        let formData = new FormData();
        formData.append("file", blob, `${roomId}-${selfSocketId}.webm`);
        formData.append("fileType", `${blob.type}`);
        formData.append("roomId", `${roomId}`);
        const response = await postRecording(formData);
        recorderBackup = null;
        //if success, resolve function will return response
        resolve(response);
      });
    });
  }
}

////////////////////////message///////////////////////////
function appendNewMessage(newMessageData) {
  //get the messages state from redux
  const messages = store.getState().messages;
  //append new message to messages
  store.dispatch(setMessages([...messages, newMessageData]));
}

export function sendMsgDataThroughDataChannel(messageContent) {
  const username = store.getState().username;
  const selfSocketId = store.getState().selfSocketId;
  const avatar = store.getState().avatar;
  const localMsgData = {
    dataSource: "chat room",
    content: messageContent,
    username: username,
    createByMe: true,
    selfSocketId: selfSocketId,
    avatar: avatar,
  };
  //append to state, render your page
  appendNewMessage(localMsgData);

  //channel data prepare to peers except you
  const messageDataToChannel = {
    dataSource: "chat room",
    content: messageContent,
    username: username,
    selfSocketId: selfSocketId,
    avatar: avatar,
  };
  //object to JSON, JSON can pass the data channel
  const stringifyMsgDataToChannel = JSON.stringify(messageDataToChannel);
  //send message to all user except you
  for (let socketId in peers) {
    peers[socketId].send(stringifyMsgDataToChannel);
  }
}

//////////////////////status change ////////////////////////////////////////////
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
function toggleRecordingStatus(data) {
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

function toggleShareStatus(data) {
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

function showEmotion(data) {
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

export function sendMicStatus(isMuted) {
  const username = store.getState().username;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    dataSource: "toggle mic status",
    isMuted: isMuted,
    username: username,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  toggleMicStatus(statusData);
  //object to JSON, JSON can pass the data channel
  const stringifyMicDataToChannel = JSON.stringify(statusData);
  //send message to all user except you
  for (let socketId in peers) {
    peers[socketId].send(stringifyMicDataToChannel);
  }
}
export function sendCamStatus(isCamOff) {
  const username = store.getState().username;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    dataSource: "toggle cam status",
    isCamOff: isCamOff,
    username: username,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  toggleCamStatus(statusData);
  //object to JSON, JSON can pass the data channel
  const stringifyCamDataToChannel = JSON.stringify(statusData);
  //send message to all user except you
  for (let socketId in peers) {
    peers[socketId].send(stringifyCamDataToChannel);
  }
}

export function sendRecordingStatus(isRecording) {
  const username = store.getState().username;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    dataSource: "toggle recording status",
    isRecording: isRecording,
    username: username,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  toggleRecordingStatus(statusData);
  //object to JSON, JSON can pass the data channel
  const stringifyRecordingDataToChannel = JSON.stringify(statusData);
  //send message to all user except you
  for (let socketId in peers) {
    peers[socketId].send(stringifyRecordingDataToChannel);
  }
}

export function sendShareStatus(isShare) {
  const username = store.getState().username;
  const selfSocketId = store.getState().selfSocketId;
  const isCamOff = store.getState().isCamOff;

  const statusData = {
    dataSource: "toggle share status",
    isShare: isShare,
    isCamOff: isCamOff,
    username: username,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  toggleShareStatus(statusData);
  //object to JSON, JSON can pass the data channel
  const stringifyShareDataToChannel = JSON.stringify(statusData);
  //send message to all user except you
  for (let socketId in peers) {
    peers[socketId].send(stringifyShareDataToChannel);
  }
}

export function sendEmotionStatus(emotion) {
  const username = store.getState().username;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    dataSource: "send emotion",
    emotion: emotion,
    username: username,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  showEmotion(statusData);
  //object to JSON, JSON can pass the data channel
  const stringifyEmotionDataToChannel = JSON.stringify(statusData);
  //send message to all user except you
  for (let socketId in peers) {
    peers[socketId].send(stringifyEmotionDataToChannel);
  }
}

export function sendVideoTrackStateToPeer(initializePeer) {
  const username = store.getState().username;
  const isCamOff = store.getState().isCamOff;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    dataSource: "video track",
    videoEnabledState: !isCamOff,
    username: username,
    selfSocketId: selfSocketId,
  };
  //object to JSON, JSON can pass the data channel
  const stringifyVideoTrackStateToChannel = JSON.stringify(statusData);
  //send message to new comer
  initializePeer.send(stringifyVideoTrackStateToChannel);
}

export function sendAudioTrackStateToPeer(initializePeer) {
  const username = store.getState().username;
  const isMuted = store.getState().isMuted;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    dataSource: "audio track",
    audioEnabledState: !isMuted,
    username: username,
    selfSocketId: selfSocketId,
  };
  //object to JSON, JSON can pass the data channel
  const stringifyAudioTrackStateToChannel = JSON.stringify(statusData);
  //send message to new comer
  initializePeer.send(stringifyAudioTrackStateToChannel);
}

export function sendSharingStateToPeer(initializePeer) {
  const username = store.getState().username;
  const isShare = store.getState().isShare;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    dataSource: "is sharing",
    isShare: isShare,
    username: username,
    selfSocketId: selfSocketId,
  };
  //object to JSON, JSON can pass the data channel
  const stringifyAudioTrackStateToChannel = JSON.stringify(statusData);
  //send message to new comer
  initializePeer.send(stringifyAudioTrackStateToChannel);
}

export function sendRecordingStateToPeer(initializePeer) {
  const username = store.getState().username;
  const isRecording = store.getState().isRecording;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    dataSource: "is recording",
    isRecording: isRecording,
    username: username,
    selfSocketId: selfSocketId,
  };
  //object to JSON, JSON can pass the data channel
  const stringifyAudioTrackStateToChannel = JSON.stringify(statusData);
  //send message to new comer
  initializePeer.send(stringifyAudioTrackStateToChannel);
}
