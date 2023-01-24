import { setInitLoading, setMessages } from "../store/actions";
import store from "../store/store";
import { hostMeeting, joinMeeting } from "./webSocketApi";
import Peer from "simple-peer";
import * as webSocketApi from "./webSocketApi";

let localStream;
export const startCall = async (isHost, username, roomId = null) => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { width: "480", height: "360" },
    });
    console.log("receive local stream success!");

    showVideo(localStream);
    store.dispatch(setInitLoading(false)); //disable loading svg
    isHost ? hostMeeting(username) : joinMeeting(username, roomId);
  } catch (error) {
    console.log(`startCall error: ${error}`);
  }
};

let peers = {}; //{[{socketId:socketId}, ....]}
let streams = [];
//allow us get get internet connection info
const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
};

const messengerChannel = "messenger";

export const newPeerConnect = (connUserSocketId, isMakeConnection) => {
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
    };
    webSocketApi.signalPeerData(signalData);
  });

  peers[connUserSocketId].on("stream", (stream) => {
    console.log("new stream");
    addStream(stream, connUserSocketId);
    streams = [...streams, stream];
  });

  // peers[connUserSocketId].on("data", (data) => {
  //   //data format is json, need to parse it to object
  //   const messageData = JSON.parse(data);
  //   appendNewMessage(messageData);
  // });
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
function showVideo(stream) {
  const videosPortalEl = document.querySelector("#videos-portal");
  const divVideoContainer = document.createElement("div");
  const VideoElement = document.createElement("video");
  VideoElement.autoplay = true;
  VideoElement.muted = true;
  VideoElement.srcObject = stream;

  VideoElement.onloadedmetadata = () => {
    VideoElement.play();
  };

  divVideoContainer.appendChild(VideoElement);
  videosPortalEl.appendChild(divVideoContainer);
}

function addStream(stream, connUserSocketId) {
  const videosPortalEl = document.querySelector("#videos-portal");
  const divVideoContainer = document.createElement("div");
  divVideoContainer.id = connUserSocketId;
  const VideoElement = document.createElement("video");

  VideoElement.id = `${connUserSocketId}-video`;
  VideoElement.autoplay = true;
  VideoElement.muted = true;
  VideoElement.srcObject = stream;

  VideoElement.onloadedmetadata = () => {
    VideoElement.play();
  };

  divVideoContainer.appendChild(VideoElement);
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
