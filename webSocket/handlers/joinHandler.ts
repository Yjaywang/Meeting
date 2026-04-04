import { v4 as uuidv4 } from "uuid";
import * as attendeesCRUD from "@shared/models/attendeesCRUD";
import * as roomsCRUD from "@shared/models/roomsCRUD";
import { getOrSetCache, updateCache } from "@shared/redis";
import { JoinMeetingPayload } from "@shared/types/socket-events";
import { AttendeeData } from "@shared/types/models";
import type { TypedIO, TypedSocket } from "../types";

export function createJoinHandler(io: TypedIO) {
  return async (info: JoinMeetingPayload, socket: TypedSocket): Promise<void> => {
    console.log("join the meeting");
    const { isHost, username, roomId, avatar } = info;
    const userId = uuidv4();
    const newUser: AttendeeData = {
      username,
      isHost,
      userId,
      roomId,
      avatar,
      socketId: socket.id,
    };

    try {
      await getOrSetCache(`roomId:${roomId}`, async () => {
        const doc = await roomsCRUD.findRoom(roomId);
        return doc!;
      });

      const attendees = await getOrSetCache(
        `attendee:${socket.id}`,
        async () => {
          const doc = await attendeesCRUD.addAttendee(newUser);
          return doc!;
        }
      );
      const room = await roomsCRUD.addRoomAttendee(roomId, { _id: attendees._id.toString() });
      updateCache(`roomId:${roomId}`, room);
      socket.join(roomId);

      socket.emit("selfSocketId", { selfSocketId: socket.id });

      room!.attendees_id.forEach((attendee) => {
        if (attendee.socketId !== socket.id) {
          io.to(attendee.socketId).emit("connectRequest", {
            connUserSocketId: socket.id,
            username: username,
          });
        }
      });

      io.to(roomId).emit("roomUpdate", { attendees: room!.attendees_id });
    } catch (error) {
      console.error("cache error: ", error);
    }
  };
}
