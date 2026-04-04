import React, { createContext, useContext, useRef, useEffect, useCallback, useMemo } from "react";
import Peer from "simple-peer-light";
import { useSocket } from "./SocketContext";
import { useAppDispatch, useAppStore } from "../store/hooks";
import { setInitLoading } from "../store/slices/roomSlice";
import { setIsOtherShare } from "../store/slices/mediaSlice";
import { addPeer, removePeer } from "../store/slices/peersSlice";
import { fetchTURNCredentials, getTURNCredentials } from "../utils/turnServerApi";
import { postRecording } from "../utils/fetchUserApi";
import * as streamStore from "../utils/streamStore";
import type { ApiSuccessResponse, ApiErrorResponse } from "../types/api";

interface RecorderLike {
  startRecording(): void;
  stopRecording(callback: () => void): void;
  getBlob(): Promise<Blob>;
}

interface WebRTCContextValue {
  previewCall: (constrain: MediaStreamConstraints) => Promise<MediaStream | undefined>;
  startCall: (
    isHost: boolean, username: string, roomId: string, avatar: string,
    selfSocketId: string, mediaState: { isOtherShare: boolean; isCamOff: boolean; isMuted: boolean }
  ) => Promise<void>;
  togglePreviewMicBtn: (isMuted: boolean) => void;
  toggleMicBtn: (isMuted: boolean, selfSocketId: string, roomId: string) => void;
  toggleCamBtn: (isCamOff: boolean) => void;
  toggleScreenSharing: (isShare: boolean, shareScreenStream?: MediaStream) => void;
  toggleScreenRecording: (
    isRecording: boolean, recorder: RecorderLike | null | undefined,
    roomId: string, selfSocketId: string
  ) => Promise<ApiSuccessResponse | ApiErrorResponse | undefined>;
}

const WebRTCContext = createContext<WebRTCContextValue | null>(null);

const messengerChannel = "messenger";

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socketRef, isConnected, signalPeerData, hostMeeting, joinMeeting,
    sendVideoTrackStateToPeer, sendAudioTrackStateToPeer,
    sendSharingStateToPeer, sendRecordingStateToPeer,
    sendMicVolume } = useSocket();
  const dispatch = useAppDispatch();
  const store = useAppStore();

  const localStreamRef = useRef<MediaStream | null>(null);
  const shareStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, Peer>>({});
  const recorderBackupRef = useRef<RecorderLike | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micIntervalRef = useRef<number | null>(null);
  const previousMicResultRef = useRef("not speaking");

  const getConfiguration = useCallback((): RTCConfiguration => {
    const turnIceServers = getTURNCredentials();
    if (turnIceServers) {
      console.log("add TURN server to iceServers");
      return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, ...turnIceServers] };
    }
    console.warn("STUN server only");
    return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  }, []);

  const initialReplaceStreamTrack = useCallback((stream: MediaStream, initializePeer: Peer) => {
    for (const peersTrack in initializePeer.streams[0].getTracks()) {
      for (const shareTrack in stream.getTracks()) {
        if (initializePeer.streams[0].getTracks()[peersTrack].kind === stream.getTracks()[shareTrack].kind) {
          initializePeer.replaceTrack(
            initializePeer.streams[0].getTracks()[peersTrack],
            stream.getTracks()[shareTrack],
            initializePeer.streams[0]
          );
          break;
        }
      }
    }
  }, []);

  const newPeerConnect = useCallback((connUserSocketId: string, username: string, isMakeConnection: boolean) => {
    if (!localStreamRef.current) {
      console.error("newPeerConnect: localStream not ready");
      return;
    }
    const configuration = getConfiguration();
    const peer = new Peer({
      initiator: isMakeConnection,
      config: configuration,
      stream: localStreamRef.current,
      channelName: messengerChannel,
    });
    peersRef.current[connUserSocketId] = peer;

    peer.on("error", (err: unknown) => {
      const message = err instanceof Error ? err.message : (err as { error?: Error })?.error?.message;
      if (message !== "User-Initiated Abort, reason=Close called") {
        console.log("error: ", err);
      }
    });

    peer.on("signal", (data: unknown) => {
      console.log("signal");
      signalPeerData({ signal: data, connUserSocketId, username });
    });

    peer.on("stream", (stream: MediaStream) => {
      console.log("new stream");
      const state = store.getState();
      const attendees = state.room.attendees;
      let newComerIsHost = false;
      let newComerAvatar = "";
      attendees.forEach((attendee) => {
        if (attendee.socketId === connUserSocketId) {
          newComerIsHost = attendee.isHost;
          newComerAvatar = attendee.avatar;
        }
      });
      streamStore.setStream(connUserSocketId, stream);
      dispatch(addPeer({ socketId: connUserSocketId, username, isHost: newComerIsHost, avatar: newComerAvatar }));
    });

    const initializePeer = peer;
    peer.on("connect", () => {
      const state = store.getState();
      const selfSocketId = state.room.selfSocketId;
      const isCamOff = state.media.isCamOff;
      const isMuted = state.media.isMuted;
      const isShareState = state.media.isShare;
      const isRecordingState = state.media.isRecording;
      sendVideoTrackStateToPeer(connUserSocketId, isCamOff, selfSocketId);
      sendAudioTrackStateToPeer(connUserSocketId, isMuted, selfSocketId);
      sendSharingStateToPeer(connUserSocketId, isShareState, selfSocketId);
      sendRecordingStateToPeer(connUserSocketId, isRecordingState, selfSocketId);

      if (isShareState && shareStreamRef.current) {
        initialReplaceStreamTrack(shareStreamRef.current, initializePeer);
      }
    });
  }, [dispatch, store, getConfiguration, signalPeerData, sendVideoTrackStateToPeer, sendAudioTrackStateToPeer, sendSharingStateToPeer, sendRecordingStateToPeer, initialReplaceStreamTrack]);

  // Bind peer-connection socket events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    const onConnectRequest = (data: { connUserSocketId: string; username: string }) => {
      newPeerConnect(data.connUserSocketId, data.username, false);
      socket.emit("connectStart", { connUserSocketId: data.connUserSocketId });
    };
    const onConnectSignal = (data: { connUserSocketId: string; signal: unknown }) => {
      peersRef.current[data.connUserSocketId]?.signal(data.signal);
    };
    const onConnectStart = (data: { connUserSocketId: string; username: string }) => {
      newPeerConnect(data.connUserSocketId, data.username, true);
    };
    const onUserLeave = (data: { socketId: string }) => {
      const leavingPeer = store.getState().peers.peers[data.socketId];
      if (leavingPeer?.isShare) {
        dispatch(setIsOtherShare(false));
      }
      if (peersRef.current[data.socketId]) {
        peersRef.current[data.socketId].destroy();
        delete peersRef.current[data.socketId];
      }
      streamStore.removeStream(data.socketId);
      dispatch(removePeer(data.socketId));
    };

    socket.on("connectRequest", onConnectRequest);
    socket.on("connectSignal", onConnectSignal);
    socket.on("connectStart", onConnectStart);
    socket.on("userLeave", onUserLeave);

    return () => {
      socket.off("connectRequest", onConnectRequest);
      socket.off("connectSignal", onConnectSignal);
      socket.off("connectStart", onConnectStart);
      socket.off("userLeave", onUserLeave);
    };
  }, [socketRef, isConnected, newPeerConnect, store, dispatch]);

  const previewCall = useCallback(async (constrain: MediaStreamConstraints): Promise<MediaStream | undefined> => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia(constrain);
      localStreamRef.current = stream;
      console.log("receive local stream success!");
      return stream;
    } catch (error) {
      console.log("error: ", error);
    }
  }, []);

  const startCall = useCallback(async (
    isHost: boolean, username: string, roomId: string, avatar: string,
    selfSocketId: string, mediaState: { isOtherShare: boolean; isCamOff: boolean; isMuted: boolean }
  ) => {
    try {
      await fetchTURNCredentials();
      streamStore.setStream(selfSocketId, localStreamRef.current!);
      dispatch(addPeer({ socketId: selfSocketId, username, isHost, avatar, isCamOff: mediaState.isCamOff, isMuted: mediaState.isMuted }));
      dispatch(setInitLoading(false));
      isHost ? hostMeeting(isHost, username, avatar) : joinMeeting(isHost, username, roomId, avatar);
    } catch (error) {
      console.log(`startCall error: ${error}`);
    }
  }, [dispatch, hostMeeting, joinMeeting]);

  const togglePreviewMicBtn = useCallback((isMuted: boolean) => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = !isMuted;
  }, []);

  const toggleMicBtn = useCallback((isMuted: boolean, selfSocketId: string, roomId: string) => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = !isMuted;

    // Clean up previous AudioContext and interval before creating new ones
    if (micIntervalRef.current !== null) {
      clearInterval(micIntervalRef.current);
      micIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (isMuted) {
      const resetMicData = { result: "not speaking", avgAudioLevel: 128 };
      sendMicVolume(resetMicData, selfSocketId, roomId);
    } else {
      if (!localStreamRef.current) return;
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      const source = audioContext.createMediaStreamSource(localStreamRef.current);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 700;
      source.connect(gainNode);
      gainNode.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const audioLevels: number[] = [];

      const detectMic = window.setInterval(() => {
        analyser.getByteTimeDomainData(dataArray);
        const audioLevel = dataArray.reduce((sum, value) => sum + value) / dataArray.length;
        audioLevels.push(audioLevel);

        if (audioLevels.length >= 5) {
          const averageAudioLevel = audioLevels.reduce((sum, value) => sum + value) / audioLevels.length;
          const threshold = 128;
          let result = "not speaking";
          if (averageAudioLevel > threshold) {
            result = "speaking";
          }
          audioLevels.splice(0, audioLevels.length - 5);

          if (result === "speaking" || result !== previousMicResultRef.current) {
            const micData = { result, avgAudioLevel: averageAudioLevel };
            console.log(micData);
            sendMicVolume(micData, selfSocketId, roomId);
          }
          previousMicResultRef.current = result;
        }
      }, 200);
      micIntervalRef.current = detectMic;
    }
  }, [sendMicVolume]);

  const toggleCamBtn = useCallback((isCamOff: boolean) => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) track.enabled = !isCamOff;
  }, []);

  const replaceStreamTrack = useCallback((stream: MediaStream) => {
    for (const socketId in peersRef.current) {
      for (const peersTrack in peersRef.current[socketId].streams[0].getTracks()) {
        for (const shareTrack in stream.getTracks()) {
          if (peersRef.current[socketId].streams[0].getTracks()[peersTrack].kind === stream.getTracks()[shareTrack].kind) {
            peersRef.current[socketId].replaceTrack(
              peersRef.current[socketId].streams[0].getTracks()[peersTrack],
              stream.getTracks()[shareTrack],
              peersRef.current[socketId].streams[0]
            );
            break;
          }
        }
      }
    }
  }, []);

  const toggleScreenSharing = useCallback((isShare: boolean, shareScreenStream?: MediaStream) => {
    if (isShare) {
      shareStreamRef.current = shareScreenStream!;
      replaceStreamTrack(shareScreenStream!);
    } else {
      shareStreamRef.current = null;
      replaceStreamTrack(localStreamRef.current!);
    }
  }, [replaceStreamTrack]);

  const toggleScreenRecording = useCallback(async (
    isRecording: boolean, recorder: RecorderLike | null | undefined,
    roomId: string, selfSocketId: string
  ): Promise<ApiSuccessResponse | ApiErrorResponse | undefined> => {
    try {
      if (isRecording && recorder) {
        recorderBackupRef.current = recorder;
        recorder.startRecording();
      } else {
        if (recorderBackupRef.current) {
          return new Promise<ApiSuccessResponse | ApiErrorResponse | undefined>((resolve) => {
            recorderBackupRef.current!.stopRecording(async function () {
              const blob = await recorderBackupRef.current!.getBlob();
              const formData = new FormData();
              formData.append("file", blob, `${roomId}-${selfSocketId}.webm`);
              formData.append("fileType", `${blob.type}`);
              formData.append("roomId", `${roomId}`);
              const response = await postRecording(formData);
              recorderBackupRef.current = null;
              resolve(response);
            });
          });
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, []);

  // Cleanup on unmount: clear intervals, close AudioContext, destroy peers
  useEffect(() => {
    return () => {
      if (micIntervalRef.current !== null) clearInterval(micIntervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      Object.values(peersRef.current).forEach((peer) => peer.destroy());
    };
  }, []);

  const value = useMemo<WebRTCContextValue>(() => ({
    previewCall,
    startCall,
    togglePreviewMicBtn,
    toggleMicBtn,
    toggleCamBtn,
    toggleScreenSharing,
    toggleScreenRecording,
  }), [previewCall, startCall, togglePreviewMicBtn, toggleMicBtn, toggleCamBtn, toggleScreenSharing, toggleScreenRecording]);

  return <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>;
};

export function useWebRTC(): WebRTCContextValue {
  const context = useContext(WebRTCContext);
  if (!context) throw new Error("useWebRTC must be used within WebRTCProvider");
  return context;
}
