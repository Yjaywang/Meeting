require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const allowedOrigins = require("./configs/allowedOrigins");
app.use(cors({ origin: allowedOrigins, credentials: true }));
//----------------------------------------------------------------
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const server = http.createServer(app);
const attendeesCRUD = require("./models/attendeesCRUD");
const roomsCRUD = require("./models/roomsCRUD");
const {
  redisClient,
  getOrSetCache,
  leaveAndCleanCache,
  updateCache,
} = require("./redis");
const DEFAULT_EXPIRATION = process.env.DEFAULT_EXPIRATION;

const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
//------------------socket.io redis adapter------------------------
const pubClient = createClient({
  url: `redis://${process.env.elasticache}:6379`,
});
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  io.listen(3000);
});
//------------------socket.io------------------------
io.on("connect", (socket) => {
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
    //connUserSocketId: new comer, socket: attendee
    startConnection(data, socket);
  });
  //// send state
  socket.on("sendEmotion", (data) => {
    sendEmotionHandler(data, socket);
  });
  socket.on("sendShareState", (data) => {
    sendShareStateHandler(data, socket);
  });
  socket.on("sendRecordingState", (data) => {
    sendRecordingStateHandler(data, socket);
  });
  socket.on("sendCamState", (data) => {
    sendCamStateHandler(data, socket);
  });
  socket.on("sendMicState", (data) => {
    sendMicStateHandler(data, socket);
  });
  socket.on("sendMicVolume", (data) => {
    sendMicVolumeHandler(data, socket);
  });
  socket.on("sendChatMessage", (data) => {
    sendChatMessageHandler(data, socket);
  });
  //// send init state to new comer
  socket.on("sendInitVideoStateToPeer", (data) => {
    sendInitVideoStateToPeerHandler(data);
  });
  socket.on("sendInitAudioStateToPeer", (data) => {
    sendInitAudioStateToPeerHandler(data);
  });
  socket.on("sendInitSharingStateToPeer", (data) => {
    sendInitSharingStateToPeerHandler(data);
  });
  socket.on("sendInitRecordingStateToPeer", (data) => {
    sendInitRecordingStateToPeerHandler(data);
  });
});

function sendInitRecordingStateToPeerHandler(data) {
  const { newComerSocketId } = data;
  io.to(newComerSocketId).emit("sendInitRecordingStateToPeer", data);
}
function sendInitSharingStateToPeerHandler(data) {
  const { newComerSocketId } = data;
  io.to(newComerSocketId).emit("sendInitSharingStateToPeer", data);
}
function sendInitAudioStateToPeerHandler(data) {
  const { newComerSocketId } = data;
  io.to(newComerSocketId).emit("sendInitAudioStateToPeer", data);
}
function sendInitVideoStateToPeerHandler(data) {
  const { newComerSocketId } = data;
  io.to(newComerSocketId).emit("sendInitVideoStateToPeer", data);
}

async function sendChatMessageHandler(data, socket) {
  //find room cache
  const { roomId } = data;
  try {
    let room = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.findRoom(roomId);
      return doc;
    });

    room.attendees_id.forEach((attendee) => {
      if (attendee.socketId !== socket.id) {
        io.to(attendee.socketId).emit("sendChatMessage", data);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}

async function sendMicVolumeHandler(data, socket) {
  //find room cache
  const { roomId } = data;
  try {
    let room = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.findRoom(roomId);
      return doc;
    });

    room.attendees_id.forEach((attendee) => {
      if (attendee.socketId !== socket.id) {
        io.to(attendee.socketId).emit("sendMicVolume", data);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}
async function sendMicStateHandler(data, socket) {
  //find room cache
  const { roomId } = data;
  try {
    let room = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.findRoom(roomId);
      return doc;
    });

    room.attendees_id.forEach((attendee) => {
      if (attendee.socketId !== socket.id) {
        io.to(attendee.socketId).emit("sendMicState", data);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}
async function sendCamStateHandler(data, socket) {
  //find room cache
  const { roomId } = data;
  try {
    let room = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.findRoom(roomId);
      return doc;
    });

    room.attendees_id.forEach((attendee) => {
      if (attendee.socketId !== socket.id) {
        io.to(attendee.socketId).emit("sendCamState", data);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}

async function sendRecordingStateHandler(data, socket) {
  //find room cache
  const { roomId } = data;
  try {
    let room = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.findRoom(roomId);
      return doc;
    });

    room.attendees_id.forEach((attendee) => {
      if (attendee.socketId !== socket.id) {
        io.to(attendee.socketId).emit("sendRecordingState", data);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}
async function sendShareStateHandler(data, socket) {
  //find room cache
  const { roomId } = data;
  try {
    let room = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.findRoom(roomId);
      return doc;
    });

    room.attendees_id.forEach((attendee) => {
      if (attendee.socketId !== socket.id) {
        io.to(attendee.socketId).emit("sendShareState", data);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}
async function sendEmotionHandler(data, socket) {
  //find room cache
  const { roomId } = data;
  try {
    let room = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.findRoom(roomId);
      return doc;
    });

    room.attendees_id.forEach((attendee) => {
      if (attendee.socketId !== socket.id) {
        io.to(attendee.socketId).emit("sendEmotion", data);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}

//attendees send answer to new comer can connect
async function startConnection(data, socket) {
  const { connUserSocketId } = data;
  try {
    //find attendee's username
    const attendee = await getOrSetCache(`attendee:${socket.id}`, async () => {
      const doc = await attendeesCRUD.findAttendee(socket.id);
      return doc;
    });
    const username = attendee.username;

    //here is attendee's socketId and username to new comer
    const startConnectionData = {
      connUserSocketId: socket.id,
      username: username,
    };
    io.to(connUserSocketId).emit("connectStart", startConnectionData);
  } catch (error) {
    console.error("cache error: ", error);
  }
}

function signalHandler(data, socket) {
  const { connUserSocketId, signal } = data;
  //socket id need to change as mine, and signal data is mine
  // sent my signal data and id to new comer to push on his/her peer array
  const newSignalingData = { signal: signal, connUserSocketId: socket.id };
  io.to(connUserSocketId).emit("connectSignal", newSignalingData);
}

async function disconnectHandler(socket) {
  console.log("disconnect");
  try {
    const attendee = await getOrSetCache(`attendee:${socket.id}`, async () => {
      const doc = await attendeesCRUD.findAttendee(socket.id);
      return doc;
    });
    if (attendee) {
      let room = await getOrSetCache(`roomId:${attendee.roomId}`, async () => {
        const doc = await roomsCRUD.findRoom(attendee.roomId);
        return doc;
      });
      //remove attendee from room obj
      room = await roomsCRUD.deleteRoomAttendee(attendee.roomId, attendee._id);
      //update room cache
      updateCache(`roomId:${attendee.roomId}`, room);

      //remove from attendees collection
      const leaveAttendee = await attendeesCRUD.deleteAttendee(
        attendee.socketId
      );
      //clean attendee cache
      leaveAndCleanCache(`attendee:${socket.id}`);

      //leave socket io room
      socket.leave(attendee.roomId);

      //inform all attendees in the room, update room
      if (room.attendees_id.length === 0) {
        //room empty, remove room
        room = await roomsCRUD.deleteRoom(attendee.roomId);
        //clean room cache
        leaveAndCleanCache(`roomId:${attendee.roomId}`);
      } else {
        //inform other attendee I leave
        io.to(room.roomId).emit("userLeave", { socketId: socket.id });

        //remove from attendee list
        io.to(room.roomId).emit("roomUpdate", { attendees: room.attendees_id });
      }
    } else {
      //clean attendee cache
      leaveAndCleanCache(`attendee:${socket.id}`);
    }
  } catch (error) {
    console.error("cache error: ", error);
  }
}

async function hostHandler(info, socket) {
  console.log("host a meeting");
  const { isHost, username, avatar } = info;
  const temp = uuidv4().split("-");
  const roomId = `${temp[0].slice(0, 3)}-${temp[1].slice(0, 3)}-${temp[2].slice(
    0,
    3
  )}`;
  const userId = uuidv4();
  const newUser = {
    username: username,
    isHost: isHost,
    userId: userId,
    roomId: roomId,
    avatar: avatar,
    socketId: socket.id,
  };

  try {
    //update connected attendees collection
    //set cache
    const addAttendee = await getOrSetCache(
      `attendee:${socket.id}`,
      async () => {
        const doc = await attendeesCRUD.addAttendee(newUser);
        return doc;
      }
    );
    const newRoom = {
      roomId: roomId,
      attendees_id: [addAttendee._id],
    };

    //join the room
    socket.join(roomId);
    //update rooms collection
    //set cache
    const rooms = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.addRoom(newRoom);
      return doc;
    });
    //store self socket id
    socket.emit("selfSocketId", { selfSocketId: socket.id });
    //pass roomId to client
    socket.emit("roomId", { roomId });
    //update the room attendees
    socket.emit("roomUpdate", { attendees: [newUser] });
  } catch (error) {
    console.error("cache error: ", error);
  }
}

async function joinHandler(info, socket) {
  console.log("join the meeting");
  const { isHost, username, roomId, avatar } = info;
  const userId = uuidv4();
  const newUser = {
    username: username,
    isHost: isHost,
    userId: userId,
    roomId: roomId,
    avatar: avatar,
    socketId: socket.id,
  };

  try {
    //find room cache
    let room = await getOrSetCache(`roomId:${roomId}`, async () => {
      const doc = await roomsCRUD.findRoom(roomId);
      return doc;
    });

    //update attendees collection
    //set cache
    const attendees = await getOrSetCache(`attendee:${socket.id}`, async () => {
      const doc = await attendeesCRUD.addAttendee(newUser);
      return doc;
    });
    //update room attendees
    room = await roomsCRUD.addRoomAttendee(roomId, attendees);
    //update room cache
    updateCache(`roomId:${roomId}`, room);
    //join the room
    socket.join(roomId);

    //store self socket id
    socket.emit("selfSocketId", { selfSocketId: socket.id });

    //new comer send connect req(self-socketId) to all the other attendee
    room.attendees_id.forEach((attendee) => {
      if (attendee.socketId !== socket.id) {
        //not the new comer
        //new comer emit connect request 1 by 1 to all the other attendee

        io.to(attendee.socketId).emit("connectRequest", {
          connUserSocketId: socket.id,
          username: username,
        });
      }
    });

    //update to all attendee
    io.to(roomId).emit("roomUpdate", { attendees: room.attendees_id });
  } catch (error) {
    console.error("cache error: ", error);
  }
}

module.exports = { server, io };
