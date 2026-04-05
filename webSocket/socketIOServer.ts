import "dotenv/config";
import express from "express";
import cors from "cors";
import allowedOrigins from "./configs/allowedOrigins";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient as createRedisClient } from "redis";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import * as attendeesCRUD from "./models/attendeesCRUD";
import * as roomsCRUD from "./models/roomsCRUD";
import {
  getOrSetCache,
  leaveAndCleanCache,
  updateCache,
} from "./redisCache";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  HostMeetingPayload,
  JoinMeetingPayload,
  ConnectSignalPayload,
  ConnectStartPayload,
  RoomBroadcastPayload,
  InitVideoStatePayload,
  InitAudioStatePayload,
  InitSharingStatePayload,
  InitRecordingStatePayload,
} from "@shared/types/socket-events";
import { AttendeeData, IRoomPopulated } from "@shared/types/models";

const app = express();
app.use(cors({ origin: allowedOrigins, credentials: true }));

const server = http.createServer(app);

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedIO = Server<ClientToServerEvents, ServerToClientEvents>;

const io: TypedIO = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Socket.IO Redis adapter
const pubClient = createRedisClient({
  url: `redis://${process.env.elasticache}:6379`,
});
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  io.listen(3000);
  console.log("socket.io.adapter listen port 3000");
});

// Socket.IO event handlers
io.on("connect", (socket: TypedSocket) => {
  console.log(`user connected, ${socket.id}`);
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
    startConnection(data, socket);
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
    sendInitStateToPeerHandler("sendInitVideoStateToPeer", data);
  });
  socket.on("sendInitAudioStateToPeer", (data) => {
    sendInitStateToPeerHandler("sendInitAudioStateToPeer", data);
  });
  socket.on("sendInitSharingStateToPeer", (data) => {
    sendInitStateToPeerHandler("sendInitSharingStateToPeer", data);
  });
  socket.on("sendInitRecordingStateToPeer", (data) => {
    sendInitStateToPeerHandler("sendInitRecordingStateToPeer", data);
  });
});

type InitStatePayload =
  | InitVideoStatePayload
  | InitAudioStatePayload
  | InitSharingStatePayload
  | InitRecordingStatePayload;

type BroadcastEvent = keyof ServerToClientEvents;

function sendInitStateToPeerHandler<E extends BroadcastEvent>(
  event: E,
  data: Parameters<ServerToClientEvents[E]>[0]
): void {
  const { newComerSocketId } = data as InitStatePayload;
  io.to(newComerSocketId).emit(event, ...[data] as Parameters<ServerToClientEvents[E]>);
}

async function broadcastToRoom<E extends BroadcastEvent>(
  event: E,
  data: Parameters<ServerToClientEvents[E]>[0],
  socket: TypedSocket
): Promise<void> {
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
}

async function startConnection(
  data: ConnectStartPayload,
  socket: TypedSocket
): Promise<void> {
  const { connUserSocketId } = data;
  try {
    const attendee = await getOrSetCache(`attendee:${socket.id}`, async () => {
      const doc = await attendeesCRUD.findAttendee(socket.id);
      return doc!;
    });
    const username = attendee.username;

    const startConnectionData = {
      connUserSocketId: socket.id,
      username: username,
    };
    io.to(connUserSocketId).emit("connectStart", startConnectionData);
  } catch (error) {
    console.error("cache error: ", error);
  }
}

function signalHandler(data: ConnectSignalPayload, socket: TypedSocket): void {
  const { connUserSocketId, signal } = data;
  const newSignalingData = { signal: signal, connUserSocketId: socket.id };
  io.to(connUserSocketId).emit("connectSignal", newSignalingData);
}

async function disconnectHandler(socket: TypedSocket): Promise<void> {
  console.log("disconnect");
  try {
    const attendee = await getOrSetCache(`attendee:${socket.id}`, async () => {
      const doc = await attendeesCRUD.findAttendee(socket.id);
      return doc!;
    });
    if (attendee) {
      let room = await getOrSetCache<IRoomPopulated>(`roomId:${attendee.roomId}`, async () => {
        const doc = await roomsCRUD.findRoom(attendee.roomId);
        return doc!;
      });
      room = (await roomsCRUD.deleteRoomAttendee(
        attendee.roomId,
        attendee._id.toString()
      ))!;
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
}

async function hostHandler(
  info: HostMeetingPayload,
  socket: TypedSocket
): Promise<void> {
  console.log("host a meeting");
  const { isHost, username, avatar } = info;
  const temp = uuidv4().split("-");
  const roomId = `${temp[0].slice(0, 3)}-${temp[1].slice(0, 3)}-${temp[2].slice(
    0,
    3
  )}`;
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
}

async function joinHandler(
  info: JoinMeetingPayload,
  socket: TypedSocket
): Promise<void> {
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
}

export { server, io };
