import io from "socket.io-client";
import { setAttendees, setRoomId, setSelfSocketId } from "../store/actions";
import store from "../store/store";
import {
  newPeerConnect,
  signalingDataHandler,
  removePeerConnection,
} from "./webRTCApi";
import * as peerDOMHandler from "./peerDOMHandler";

let socket = null;

export const connectSocketIOServer = () => {
  socket = io(`${process.env.REACT_APP_API_URL}`);
  socket.on("connect", () => {
    console.log("connect webSocket server success!");
  });
  socket.on("roomId", (data) => {
    const { roomId } = data;
    store.dispatch(setRoomId(roomId));
  });
  socket.on("selfSocketId", (data) => {
    const { selfSocketId } = data;
    store.dispatch(setSelfSocketId(selfSocketId));
    //update your initial Dom data
    peerDOMHandler.updateDomId(selfSocketId);
  });
  socket.on("roomUpdate", (data) => {
    const { attendees } = data;
    store.dispatch(setAttendees(attendees));
  });

  socket.on("connectRequest", (data) => {
    const { connUserSocketId, username } = data;

    //false means don't make connection, we need to check other's answer
    newPeerConnect(connUserSocketId, username, false);

    //inform new comer, attendees already answer, you can start connect
    //here connUserSocketId is new comer's
    socket.emit("connectStart", {
      connUserSocketId: connUserSocketId,
    });
  });
  socket.on("connectSignal", (data) => {
    signalingDataHandler(data);
  });
  socket.on("connectStart", (data) => {
    const { connUserSocketId, username } = data; //attendee's socket id
    newPeerConnect(connUserSocketId, username, true);
  });

  socket.on("userLeave", (data) => {
    peerDOMHandler.removeLeavePeerSharingState(data);
    removePeerConnection(data);
  });

  socket.on("sendEmotion", (data) => {
    peerDOMHandler.showEmotion(data);
  });
  socket.on("sendShareState", (data) => {
    peerDOMHandler.toggleShareStatus(data);
  });
  socket.on("sendRecordingState", (data) => {
    peerDOMHandler.toggleRecordingStatus(data);
  });
};

export const hostMeeting = (isHost, username, avatar) => {
  const info = {
    isHost,
    username,
    avatar,
  };
  socket.emit("hostMeeting", info);
};

export const joinMeeting = (isHost, username, roomId, avatar) => {
  const info = {
    isHost,
    username,
    roomId,
    avatar,
  };
  socket.emit("joinMeeting", info);
};

export const signalPeerData = (signalData) => {
  socket.emit("connectSignal", signalData);
};

//-----------------send my emotion to peer------------------
export function sendEmotionStatus(emotion) {
  const selfSocketId = store.getState().selfSocketId;
  const roomId = store.getState().roomId;
  const statusData = {
    emotion: emotion,
    selfSocketId: selfSocketId,
    roomId: roomId,
  };
  //append to state, render your page
  peerDOMHandler.showEmotion(statusData);
  socket.emit("sendEmotion", statusData);
}

//-----------------send my sharing status to peer------------
export function sendShareStatus(isShare) {
  const selfSocketId = store.getState().selfSocketId;
  const isCamOff = store.getState().isCamOff;
  const roomId = store.getState().roomId;
  const statusData = {
    roomId: roomId,
    isShare: isShare,
    isCamOff: isCamOff,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  peerDOMHandler.toggleShareStatus(statusData);
  socket.emit("sendShareState", statusData);
}

//-----------------send my recording status to peer---------
export function sendRecordingStatus(isRecording) {
  const selfSocketId = store.getState().selfSocketId;
  const roomId = store.getState().roomId;
  const statusData = {
    roomId: roomId,
    isRecording: isRecording,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  peerDOMHandler.toggleRecordingStatus(statusData);
  socket.emit("sendRecordingState", statusData);
}
