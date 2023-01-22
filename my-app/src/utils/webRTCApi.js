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

export const newPeerConnect = (connUserSocketId, isMakeConnection) => {
  const configuration = getConfiguration();

  peers[connUserSocketId] = new Peer({
    initiator: isMakeConnection,
    config: configuration,
    stream: localStream, //attendee's localStream
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
};

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
