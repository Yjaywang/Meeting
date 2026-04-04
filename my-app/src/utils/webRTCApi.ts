import { setInitLoading } from "../store/slices/roomSlice";
import type { AppDispatch, RootState } from "../store/store";
import { hostMeeting, joinMeeting } from "./webSocketApi";
import Peer from "simple-peer-light";
import * as webSocketApi from "./webSocketApi";
import { fetchTURNCredentials, getTURNCredentials } from "./turnServerApi";
import { storeMicIntervalData } from "../pages/RoomPage/StreamRegion/Btns/MicBtn";
import { postRecording } from "./fetchUserApi";
import * as peerDOMHandler from "./peerDOMHandler";
import { ApiSuccessResponse, ApiErrorResponse } from "../types/api";

interface RecorderLike {
  startRecording(): void;
  stopRecording(callback: () => void): void;
  getBlob(): Promise<Blob>;
}

let localStream: MediaStream;
let shareStream: MediaStream | null;
//-----------------start call--------------------------------------------------
export const previewCall = async (constrain: MediaStreamConstraints): Promise<MediaStream | undefined> => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(constrain);
    console.log("receive local stream success!");
    return localStream;
  } catch (error) {
    console.log("error: ", error);
  }
};
export const startCall = async (
  isHost: boolean,
  username: string,
  roomId: string = "",
  avatar: string,
  selfSocketId: string,
  dispatch: AppDispatch,
  mediaState: { isOtherShare: boolean; isCamOff: boolean; isMuted: boolean }
): Promise<void> => {
  try {
    await fetchTURNCredentials();

    peerDOMHandler.addStream(
      isHost,
      localStream,
      selfSocketId,
      username,
      avatar,
      mediaState
    );
    dispatch(setInitLoading(false));

    isHost
      ? hostMeeting(isHost, username, avatar)
      : joinMeeting(isHost, username, roomId, avatar);
  } catch (error) {
    console.log(`startCall error: ${error}`);
  }
};
//-----------------peer connection--------------------------------------------------
const peers: { [socketId: string]: Peer } = {};

const getConfiguration = (): RTCConfiguration => {
  const turnIceServers = getTURNCredentials();
  if (turnIceServers) {
    console.log("add TURN server to iceServers");
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
  connUserSocketId: string,
  username: string,
  isMakeConnection: boolean,
  getState: () => RootState
): void => {
  const configuration = getConfiguration();
  peers[connUserSocketId] = new Peer({
    initiator: isMakeConnection,
    config: configuration,
    stream: localStream,
    channelName: messengerChannel,
  });
  peers[connUserSocketId].on("error", (err: { error: Error }) => {
    if (err.error.message !== "User-Initiated Abort, reason=Close called") {
      console.log("error: ", err);
    }
  });

  peers[connUserSocketId].on("signal", (data: unknown) => {
    console.log("signal");

    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
      username: username,
    };
    webSocketApi.signalPeerData(signalData);
  });

  peers[connUserSocketId].on("stream", (stream: MediaStream) => {
    console.log("new stream");

    const attendees = getState().room.attendees;
    let newComerIsHost = false;
    let newComerAvatar = "";
    attendees.forEach((attendee) => {
      if (attendee.socketId === connUserSocketId) {
        newComerIsHost = attendee.isHost;
        newComerAvatar = attendee.avatar;
      }
    });
    const { isOtherShare, isCamOff, isMuted } = getState().media;
    peerDOMHandler.addStream(
      newComerIsHost,
      stream,
      connUserSocketId,
      username,
      newComerAvatar,
      { isOtherShare, isCamOff, isMuted }
    );
  });
  const initializePeer = peers[connUserSocketId];
  peers[connUserSocketId].on("connect", () => {
    const state = getState();
    const selfSocketId = state.room.selfSocketId;
    const isCamOff = state.media.isCamOff;
    const isMuted = state.media.isMuted;
    const isShareState = state.media.isShare;
    const isRecordingState = state.media.isRecording;
    webSocketApi.sendVideoTrackStateToPeer(connUserSocketId, isCamOff, selfSocketId);
    webSocketApi.sendAudioTrackStateToPeer(connUserSocketId, isMuted, selfSocketId);
    webSocketApi.sendSharingStateToPeer(connUserSocketId, isShareState, selfSocketId);
    webSocketApi.sendRecordingStateToPeer(connUserSocketId, isRecordingState, selfSocketId);

    const isShare = isShareState;
    if (isShare) {
      initialReplaceStreamTrack(shareStream!, initializePeer);
    }
  });
};
//-----------------inform all peers, need to remove dom--------------------------------------------------
export function removePeerConnection(data: { socketId: string }): void {
  const { socketId } = data;

  const videoContainerEl = document.querySelector(
    `#video-container-${socketId}`
  );
  const videoElementEl = document.querySelector(`#video-${socketId}`) as HTMLVideoElement | null;
  if (videoContainerEl && videoElementEl) {
    const tracks = (videoElementEl.srcObject as MediaStream).getTracks();
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

export function signalingDataHandler(data: { connUserSocketId: string; signal: unknown }): void {
  peers[data.connUserSocketId].signal(data.signal);
}

/////////////////////buttons////////////////////////////////////////////////////////////////////////////////
export function togglePreviewMicBtn(isMuted: boolean): void {
  localStream.getAudioTracks()[0].enabled = isMuted ? false : true;
}

export function toggleMicBtn(isMuted: boolean, selfSocketId: string, roomId: string): void {
  localStream.getAudioTracks()[0].enabled = isMuted ? false : true;

  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 1024;

  const source = audioContext.createMediaStreamSource(localStream);
  const gainNode = audioContext.createGain();

  gainNode.gain.value = 700;
  source.connect(gainNode);
  gainNode.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  const audioLevels: number[] = [];

  const detectMic = window.setInterval(() => {
    analyser.getByteTimeDomainData(dataArray);
    const audioLevel =
      dataArray.reduce((sum, value) => sum + value) / dataArray.length;
    audioLevels.push(audioLevel);

    if (audioLevels.length >= 5) {
      const averageAudioLevel =
        audioLevels.reduce((sum, value) => sum + value) / audioLevels.length;
      const threshold = 128;
      let result = "not speaking";
      if (averageAudioLevel > threshold) {
        result = "speaking";
      } else {
        result = "not speaking";
      }
      audioLevels.splice(0, audioLevels.length - 5);

      if (
        result === "speaking" ||
        result !== storeMicIntervalData.previousResult
      ) {
        const micData = {
          result: result,
          avgAudioLevel: averageAudioLevel,
        };
        console.log(micData);
        webSocketApi.sendMicDataThroughDataChannel(micData, selfSocketId, roomId);
      }

      storeMicIntervalData.previousResult = result;
    }
  }, 200);

  if (isMuted) {
    const resetMicData = {
      result: "not speaking",
      avgAudioLevel: 128,
    };
    webSocketApi.sendMicDataThroughDataChannel(resetMicData, selfSocketId, roomId);
    audioContext.close();
    clearInterval(detectMic);
    clearInterval(storeMicIntervalData.id!);
  } else {
    storeMicIntervalData.id = detectMic;
  }
}

export function toggleCamBtn(isCamOff: boolean): void {
  localStream.getVideoTracks()[0].enabled = isCamOff ? false : true;
}

export function toggleScreenSharing(isShare: boolean, shareScreenStream?: MediaStream): void {
  if (isShare) {
    shareStream = shareScreenStream!;
    replaceStreamTrack(shareScreenStream!);
  } else {
    shareStream = null;
    replaceStreamTrack(localStream);
  }
}

//-----------------for new comer getting the screen sharing stream--------------------------------------------------
function initialReplaceStreamTrack(stream: MediaStream, initializePeer: Peer): void {
  for (const peersTrack in initializePeer.streams[0].getTracks()) {
    for (const shareTrack in stream.getTracks()) {
      if (
        initializePeer.streams[0].getTracks()[peersTrack].kind ===
        stream.getTracks()[shareTrack].kind
      ) {
        initializePeer.replaceTrack(
          initializePeer.streams[0].getTracks()[peersTrack],
          stream.getTracks()[shareTrack],
          initializePeer.streams[0]
        );
        break;
      }
    }
  }
}
//-----------------replace by screen sharing stream--------------------------------------------------
function replaceStreamTrack(stream: MediaStream): void {
  for (const socketId in peers) {
    for (const peersTrack in peers[socketId].streams[0].getTracks()) {
      for (const shareTrack in stream.getTracks()) {
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
//-----------------recording part--------------------------------------------------
let recorderBackup: RecorderLike | null = null;
export async function toggleScreenRecording(isRecording: boolean, recorder: RecorderLike | null | undefined, roomId: string, selfSocketId: string): Promise<ApiSuccessResponse | ApiErrorResponse | undefined> {
  try {
    if (isRecording && recorder) {
      recorderBackup = recorder;
      startRecording(recorder);
    } else {
      const response = await stopRecording(recorderBackup, roomId, selfSocketId);
      return response;
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

function startRecording(recorder: RecorderLike): void {
  recorder.startRecording();
}

async function stopRecording(recorder: RecorderLike | null, roomId: string, selfSocketId: string): Promise<ApiSuccessResponse | ApiErrorResponse | undefined> {
  if (recorder) {
    return new Promise<ApiSuccessResponse | ApiErrorResponse | undefined>((resolve) => {
      recorder.stopRecording(async function () {
        const blob = await recorder.getBlob();
        const formData = new FormData();
        formData.append("file", blob, `${roomId}-${selfSocketId}.webm`);
        formData.append("fileType", `${blob.type}`);
        formData.append("roomId", `${roomId}`);
        const response = await postRecording(formData);
        recorderBackup = null;
        resolve(response);
      });
    });
  }
}

