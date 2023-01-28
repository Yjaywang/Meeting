import { setInitLoading, setMessages } from "../store/actions";
import store from "../store/store";
import { hostMeeting, joinMeeting } from "./webSocketApi";
import Peer from "simple-peer-light";
import * as webSocketApi from "./webSocketApi";
import { fetchTURNCredentials, getTURNCredentials } from "./turnServerApi";

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

    showVideo(localStream, username);
    store.dispatch(setInitLoading(false)); //disable loading svg
    isHost ? hostMeeting(username) : joinMeeting(username, roomId);
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
    addStream(stream, connUserSocketId, username);
    streams = [...streams, stream];
  });

  peers[connUserSocketId].on("data", (data) => {
    //data format is json, need to parse it to object
    const messageData = JSON.parse(data);
    appendNewMessage(messageData);
  });
};

export function removePeerConnection(data) {
  const { socketId } = data;
  const videoContainerEl = document.querySelector(`#${socketId}`);
  const videoElementEl = document.querySelector(`#${socketId}-video`);
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
function showVideo(stream, username) {
  const videosPortalEl = document.querySelector("#videos-portal");

  const divVideoContainer = document.createElement("div");
  divVideoContainer.classList.add("video-container");

  const divNameContainer = document.createElement("div");
  const divName = document.createElement("div");
  divNameContainer.classList.add("video-name-container");
  divName.classList.add("video-name");
  divName.textContent = username;
  divNameContainer.appendChild(divName);

  const VideoElement = document.createElement("video");
  VideoElement.classList.add("video-element");
  VideoElement.autoplay = true;
  VideoElement.muted = true;
  VideoElement.srcObject = stream;

  VideoElement.onloadedmetadata = () => {
    VideoElement.play();
  };

  divVideoContainer.appendChild(VideoElement);
  divVideoContainer.appendChild(divNameContainer);
  videosPortalEl.appendChild(divVideoContainer);
}

function addStream(stream, connUserSocketId, username) {
  console.log("add", username);
  const videosPortalEl = document.querySelector("#videos-portal");
  const divVideoContainer = document.createElement("div");
  divVideoContainer.classList.add("video-container");
  divVideoContainer.id = connUserSocketId;

  const divNameContainer = document.createElement("div");
  const divName = document.createElement("div");
  divNameContainer.classList.add("video-name-container");
  divName.classList.add("video-name");
  divName.textContent = username;
  divNameContainer.appendChild(divName);

  const VideoElement = document.createElement("video");
  VideoElement.classList.add("video-element");
  VideoElement.id = `${connUserSocketId}-video`;
  VideoElement.autoplay = true;
  VideoElement.muted = true;
  VideoElement.srcObject = stream;

  VideoElement.onloadedmetadata = () => {
    VideoElement.play();
  };

  divVideoContainer.appendChild(VideoElement);
  divVideoContainer.appendChild(divNameContainer);
  videosPortalEl.appendChild(divVideoContainer);
}

/////////////////////buttons//////////////////////////////
export function toggleMicBtn(isMuted) {
  //if isMute = true => enabled = false
  console.log(localStream.getAudioTracks());
  localStream.getAudioTracks()[0].enabled = isMuted ? false : true;
}

export function toggleCamBtn(isCamOff) {
  console.log(localStream.getAudioTracks());
  localStream.getVideoTracks()[0].enabled = isCamOff ? false : true;
}

export function toggleScreenSharing(isShared, shareScreenStream) {
  console.log(isShared, shareScreenStream);
  if (isShared) {
    replaceStreamTrack(shareScreenStream);
  } else {
    replaceStreamTrack(localStream);
  }
}

export function replaceStreamTrack(stream = null) {
  for (let socketId in peers) {
    console.log(peers[socketId].streams);
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
    content: messageContent,
    username: username,
    createByMe: true,
  };
  //append to state
  appendNewMessage(localMsgData);

  //channel data prepare
  const messageDataToChannel = {
    content: messageContent,
    username: username,
  };
  //object to JSON, JSON can pass the data channel
  const stringifyMsgDataToChannel = JSON.stringify(messageDataToChannel);
  //send message to all user
  for (let socketId in peers) {
    peers[socketId].send(stringifyMsgDataToChannel);
  }
}