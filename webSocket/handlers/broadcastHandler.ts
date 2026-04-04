import * as roomsCRUD from "@shared/models/roomsCRUD";
import { getOrSetCache } from "@shared/redis";
import {
  ServerToClientEvents,
  RoomBroadcastPayload,
  InitVideoStatePayload,
  InitAudioStatePayload,
  InitSharingStatePayload,
  InitRecordingStatePayload,
} from "@shared/types/socket-events";
import { IRoomPopulated } from "@shared/types/models";
import type { TypedIO, TypedSocket } from "../types";

type InitStatePayload =
  | InitVideoStatePayload
  | InitAudioStatePayload
  | InitSharingStatePayload
  | InitRecordingStatePayload;

type BroadcastEvent = keyof ServerToClientEvents;

export function createBroadcastToRoom(io: TypedIO) {
  return async <E extends BroadcastEvent>(
    event: E,
    data: Parameters<ServerToClientEvents[E]>[0],
    socket: TypedSocket
  ): Promise<void> => {
    const { roomId } = data as RoomBroadcastPayload;
    try {
      const room = await getOrSetCache<IRoomPopulated>(`roomId:${roomId}`, async () => {
        const doc = await roomsCRUD.findRoom(roomId);
        return doc!;
      });

      room.attendees_id.forEach((attendee) => {
        if (attendee.socketId !== socket.id) {
          io.to(attendee.socketId).emit(event, ...[data] as Parameters<ServerToClientEvents[E]>);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
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
