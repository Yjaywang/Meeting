import { v4 as uuidv4 } from "uuid";
import * as attendeesCRUD from "@shared/models/attendeesCRUD";
import * as roomsCRUD from "@shared/models/roomsCRUD";
import { getOrSetCache, updateCache } from "@shared/redis";
import { JoinMeetingPayload } from "@shared/types/socket-events";
import { AttendeeData, IRoomPopulated } from "@shared/types/models";
import type { TypedIO, TypedSocket } from "../types";

const MAX_ROOM_CAPACITY = 10;

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
      const existingRoom = await getOrSetCache<IRoomPopulated | null>(`roomId:${roomId}`, async () => {
        return await roomsCRUD.findRoom(roomId);
      });

      if (!existingRoom) {
        socket.emit("socketError", { message: "Room not found" });
        return;
      }

      if (existingRoom.attendees_id.length >= MAX_ROOM_CAPACITY) {
        socket.emit("socketError", { message: "Room is full" });
        return;
      }

      const attendee = await attendeesCRUD.addAttendee(newUser);
      updateCache(`attendee:${socket.id}`, attendee);

      const room = await roomsCRUD.addRoomAttendee(roomId, { _id: attendee._id.toString() });
      if (!room) {
        socket.emit("socketError", { message: "Failed to join room" });
        return;
      }
      updateCache(`roomId:${roomId}`, room);
      socket.join(roomId);

      socket.emit("selfSocketId", { selfSocketId: socket.id });

      room.attendees_id.forEach((att) => {
        if (att.socketId !== socket.id) {
          io.to(att.socketId).emit("connectRequest", {
            connUserSocketId: socket.id,
            username: username,
          });
        }
      });

      io.to(roomId).emit("roomUpdate", { attendees: room.attendees_id });
    } catch (error) {
      console.error("joinMeeting error: ", error);
      socket.emit("socketError", { message: "Failed to join meeting" });
    }
  };
}
