const app = require("./app");
const socketUtils = require("./utils/socketUtils");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const server = http.createServer(app);
const attendeesCRUD = require("./models/attendeesCRUD");
const roomsCRUD = require("./models/roomsCRUD");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connect", (socket) => {
  console.log(`user connected, ${socket.id}`);
  socket.on("host-Meeting", (info) => {
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
});

//attendees send answer to new comer can connect
async function startConnection(data, socket) {
  const { connUserSocketId } = data;

  //find attendee's username
  const attendee = await attendeesCRUD.findAttendee(socket.id);
  const username = attendee.username;

  //here is attendee's socketId and username to new comer
  const startConnectionData = {
    connUserSocketId: socket.id,
    username: username,
  };
  io.to(connUserSocketId).emit("connectStart", startConnectionData);
}

function signalHandler(data, socket) {
  const { connUserSocketId, signal } = data;
  const newSignalingData = { signal: signal, connUserSocketId: socket.id }; //socket id need to change as attendee's, this data will return to new comer?
  io.to(connUserSocketId).emit("connectSignal", newSignalingData);
}

async function disconnectHandler(socket) {
  console.log("disconnect");

  const attendee = await attendeesCRUD.findAttendee(socket.id);

  if (attendee) {
    let room = await roomsCRUD.findRoom(attendee.roomId);

    //remove attendee from room obj
    room = await roomsCRUD.deleteRoomAttendee(
      attendee.roomId,
      attendee.socketId
    );
    //leave socket io room
    socket.leave(attendee.roomId);

    //inform all attendees in the room, update room
    if (room.attendees.length === 0) {
      //room empty, remove room
      room = await roomsCRUD.deleteRoom(attendee.roomId);
    } else {
      //inform other attendee I leave
      io.to(room.roomId).emit("userLeave", { socketId: socket.id });

      //remove from attendee list
      io.to(room.roomId).emit("roomUpdate", { attendees: room.attendees });

      //remove from attendees collection
      const attendees = await attendeesCRUD.deleteAttendee(attendee.socketId);
    }
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
  const newRoom = {
    roomId: roomId,
    attendees: [newUser],
  };

  //update connected attendees collection
  const attendees = await attendeesCRUD.addAttendee(newUser);
  //join the room
  socket.join(roomId);
  //update rooms collection
  const rooms = await roomsCRUD.addRoom(newRoom);
  //store self socket id
  socket.emit("selfSocketId", { selfSocketId: socket.id });
  //pass roomId to client
  socket.emit("roomId", { roomId });
  //update the room attendees
  socket.emit("roomUpdate", { attendees: newRoom.attendees });
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

  let room = await roomsCRUD.findRoom(roomId);

  //update attendees collection
  const attendees = await attendeesCRUD.addAttendee(newUser);
  //update room attendees
  room = await roomsCRUD.addRoomAttendee(roomId, newUser);
  //join the room
  socket.join(roomId);

  //store self socket id
  socket.emit("selfSocketId", { selfSocketId: socket.id });

  //new comer send connect req(self-socketId) to all the other attendee
  room.attendees.forEach((attendee) => {
    if (attendee.socketId !== socket.id) {
      //not the new comer
      //new comer emit connect request 1 by 1 to all attendees

      io.to(attendee.socketId).emit("connectRequest", {
        connUserSocketId: socket.id,
        username: username,
      });
    }
  });

  //update to all attendee
  io.to(roomId).emit("roomUpdate", { attendees: room.attendees });
}

module.exports = { server, io };
