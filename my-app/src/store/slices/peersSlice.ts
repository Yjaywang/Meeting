import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PeerState {
  socketId: string;
  username: string;
  isHost: boolean;
  avatar: string;
  isCamOff: boolean;
  isMuted: boolean;
  isShare: boolean;
  isRecording: boolean;
  emotion: string;
  micVolume: { result: string; avgAudioLevel: number };
}

interface PeersState {
  peers: Record<string, PeerState>;
}

const initialState: PeersState = {
  peers: {},
};

export const peersSlice = createSlice({
  name: "peers",
  initialState,
  reducers: {
    addPeer: (
      state,
      action: PayloadAction<{
        socketId: string;
        username: string;
        isHost: boolean;
        avatar: string;
        isCamOff?: boolean;
        isMuted?: boolean;
      }>
    ) => {
      const { socketId, username, isHost, avatar, isCamOff = false, isMuted = false } = action.payload;
      state.peers[socketId] = {
        socketId,
        username,
        isHost,
        avatar,
        isCamOff,
        isMuted,
        isShare: false,
        isRecording: false,
        emotion: "",
        micVolume: { result: "not speaking", avgAudioLevel: 128 },
      };
    },
    removePeer: (state, action: PayloadAction<string>) => {
      delete state.peers[action.payload];
    },
    clearPeers: (state) => {
      state.peers = {};
    },
    updatePeerCam: (
      state,
      action: PayloadAction<{ socketId: string; isCamOff: boolean }>
    ) => {
      const peer = state.peers[action.payload.socketId];
      if (peer) peer.isCamOff = action.payload.isCamOff;
    },
    updatePeerMic: (
      state,
      action: PayloadAction<{ socketId: string; isMuted: boolean }>
    ) => {
      const peer = state.peers[action.payload.socketId];
      if (peer) peer.isMuted = action.payload.isMuted;
    },
    updatePeerShare: (
      state,
      action: PayloadAction<{ socketId: string; isShare: boolean }>
    ) => {
      const peer = state.peers[action.payload.socketId];
      if (peer) peer.isShare = action.payload.isShare;
    },
    updatePeerRecording: (
      state,
      action: PayloadAction<{ socketId: string; isRecording: boolean }>
    ) => {
      const peer = state.peers[action.payload.socketId];
      if (peer) peer.isRecording = action.payload.isRecording;
    },
    updatePeerEmotion: (
      state,
      action: PayloadAction<{ socketId: string; emotion: string }>
    ) => {
      const peer = state.peers[action.payload.socketId];
      if (peer) peer.emotion = action.payload.emotion;
    },
    updatePeerMicVolume: (
      state,
      action: PayloadAction<{
        socketId: string;
        result: string;
        avgAudioLevel: number;
      }>
    ) => {
      const peer = state.peers[action.payload.socketId];
      if (peer) {
        peer.micVolume = {
          result: action.payload.result,
          avgAudioLevel: action.payload.avgAudioLevel,
        };
      }
    },
    updatePeerVideoState: (
      state,
      action: PayloadAction<{ socketId: string; videoEnabled: boolean }>
    ) => {
      const peer = state.peers[action.payload.socketId];
      if (peer) peer.isCamOff = !action.payload.videoEnabled;
    },
    updatePeerAudioState: (
      state,
      action: PayloadAction<{ socketId: string; audioEnabled: boolean }>
    ) => {
      const peer = state.peers[action.payload.socketId];
      if (peer) peer.isMuted = !action.payload.audioEnabled;
    },
  },
});

export const {
  addPeer,
  removePeer,
  clearPeers,
  updatePeerCam,
  updatePeerMic,
  updatePeerShare,
  updatePeerRecording,
  updatePeerEmotion,
  updatePeerMicVolume,
  updatePeerVideoState,
  updatePeerAudioState,
} = peersSlice.actions;
