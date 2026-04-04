import type { TypedIO, TypedSocket } from "../types";
import { createHostHandler } from "./hostHandler";
import { createJoinHandler } from "./joinHandler";
import { createDisconnectHandler } from "./disconnectHandler";
import { createSignalHandler, createStartConnectionHandler } from "./signalingHandler";
import { createBroadcastToRoom, createSendInitStateToPeer } from "./broadcastHandler";

export function registerHandlers(io: TypedIO, socket: TypedSocket): void {
  const hostHandler = createHostHandler(io);
  const joinHandler = createJoinHandler(io);
  const disconnectHandler = createDisconnectHandler(io);
  const signalHandler = createSignalHandler(io);
  const startConnectionHandler = createStartConnectionHandler(io);
  const broadcastToRoom = createBroadcastToRoom(io);
  const sendInitStateToPeer = createSendInitStateToPeer(io);

  socket.on("hostMeeting", (info) => {
    hostHandler(info, socket);
  });
  socket.on("joinMeeting", (info) => {
    joinHandler(info, socket);
  });
  socket.on("disconnect", () => {
    disconnectHandler(socket);
  });
  socket.on("connectSignal", (data) => {
    signalHandler(data, socket);
  });
  socket.on("connectStart", (data) => {
    startConnectionHandler(data, socket);
  });
  socket.on("sendEmotion", (data) => {
    broadcastToRoom("sendEmotion", data, socket);
  });
  socket.on("sendShareState", (data) => {
    broadcastToRoom("sendShareState", data, socket);
  });
  socket.on("sendRecordingState", (data) => {
    broadcastToRoom("sendRecordingState", data, socket);
  });
  socket.on("sendCamState", (data) => {
    broadcastToRoom("sendCamState", data, socket);
  });
  socket.on("sendMicState", (data) => {
    broadcastToRoom("sendMicState", data, socket);
  });
  socket.on("sendMicVolume", (data) => {
    broadcastToRoom("sendMicVolume", data, socket);
  });
  socket.on("sendChatMessage", (data) => {
    broadcastToRoom("sendChatMessage", data, socket);
  });
  socket.on("sendInitVideoStateToPeer", (data) => {
    sendInitStateToPeer("sendInitVideoStateToPeer", data);
  });
  socket.on("sendInitAudioStateToPeer", (data) => {
    sendInitStateToPeer("sendInitAudioStateToPeer", data);
  });
  socket.on("sendInitSharingStateToPeer", (data) => {
    sendInitStateToPeer("sendInitSharingStateToPeer", data);
  });
  socket.on("sendInitRecordingStateToPeer", (data) => {
    sendInitStateToPeer("sendInitRecordingStateToPeer", data);
  });
}
