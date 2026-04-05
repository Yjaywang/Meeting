import io, { Socket } from "socket.io-client";
import { setAttendees, setRoomId, setSelfSocketId } from "../store/slices/roomSlice";
import { addMessage } from "../store/slices/chatSlice";
import type { AppDispatch, RootState } from "../store/store";
import {
  newPeerConnect,
  signalingDataHandler,
  removePeerConnection,
} from "./webRTCApi";
import * as peerDOMHandler from "./peerDOMHandler";

let socket: Socket | null = null;
let _dispatch: AppDispatch;
let _getState: () => RootState;

export const connectSocketIOServer = (dispatch: AppDispatch, getState: () => RootState): void => {
  _dispatch = dispatch;
  _getState = getState;
  if (socket) return;
  socket = io(`${import.meta.env.VITE_API_URL}`, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd",
    },
  });
  socket.on("connect", () => {
    console.log("connect webSocket server success!");
  });
  socket.on("roomId", (data: { roomId: string }) => {
    const { roomId } = data;
    _dispatch(setRoomId(roomId));
  });
  socket.on("selfSocketId", (data: { selfSocketId: string }) => {
    const { selfSocketId } = data;
    _dispatch(setSelfSocketId(selfSocketId));
    peerDOMHandler.updateDomId(selfSocketId);
  });
  socket.on("roomUpdate", (data: { attendees: import("../types/models").IAttendee[] }) => {
    const { attendees } = data;
    _dispatch(setAttendees(attendees));
  });

  socket.on("connectRequest", (data: { connUserSocketId: string; username: string }) => {
    const { connUserSocketId, username } = data;

    newPeerConnect(connUserSocketId, username, false, _getState);

    socket!.emit("connectStart", {
      connUserSocketId: connUserSocketId,
    });
  });
  socket.on("connectSignal", (data: { connUserSocketId: string; signal: unknown }) => {
    signalingDataHandler(data);
  });
  socket.on("connectStart", (data: { connUserSocketId: string; username: string }) => {
    const { connUserSocketId, username } = data;
    newPeerConnect(connUserSocketId, username, true, _getState);
  });

  socket.on("userLeave", (data: { socketId: string }) => {
    peerDOMHandler.removeLeavePeerSharingState(data, _dispatch);
    removePeerConnection(data);
  });

  socket.on("sendEmotion", (data: { emotion: string; selfSocketId: string }) => {
    peerDOMHandler.showEmotion(data);
  });
  socket.on("sendShareState", (data: { isShare: boolean; isCamOff: boolean; selfSocketId: string }) => {
    peerDOMHandler.toggleShareStatus(data, _getState().room.selfSocketId, _dispatch);
  });
  socket.on("sendRecordingState", (data: { isRecording: boolean; selfSocketId: string }) => {
    peerDOMHandler.toggleRecordingStatus(data);
  });
  socket.on("sendCamState", (data: { isCamOff: boolean; selfSocketId: string }) => {
    peerDOMHandler.toggleCamStatus(data);
  });
  socket.on("sendMicState", (data: { isMuted: boolean; selfSocketId: string }) => {
    peerDOMHandler.toggleMicStatus(data);
  });
  socket.on("sendMicVolume", (data: { selfSocketId: string; avgAudioLevel: number; result: string }) => {
    peerDOMHandler.micVolume(data);
  });
  socket.on("sendChatMessage", (data: { content: string; username: string; selfSocketId: string; avatar: string; createByMe?: boolean }) => {
    _dispatch(addMessage(data));
  });
  socket.on("sendInitVideoStateToPeer", (data: { videoEnabledState: boolean; selfSocketId: string }) => {
    peerDOMHandler.updateVideoState(data);
  });
  socket.on("sendInitAudioStateToPeer", (data: { audioEnabledState: boolean; selfSocketId: string }) => {
    peerDOMHandler.updateAudioState(data);
  });
  socket.on("sendInitSharingStateToPeer", (data: { isShare: boolean; selfSocketId: string }) => {
    peerDOMHandler.updateSharingState(data, _dispatch);
  });
  socket.on("sendInitRecordingStateToPeer", (data: { isRecording: boolean; selfSocketId: string }) => {
    peerDOMHandler.updateRecordingState(data);
  });
};

export const hostMeeting = (isHost: boolean, username: string, avatar: string): void => {
  const info = {
    isHost,
    username,
    avatar,
  };
  socket!.emit("hostMeeting", info);
};

export const joinMeeting = (isHost: boolean, username: string, roomId: string, avatar: string): void => {
  const info = {
    isHost,
    username,
    roomId,
    avatar,
  };
  socket!.emit("joinMeeting", info);
};

export const signalPeerData = (signalData: { signal: unknown; connUserSocketId: string; username: string }): void => {
  socket!.emit("connectSignal", signalData);
};

//-----------------send my emotion to peer------------------
export function sendEmotionStatus(emotion: string, selfSocketId: string, roomId: string): void {
  const statusData = {
    emotion: emotion,
    selfSocketId: selfSocketId,
    roomId: roomId,
  };
  peerDOMHandler.showEmotion(statusData);
  socket!.emit("sendEmotion", statusData);
}

//-----------------send my sharing status to peer------------
export function sendShareStatus(isShare: boolean, selfSocketId: string, isCamOff: boolean, roomId: string): void {
  const statusData = {
    roomId: roomId,
    isShare: isShare,
    isCamOff: isCamOff,
    selfSocketId: selfSocketId,
  };
  peerDOMHandler.toggleShareStatus(statusData, selfSocketId, _dispatch);
  socket!.emit("sendShareState", statusData);
}

//-----------------send my recording status to peer---------
export function sendRecordingStatus(isRecording: boolean, selfSocketId: string, roomId: string): void {
  const statusData = {
    roomId: roomId,
    isRecording: isRecording,
    selfSocketId: selfSocketId,
  };
  peerDOMHandler.toggleRecordingStatus(statusData);
  socket!.emit("sendRecordingState", statusData);
}

//-----------------send my cam status to peer-------------------
export function sendCamStatus(isCamOff: boolean, selfSocketId: string, roomId: string): void {
  const statusData = {
    roomId: roomId,
    isCamOff: isCamOff,
    selfSocketId: selfSocketId,
  };
  peerDOMHandler.toggleCamStatus(statusData);
  socket!.emit("sendCamState", statusData);
}

//-----------------send my mic status to peer--------------------------------------------------
export function sendMicStatus(isMuted: boolean, selfSocketId: string, roomId: string): void {
  const statusData = {
    roomId: roomId,
    isMuted: isMuted,
    selfSocketId: selfSocketId,
  };
  peerDOMHandler.toggleMicStatus(statusData);
  socket!.emit("sendMicState", statusData);
}

//-----------------send my vol data to peer--------------------------------------------------
export function sendMicDataThroughDataChannel(micData: { result: string; avgAudioLevel: number }, selfSocketId: string, roomId: string): void {
  const statusData = {
    roomId: roomId,
    result: micData.result,
    selfSocketId: selfSocketId,
    avgAudioLevel: micData.avgAudioLevel,
  };
  peerDOMHandler.micVolume(statusData);
  socket!.emit("sendMicVolume", statusData);
}

//-----------------send my message to peer--------------------------------------------------
export function sendMsgDataThroughDataChannel(
  messageContent: string,
  roomId: string,
  username: string,
  selfSocketId: string,
  avatar: string,
): void {
  const localMsgData = {
    roomId: roomId,
    content: messageContent,
    username: username,
    createByMe: true,
    selfSocketId: selfSocketId,
    avatar: avatar,
  };
  _dispatch(addMessage(localMsgData));

  const messageDataToChannel = {
    roomId: roomId,
    content: messageContent,
    username: username,
    selfSocketId: selfSocketId,
    avatar: avatar,
  };
  socket!.emit("sendChatMessage", messageDataToChannel);
}

//-----------------send my video status to new peer--------------------------------------------------
export function sendVideoTrackStateToPeer(newComerSocketId: string, isCamOff: boolean, selfSocketId: string): void {
  const statusData = {
    videoEnabledState: !isCamOff,
    selfSocketId: selfSocketId,
    newComerSocketId: newComerSocketId,
  };

  socket!.emit("sendInitVideoStateToPeer", statusData);
}

//-----------------send my audio status to new peer--------------------------------------------------
export function sendAudioTrackStateToPeer(newComerSocketId: string, isMuted: boolean, selfSocketId: string): void {
  const statusData = {
    audioEnabledState: !isMuted,
    selfSocketId: selfSocketId,
    newComerSocketId: newComerSocketId,
  };

  socket!.emit("sendInitAudioStateToPeer", statusData);
}

//-----------------send my sharing status to new peer--------------------------------------------------
export function sendSharingStateToPeer(newComerSocketId: string, isShare: boolean, selfSocketId: string): void {
  const statusData = {
    isShare: isShare,
    selfSocketId: selfSocketId,
    newComerSocketId: newComerSocketId,
  };

  socket!.emit("sendInitSharingStateToPeer", statusData);
}

//-----------------send my recording status to new peer--------------------------------------------------
export function sendRecordingStateToPeer(newComerSocketId: string, isRecording: boolean, selfSocketId: string): void {
  const statusData = {
    isRecording: isRecording,
    selfSocketId: selfSocketId,
    newComerSocketId: newComerSocketId,
  };

  socket!.emit("sendInitRecordingStateToPeer", statusData);
}
