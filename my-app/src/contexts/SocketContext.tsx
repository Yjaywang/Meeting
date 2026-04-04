import React, { createContext, useContext, useRef, useState, useCallback, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { setAttendees, setRoomId, setSelfSocketId } from "../store/slices/roomSlice";
import { setIsOtherShare } from "../store/slices/mediaSlice";
import { addMessage } from "../store/slices/chatSlice";
import {
  updatePeerCam,
  updatePeerMic,
  updatePeerShare,
  updatePeerRecording,
  updatePeerEmotion,
  updatePeerMicVolume,
  updatePeerVideoState,
  updatePeerAudioState,
} from "../store/slices/peersSlice";
import type { IAttendee } from "../types/models";
import { useAppDispatch, useAppStore } from "../store/hooks";

interface SocketContextValue {
  socketRef: React.RefObject<Socket | null>;
  isConnected: boolean;
  connectSocket: () => Promise<void>;
  hostMeeting: (isHost: boolean, username: string, avatar: string) => void;
  joinMeeting: (isHost: boolean, username: string, roomId: string, avatar: string) => void;
  signalPeerData: (data: { signal: unknown; connUserSocketId: string; username: string }) => void;
  sendEmotionStatus: (emotion: string, selfSocketId: string, roomId: string) => void;
  sendShareStatus: (isShare: boolean, selfSocketId: string, isCamOff: boolean, roomId: string) => void;
  sendRecordingStatus: (isRecording: boolean, selfSocketId: string, roomId: string) => void;
  sendCamStatus: (isCamOff: boolean, selfSocketId: string, roomId: string) => void;
  sendMicStatus: (isMuted: boolean, selfSocketId: string, roomId: string) => void;
  sendMicDataThroughDataChannel: (micData: { result: string; avgAudioLevel: number }, selfSocketId: string, roomId: string) => void;
  sendMsgDataThroughDataChannel: (messageContent: string, roomId: string, username: string, selfSocketId: string, avatar: string) => void;
  sendVideoTrackStateToPeer: (newComerSocketId: string, isCamOff: boolean, selfSocketId: string) => void;
  sendAudioTrackStateToPeer: (newComerSocketId: string, isMuted: boolean, selfSocketId: string) => void;
  sendSharingStateToPeer: (newComerSocketId: string, isShare: boolean, selfSocketId: string) => void;
  sendRecordingStateToPeer: (newComerSocketId: string, isRecording: boolean, selfSocketId: string) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useAppDispatch();
  const store = useAppStore();

  const connectSocket = useCallback(async () => {
    if (socketRef.current) return;

    let token = "";
    try {
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/refresh`,
        { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      if (!refreshResponse.ok) {
        console.error("Failed to get access token for WebSocket. Status: " + refreshResponse.status);
        return;
      }
      const refreshData = await refreshResponse.json();
      if (!refreshData.accessToken) {
        console.error("Failed to get access token for WebSocket: No access token in response");
        return;
      }
      token = refreshData.accessToken;
    } catch (error) {
      console.error("Failed to fetch token for WebSocket:", error);
      return;
    }

    const socket = io(`${import.meta.env.VITE_API_URL}`, {
      withCredentials: true,
      auth: { token },
      extraHeaders: { "my-custom-header": "abcd" },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connect webSocket server success!");
      setIsConnected(true);
    });
    socket.on("roomId", (data: { roomId: string }) => {
      dispatch(setRoomId(data.roomId));
    });
    socket.on("selfSocketId", (data: { selfSocketId: string }) => {
      dispatch(setSelfSocketId(data.selfSocketId));
    });
    socket.on("roomUpdate", (data: { attendees: IAttendee[] }) => {
      dispatch(setAttendees(data.attendees));
    });
    socket.on("sendEmotion", (data: { emotion: string; selfSocketId: string }) => {
      dispatch(updatePeerEmotion({ socketId: data.selfSocketId, emotion: data.emotion }));
    });
    socket.on("sendShareState", (data: { isShare: boolean; isCamOff: boolean; selfSocketId: string }) => {
      const selfSocketId = store.getState().room.selfSocketId;
      if (data.selfSocketId !== selfSocketId) {
        dispatch(setIsOtherShare(data.isShare));
      }
      dispatch(updatePeerShare({ socketId: data.selfSocketId, isShare: data.isShare }));
    });
    socket.on("sendRecordingState", (data: { isRecording: boolean; selfSocketId: string }) => {
      dispatch(updatePeerRecording({ socketId: data.selfSocketId, isRecording: data.isRecording }));
    });
    socket.on("sendCamState", (data: { isCamOff: boolean; selfSocketId: string }) => {
      dispatch(updatePeerCam({ socketId: data.selfSocketId, isCamOff: data.isCamOff }));
    });
    socket.on("sendMicState", (data: { isMuted: boolean; selfSocketId: string }) => {
      dispatch(updatePeerMic({ socketId: data.selfSocketId, isMuted: data.isMuted }));
    });
    socket.on("sendMicVolume", (data: { selfSocketId: string; avgAudioLevel: number; result: string }) => {
      dispatch(updatePeerMicVolume({ socketId: data.selfSocketId, result: data.result, avgAudioLevel: data.avgAudioLevel }));
    });
    socket.on("sendChatMessage", (data: { content: string; username: string; selfSocketId: string; avatar: string }) => {
      dispatch(addMessage(data));
    });
    socket.on("sendInitVideoStateToPeer", (data: { videoEnabledState: boolean; selfSocketId: string }) => {
      dispatch(updatePeerVideoState({ socketId: data.selfSocketId, videoEnabled: data.videoEnabledState }));
    });
    socket.on("sendInitAudioStateToPeer", (data: { audioEnabledState: boolean; selfSocketId: string }) => {
      dispatch(updatePeerAudioState({ socketId: data.selfSocketId, audioEnabled: data.audioEnabledState }));
    });
    socket.on("sendInitSharingStateToPeer", (data: { isShare: boolean; selfSocketId: string }) => {
      if (data.isShare) {
        dispatch(setIsOtherShare(true));
      }
      dispatch(updatePeerShare({ socketId: data.selfSocketId, isShare: data.isShare }));
    });
    socket.on("sendInitRecordingStateToPeer", (data: { isRecording: boolean; selfSocketId: string }) => {
      dispatch(updatePeerRecording({ socketId: data.selfSocketId, isRecording: data.isRecording }));
    });
  }, [dispatch, store]);

  const value = useMemo<SocketContextValue>(() => ({
    socketRef,
    isConnected,
    connectSocket,
    hostMeeting: (isHost, username, avatar) => {
      socketRef.current!.emit("hostMeeting", { isHost, username, avatar });
    },
    joinMeeting: (isHost, username, roomId, avatar) => {
      socketRef.current!.emit("joinMeeting", { isHost, username, roomId, avatar });
    },
    signalPeerData: (data) => {
      socketRef.current!.emit("connectSignal", data);
    },
    sendEmotionStatus: (emotion, selfSocketId, roomId) => {
      dispatch(updatePeerEmotion({ socketId: selfSocketId, emotion }));
      socketRef.current!.emit("sendEmotion", { emotion, selfSocketId, roomId });
    },
    sendShareStatus: (isShare, selfSocketId, isCamOff, roomId) => {
      dispatch(updatePeerShare({ socketId: selfSocketId, isShare }));
      socketRef.current!.emit("sendShareState", { roomId, isShare, isCamOff, selfSocketId });
    },
    sendRecordingStatus: (isRecording, selfSocketId, roomId) => {
      dispatch(updatePeerRecording({ socketId: selfSocketId, isRecording }));
      socketRef.current!.emit("sendRecordingState", { roomId, isRecording, selfSocketId });
    },
    sendCamStatus: (isCamOff, selfSocketId, roomId) => {
      dispatch(updatePeerCam({ socketId: selfSocketId, isCamOff }));
      socketRef.current!.emit("sendCamState", { roomId, isCamOff, selfSocketId });
    },
    sendMicStatus: (isMuted, selfSocketId, roomId) => {
      dispatch(updatePeerMic({ socketId: selfSocketId, isMuted }));
      socketRef.current!.emit("sendMicState", { roomId, isMuted, selfSocketId });
    },
    sendMicDataThroughDataChannel: (micData, selfSocketId, roomId) => {
      dispatch(updatePeerMicVolume({ socketId: selfSocketId, result: micData.result, avgAudioLevel: micData.avgAudioLevel }));
      socketRef.current!.emit("sendMicVolume", { roomId, result: micData.result, selfSocketId, avgAudioLevel: micData.avgAudioLevel });
    },
    sendMsgDataThroughDataChannel: (messageContent, roomId, username, selfSocketId, avatar) => {
      dispatch(addMessage({ roomId, content: messageContent, username, createByMe: true, selfSocketId, avatar }));
      socketRef.current!.emit("sendChatMessage", { roomId, content: messageContent, username, selfSocketId, avatar });
    },
    sendVideoTrackStateToPeer: (newComerSocketId, isCamOff, selfSocketId) => {
      socketRef.current!.emit("sendInitVideoStateToPeer", { videoEnabledState: !isCamOff, selfSocketId, newComerSocketId });
    },
    sendAudioTrackStateToPeer: (newComerSocketId, isMuted, selfSocketId) => {
      socketRef.current!.emit("sendInitAudioStateToPeer", { audioEnabledState: !isMuted, selfSocketId, newComerSocketId });
    },
    sendSharingStateToPeer: (newComerSocketId, isShare, selfSocketId) => {
      socketRef.current!.emit("sendInitSharingStateToPeer", { isShare, selfSocketId, newComerSocketId });
    },
    sendRecordingStateToPeer: (newComerSocketId, isRecording, selfSocketId) => {
      socketRef.current!.emit("sendInitRecordingStateToPeer", { isRecording, selfSocketId, newComerSocketId });
    },
  }), [isConnected, connectSocket, dispatch]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
}
