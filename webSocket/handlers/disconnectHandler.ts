import * as attendeesCRUD from "@shared/models/attendeesCRUD";
import * as roomsCRUD from "@shared/models/roomsCRUD";
import { getOrSetCache, leaveAndCleanCache, updateCache } from "@shared/redis";
import { IRoomPopulated } from "@shared/types/models";
import type { TypedIO, TypedSocket } from "../types";

export function createDisconnectHandler(io: TypedIO) {
  return async (socket: TypedSocket): Promise<void> => {
    console.log("disconnect");
    try {
      const attendee = await getOrSetCache<IRoomPopulated["attendees_id"][number] | null>(
        `attendee:${socket.id}`,
        async () => {
          return (await attendeesCRUD.findAttendee(socket.id)) ?? null;
        }
      );
      if (attendee) {
        const room = (await roomsCRUD.deleteRoomAttendee(
          attendee.roomId,
          attendee._id.toString()
        )) ?? null;
        if (!room) {
          console.error(`Room ${attendee.roomId} not found during disconnect`);
          return;
        }
        updateCache(`roomId:${attendee.roomId}`, room);

        await attendeesCRUD.deleteAttendee(attendee.socketId);
        leaveAndCleanCache(`attendee:${socket.id}`);

        socket.leave(attendee.roomId);

        if (room.attendees_id.length === 0) {
          await roomsCRUD.deleteRoom(attendee.roomId);
          leaveAndCleanCache(`roomId:${attendee.roomId}`);
        } else {
          io.to(room.roomId).emit("userLeave", { socketId: socket.id });
          io.to(room.roomId).emit("roomUpdate", {
            attendees: room.attendees_id,
          });
        }
      } else {
        leaveAndCleanCache(`attendee:${socket.id}`);
      }
    } catch (error) {
      console.error("cache error: ", error);
    }
  };
}
