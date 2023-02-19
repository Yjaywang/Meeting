import {
  setAttendCount,
  setInitLoading,
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

let localStream;
const constrain = {
  video: true,
  audio: { width: "480", height: "360" },
};
export const startCall = async (isHost, username, roomId = "", avatar) => {
  try {
    await fetchTURNCredentials();
    localStream = await navigator.mediaDevices.getUserMedia(constrain);
    console.log("receive local stream success!");
    //selfSocketId not update yet
    const selfSocketId = store.getState().selfSocketId;

    //observe the video region height and width size
    const videoRegionContainerEl = document.querySelector(
      ".video-region-container"
    );
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

  // peers[connUserSocketId].on("track", (track, stream) => {
  //   console.log(`triiiiiiiiiiiiger Received track of kind ${track.kind}`);
  //   // console.log(stream.getAudioTracks()[0].getSettings());
  // });
};

export function removePeerConnection(data) {
  const { socketId } = data;
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
function addStream(isHost, stream, connUserSocketId, username, avatar) {
  //rename self dom id
  const selfSocketId = store.getState().selfSocketId;
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

  const videosPortalEl = document.querySelector("#videos-portal");
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
  imgVideoAvatar.classList.add("video-avatar", "hide");
  imgVideoAvatar.id = `video-avatar-${connUserSocketId}`;
  divVideoAvatarContainerEl.appendChild(imgVideoAvatar);
  divVideoContainer.appendChild(divVideoAvatarContainerEl);

  const divNameContainer = document.createElement("div");
  divNameContainer.classList.add("video-name-container");

  const imgVideoMic = document.createElement("img");
  imgVideoMic.classList.add("video-mic-img");
  imgVideoMic.id = `mic-img-${connUserSocketId}`;
  imgVideoMic.src = MicOffImg;
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

  //declare add new user dom
  const attendCount = store.getState().attendCount;
  store.dispatch(setAttendCount(attendCount + 1));
  console.log("attendee counts", attendCount + 1);
  console.log("add", username);
}

/////////////////////buttons////////////////////////////////////////////////////////////////////////////////
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
        sendMicDataThroughDataChannel(micData);
      }

      storeMicIntervalData.previousResult = result;
    }
  }, 200);

  if (isMuted) {
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
    replaceStreamTrack(shareScreenStream);
  } else {
    replaceStreamTrack(localStream);
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
function toggleMicStatus(data) {
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
  const { isShare, selfSocketId } = data;
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

function toggleCamStatus(data) {
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
  if (!document.querySelector("#video-emotion-")) {
    const videoEmotionEl = document.querySelector(
      `#video-emotion-${selfSocketId}`
    );
    videoEmotionEl.textContent = emotion;
  } else {
    const videoEmotionEl = document.querySelector(`#video-emotion-`);
    videoEmotionEl.textContent = emotion;
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
  const statusData = {
    dataSource: "toggle share status",
    isShare: isShare,
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
