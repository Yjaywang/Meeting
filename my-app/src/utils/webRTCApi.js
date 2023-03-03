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
import * as peerDOMHandler from "./peerDOMHandler";

let localStream;
let shareStream;
//-----------------start call--------------------------------------------------
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
    peerDOMHandler.addStream(
      isHost,
      localStream,
      selfSocketId,
      username,
      avatar
    );
    store.dispatch(setInitLoading(false)); //disable loading svg

    isHost
      ? hostMeeting(isHost, username, avatar)
      : joinMeeting(isHost, username, roomId, avatar);
  } catch (error) {
    console.log(`startCall error: ${error}`);
  }
};
//-----------------peer connection--------------------------------------------------
let peers = {}; //{[{socketId:socketId}, ....]}
let streams = [];
//allow us get internet connection info
const getConfiguration = () => {
  const turnIceServers = getTURNCredentials();
  if (turnIceServers) {
    console.log("add TURN server to iceServers");
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
    peerDOMHandler.addStream(
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
      peerDOMHandler.micVolume(micData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const micStatusData = JSON.parse(data);
    if (micStatusData.dataSource === "toggle mic status") {
      peerDOMHandler.toggleMicStatus(micStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const camStatusData = JSON.parse(data);
    if (camStatusData.dataSource === "toggle cam status") {
      peerDOMHandler.toggleCamStatus(camStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const recordingStatusData = JSON.parse(data);
    if (recordingStatusData.dataSource === "toggle recording status") {
      peerDOMHandler.toggleRecordingStatus(recordingStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const shareStatusData = JSON.parse(data);
    if (shareStatusData.dataSource === "toggle share status") {
      peerDOMHandler.toggleShareStatus(shareStatusData);
    }
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const emotionData = JSON.parse(data);
    if (emotionData.dataSource === "send emotion") {
      showEmotion(emotionData);
    }
  });
};
//-----------------peer leave remove dom--------------------------------------------------
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

//add signal data to peers to make connection, note that here socket id is peer's, not new comer
export function signalingDataHandler(data) {
  peers[data.connUserSocketId].signal(data.signal);
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
    clearInterval(detectMic);
    clearInterval(storeMicIntervalData.id); //clear previous id
  } else {
    storeMicIntervalData.id = detectMic; //remember id wait for next time delete it
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
  peerDOMHandler.micVolume(micDataToChannel);

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

//-----------------for new comer getting the screen sharing stream--------------------------------------------------
function initialReplaceStreamTrack(stream = null, initializePeer) {
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
//-----------------replace by screen sharing stream--------------------------------------------------
function replaceStreamTrack(stream = null) {
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
//-----------------recording part--------------------------------------------------
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
  peerDOMHandler.toggleMicStatus(statusData);
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
  peerDOMHandler.toggleCamStatus(statusData);
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
  peerDOMHandler.toggleRecordingStatus(statusData);
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
  peerDOMHandler.toggleShareStatus(statusData);
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
