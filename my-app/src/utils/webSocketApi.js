import io from "socket.io-client";
import { setAttendees, setRoomId, setSelfSocketId } from "../store/actions";
import store from "../store/store";
import {
  newPeerConnect,
  signalingDataHandler,
  removePeerConnection,
  appendNewMessage,
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
  socket.on("sendCamState", (data) => {
    peerDOMHandler.toggleCamStatus(data);
  });
  socket.on("sendMicState", (data) => {
    peerDOMHandler.toggleMicStatus(data);
  });
  socket.on("sendChatMessage", (data) => {
    appendNewMessage(data);
  });
  socket.on("sendInitVideoStateToPeer", (data) => {
    peerDOMHandler.updateVideoState(data);
  });
  socket.on("sendInitAudioStateToPeer", (data) => {
    peerDOMHandler.updateAudioState(data);
  });
  socket.on("sendInitSharingStateToPeer", (data) => {
    peerDOMHandler.updateSharingState(data);
  });
  socket.on("sendInitRecordingStateToPeer", (data) => {
    peerDOMHandler.updateRecordingState(data);
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

//-----------------send my cam status to peer-------------------
export function sendCamStatus(isCamOff) {
  const roomId = store.getState().roomId;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    roomId: roomId,
    isCamOff: isCamOff,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  peerDOMHandler.toggleCamStatus(statusData);
  socket.emit("sendCamState", statusData);
}

//-----------------send my mic status to peer--------------------------------------------------
export function sendMicStatus(isMuted) {
  const roomId = store.getState().roomId;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    roomId: roomId,
    isMuted: isMuted,
    selfSocketId: selfSocketId,
  };
  //append to state, render your page
  peerDOMHandler.toggleMicStatus(statusData);
  socket.emit("sendMicState", statusData);
}

//-----------------send my message to peer--------------------------------------------------
export function sendMsgDataThroughDataChannel(messageContent) {
  const roomId = store.getState().roomId;
  const username = store.getState().username;
  const selfSocketId = store.getState().selfSocketId;
  const avatar = store.getState().avatar;
  const localMsgData = {
    roomId: roomId,
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
    roomId: roomId,
    content: messageContent,
    username: username,
    selfSocketId: selfSocketId,
    avatar: avatar,
  };
  socket.emit("sendChatMessage", messageDataToChannel);
}

//-----------------send my video status to new peer--------------------------------------------------
export function sendVideoTrackStateToPeer(newComerSocketId) {
  const isCamOff = store.getState().isCamOff;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    videoEnabledState: !isCamOff,
    selfSocketId: selfSocketId,
    newComerSocketId: newComerSocketId,
  };

  socket.emit("sendInitVideoStateToPeer", statusData);
}

//-----------------send my audio status to new peer--------------------------------------------------
export function sendAudioTrackStateToPeer(newComerSocketId) {
  const isMuted = store.getState().isMuted;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    audioEnabledState: !isMuted,
    selfSocketId: selfSocketId,
    newComerSocketId: newComerSocketId,
  };

  socket.emit("sendInitAudioStateToPeer", statusData);
}

//-----------------send my sharing status to new peer--------------------------------------------------
export function sendSharingStateToPeer(newComerSocketId) {
  const isShare = store.getState().isShare;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    isShare: isShare,
    selfSocketId: selfSocketId,
    newComerSocketId: newComerSocketId,
  };

  socket.emit("sendInitSharingStateToPeer", statusData);
}

//-----------------send my recording status to new peer--------------------------------------------------
export function sendRecordingStateToPeer(newComerSocketId) {
  const isRecording = store.getState().isRecording;
  const selfSocketId = store.getState().selfSocketId;
  const statusData = {
    isRecording: isRecording,
    selfSocketId: selfSocketId,
    newComerSocketId: newComerSocketId,
  };

  socket.emit("sendInitRecordingStateToPeer", statusData);
}
