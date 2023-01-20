import { setInitLoading } from "../store/actions";
import store from "../store/store";
import { hostMeeting, joinMeeting } from "./webSocketApi";
import Peer from "simple-peer";
import * as webSocketApi from "./webSocketApi";

let localStream;
export const startCall = async (isHost, username, roomId = null) => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
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

export const newPeerConnect = (connectReqSocketId, isMakeConnection) => {
  const configuration = getConfiguration();

  peers[connectReqSocketId] = new Peer({
    initiator: isMakeConnection,
    config: configuration,
    stream: localStream, //attendee's localStream??
  });

  peers[connectReqSocketId].on("signaling", (data) => {
    //webRTC offer, answer, ice candidates
    const signalingData = {
      signal: data,
      connectReqSocketId: connectReqSocketId,
    };

    webSocketApi.signalPeerData(signalingData);
  });

  peers[connectReqSocketId].on("stream", (stream) => {
    console.log("new stream");

    addStream(stream, connectReqSocketId);
    streams = [...streams, stream];
  });
};

export function signalingDataHandler(signalingData) {
  //add signal data to peers, note that here socket id is peer's, not new comer
  peers[signalingData.connectReqSocketId].signal(signalingData.signal);
}

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

function addStream(stream, connectReqSocketId) {
  //display new comer's stream
}
