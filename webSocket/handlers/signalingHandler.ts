import * as attendeesCRUD from "@shared/models/attendeesCRUD";
import { getOrSetCache } from "@shared/redis";
import { ConnectSignalPayload, ConnectStartPayload } from "@shared/types/socket-events";
import type { TypedIO, TypedSocket } from "../types";

export function createSignalHandler(io: TypedIO) {
  return (data: ConnectSignalPayload, socket: TypedSocket): void => {
    const { connUserSocketId, signal } = data;
    const newSignalingData = { signal: signal, connUserSocketId: socket.id };
    io.to(connUserSocketId).emit("connectSignal", newSignalingData);
  };
}

export function createStartConnectionHandler(io: TypedIO) {
  return async (data: ConnectStartPayload, socket: TypedSocket): Promise<void> => {
    const { connUserSocketId } = data;
    try {
      const attendee = await getOrSetCache(`attendee:${socket.id}`, async () => {
        const doc = await attendeesCRUD.findAttendee(socket.id);
        if (!doc) throw new Error(`Attendee with socket id ${socket.id} not found`);
        return doc;
      });
      const username = attendee.username;

      const startConnectionData = {
        connUserSocketId: socket.id,
        username: username,
      };
      io.to(connUserSocketId).emit("connectStart", startConnectionData);
    } catch (error) {
      console.error("connectStart error: ", error);
      socket.emit("socketError", { message: "Failed to start connection" });
    }
  };
}
