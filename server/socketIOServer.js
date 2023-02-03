const app = require("./app");
const socketUtils = require("./utils/socketUtils");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const server = http.createServer(app);

let rooms = []; //{roomId, attendees}
let attendees = []; //{username, userId, roomId, socket.id,}

app.get("/api/room/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  let room = "";
  rooms.forEach((roomValue) => {
    if (roomId === roomValue.roomId) {
      room = roomValue;
    }
  });

  if (room) {
    if (room.attendees.length > 5) {
      //meeting constrain 5 people
      return res
        .send({ exist: true, join: false, message: "room is full" })
        .status(400);
    } else {
      return res
        .send({ exist: true, join: true, message: "join the room" })
        .status(200);
    }
  } else {
    return res
      .send({ exist: false, join: false, message: "room not exist" })
      .status(404);
  }
});

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
function startConnection(data, socket) {
  const { connUserSocketId } = data;

  //find attendee's username
  let username = "";
  attendees.forEach((attendee) => {
    if (attendee.socketId === socket.id) {
      username = attendee.username;
    }
  });
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

function disconnectHandler(socket) {
  console.log("disconnect");
  let user = "";
  let room = "";
  attendees.forEach((attendee) => {
    if (socket.id === attendee.socketId) {
      user = attendee;
    }
  });

  if (user) {
    rooms.forEach((roomValue) => {
      if (user.roomId === roomValue.roomId) {
        room = roomValue;
      }
    });
    //remove attendee from room obj
    room.attendees = room.attendees.filter(
      (user) => user.socketId !== socket.id
    );
    //leave socket io room
    socket.leave(user.roomId);

    //inform all attendees in the room, update room
    if (room.attendees.length === 0) {
      //room empty
      rooms = rooms.filter((roomValue) => room.roomId !== roomValue.roomId);
    } else {
      //inform other attendee I leave
      io.to(room.roomId).emit("userLeave", { socketId: socket.id });

      //remove from attendee list
      io.to(room.roomId).emit("roomUpdate", { attendees: room.attendees });
    }
  }
}

function hostHandler(info, socket) {
  console.log("host a meeting");
  const { isHost, username } = info;
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
    socketId: socket.id,
  };
  const newRoom = {
    roomId: roomId,
    attendees: [newUser],
  };

  //update connected attendees
  attendees = [...attendees, newUser];
  //join the room
  socket.join(roomId);
  //update rooms
  rooms = [...rooms, newRoom];
  //store self socket id
  socket.emit("selfSocketId", { selfSocketId: socket.id });
  //pass roomId to client
  socket.emit("roomId", { roomId });
  //update the room attendees
  socket.emit("roomUpdate", { attendees: newRoom.attendees });
}

function joinHandler(info, socket) {
  console.log("join the meeting");
  const { isHost, username, roomId } = info;
  const userId = uuidv4();
  const newUser = {
    username: username,
    isHost: isHost,
    userId: userId,
    roomId: roomId,
    socketId: socket.id,
  };

  let room = "";
  rooms.forEach((roomValue) => {
    if (roomId === roomValue.roomId) {
      room = roomValue;
    }
  });
  //update attendees array
  attendees = [...attendees, newUser];
  //update room array connected attendees
  room.attendees = [...room.attendees, newUser];
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
