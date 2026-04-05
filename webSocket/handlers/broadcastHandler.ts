import {
  ServerToClientEvents,
  RoomBroadcastPayload,
  InitVideoStatePayload,
  InitAudioStatePayload,
  InitSharingStatePayload,
  InitRecordingStatePayload,
} from "@shared/types/socket-events";
import type { TypedIO, TypedSocket } from "../types";

type InitStatePayload =
  | InitVideoStatePayload
  | InitAudioStatePayload
  | InitSharingStatePayload
  | InitRecordingStatePayload;

type BroadcastEvent = keyof ServerToClientEvents;

export function createBroadcastToRoom(io: TypedIO) {
  return <E extends BroadcastEvent>(
    event: E,
    data: Parameters<ServerToClientEvents[E]>[0],
    socket: TypedSocket
  ): void => {
    const { roomId } = data as RoomBroadcastPayload;
    socket.to(roomId).emit(event, ...[data] as Parameters<ServerToClientEvents[E]>);
  };
}

export function createSendInitStateToPeer(io: TypedIO) {
  return <E extends BroadcastEvent>(
    event: E,
    data: Parameters<ServerToClientEvents[E]>[0]
  ): void => {
    const { newComerSocketId } = data as InitStatePayload;
    io.to(newComerSocketId).emit(event, ...[data] as Parameters<ServerToClientEvents[E]>);
  };
}
