import { setInitLoading, setMessages } from "../store/actions";
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

let localStream;
const constrain = {
  video: true,
  audio: { width: "480", height: "360" },
};
export const startCall = async (isHost, username, roomId = null) => {
  try {
    await fetchTURNCredentials();
    localStream = await navigator.mediaDevices.getUserMedia(constrain);
    console.log("receive local stream success!");
    //selfSocketId not update yet
    const selfSocketId = store.getState().selfSocketId;

    //add resize event
    window.onresize = function () {
      const videoRegionContainerEl = document.querySelector(
        ".video-region-container"
      );
      console.log(
        "Window size changed to: ",
        videoRegionContainerEl.offsetWidth,
        "x",
        videoRegionContainerEl.offsetHeight
      );
    };

    //create dom
    addStream(isHost, localStream, selfSocketId, username);
    store.dispatch(setInitLoading(false)); //disable loading svg
    isHost
      ? hostMeeting(isHost, username)
      : joinMeeting(isHost, username, roomId);
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
    //connUserSocketId is new comer, create new comer dom
    attendees.forEach((attendee) => {
      if (attendee.socketId === connUserSocketId) {
        newComerIsHost = attendee.isHost;
      }
    });
    addStream(newComerIsHost, stream, connUserSocketId, username);
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

    const MicStatusData = JSON.parse(data);
    if (MicStatusData.dataSource === "toggle mic status") {
      toggleMicStatus(MicStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object

    const CamStatusData = JSON.parse(data);
    if (CamStatusData.dataSource === "toggle cam status") {
      toggleCamStatus(CamStatusData);
    }
  });

  peers[connUserSocketId].on("track", (track, stream) => {
    console.log(`triiiiiiiiiiiiger Received track of kind ${track.kind}`);
    // console.log(stream.getAudioTracks()[0].getSettings());
  });
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
}

export function signalingDataHandler(data) {
  //add signal data to peers to make connection, note that here socket id is peer's, not new comer
  peers[data.connUserSocketId].signal(data.signal);
}
//////////////////////////////////////////video dom////////////////////////////////
function addStream(isHost, stream, connUserSocketId, username) {
  console.log("add", username);

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

      containerEl.id = `video-container-${selfSocketId}`;
      videoMicEl.id = `mic-img-${selfSocketId}`;
      videoVolBarEl.id = `vol-bar-${selfSocketId}`;
      videoNameEl.id = `username-${selfSocketId}`;
      videoElementEl.id = `video-${selfSocketId}`;
      videoAvatarImgEl.id = `video-avatar-${selfSocketId}`;
    }
  } catch (error) {
    console.log("modify self dom id error: ", error);
  }

  const videosPortalEl = document.querySelector("#videos-portal");
  const divVideoContainer = document.createElement("div");
  divVideoContainer.classList.add("video-container");
  divVideoContainer.id = `video-container-${connUserSocketId}`;

  const imgVideoAvatar = document.createElement("img");
  imgVideoAvatar.src = peopleImg;
  imgVideoAvatar.classList.add("video-avatar", "hide");
  imgVideoAvatar.id = `video-avatar-${connUserSocketId}`;
  divVideoContainer.appendChild(imgVideoAvatar);

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
  divNameGroup.classList.add("video-name-group");
  spanHost.textContent = " (Host)";
  divName.classList.add("video-name");
  divName.id = `username-${connUserSocketId}`;
  divName.textContent = username;
  if (isHost) {
    divNameGroup.appendChild(divName);
    divNameGroup.appendChild(spanHost);
  } else {
    divNameGroup.appendChild(divName);
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
  const { username, selfSocketId, avgAudioLevel, result } = data;

  if (!document.querySelector("#video-container-")) {
    const containerEl = document.querySelector(
      `#video-container-${selfSocketId}`
    );
    console.log("el   ", `#video-container-${selfSocketId}`);
    // console.log("containerEl", containerEl);
    // console.log("selfSocketId", selfSocketId);
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

////////////////////////message///////////////////////////
function appendNewMessage(newMessageData) {
  //get the messages state from redux
  const messages = store.getState().messages;
  //append new message to messages
  store.dispatch(setMessages([...messages, newMessageData]));
}

export function sendMsgDataThroughDataChannel(messageContent) {
  const username = store.getState().username;
  const localMsgData = {
    dataSource: "chat room",
    content: messageContent,
    username: username,
    createByMe: true,
  };
  //append to state, render your page
  appendNewMessage(localMsgData);

  //channel data prepare to peers except you
  const messageDataToChannel = {
    dataSource: "chat room",
    content: messageContent,
    username: username,
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
  const { isMuted, username, selfSocketId } = data;
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
function toggleCamStatus(data) {
  const { isCamOff, username, selfSocketId } = data;
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
