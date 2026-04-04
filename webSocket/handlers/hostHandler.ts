import { v4 as uuidv4 } from "uuid";
import * as attendeesCRUD from "@shared/models/attendeesCRUD";
import * as roomsCRUD from "@shared/models/roomsCRUD";
import { getOrSetCache } from "@shared/redis";
import { HostMeetingPayload } from "@shared/types/socket-events";
import { AttendeeData } from "@shared/types/models";
import type { TypedIO, TypedSocket } from "../types";

export function createHostHandler(io: TypedIO) {
  return async (info: HostMeetingPayload, socket: TypedSocket): Promise<void> => {
    console.log("host a meeting");
    const { isHost, username, avatar } = info;
    const temp = uuidv4().split("-");
    const roomId = `${temp[0].slice(0, 3)}-${temp[1].slice(0, 3)}-${temp[2].slice(0, 3)}`;
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
      const addedAttendee = await getOrSetCache(
        `attendee:${socket.id}`,
        async () => {
          const doc = await attendeesCRUD.addAttendee(newUser);
          return doc!;
        }
      );
      const newRoom = {
        roomId: roomId,
        attendees_id: [addedAttendee._id],
      };

      socket.join(roomId);
      await getOrSetCache(`roomId:${roomId}`, async () => {
        const doc = await roomsCRUD.addRoom(newRoom);
        return doc!;
      });
      socket.emit("selfSocketId", { selfSocketId: socket.id });
      socket.emit("roomId", { roomId });
      socket.emit("roomUpdate", { attendees: [addedAttendee] });
    } catch (error) {
      console.error("cache error: ", error);
    }
  };
}
