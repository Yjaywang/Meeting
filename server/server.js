const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const twilio = require("twilio");
const Api = require("twilio/lib/rest/Api");

const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);

app.use(cors());

let rooms = []; //{roomId, attendees}
let attendees = []; //{username, userId, roomId, socket.id,}

app.get("/api/checkroom/:roomId", (req, res) => {
  const roomId = req.params;
  const room = "";
  rooms.forEach((roomValue) => {
    if (roomId === roomValue) {
      room = roomValue;
    }
  });
  if (room) {
    if (room.attendees > 5) {
      //meeting constrain 5 people
      return res
        .send({ exist: true, join: false, message: "full" })
        .status(400);
    } else {
      return res
        .send({ exist: true, join: true, message: "join the room" })
        .status(200);
    }
  } else {
    return res.send({ exist: false }).status(404);
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
});

function hostHandler(info, socket) {
  console.log("host a meeting");
  const { username } = info;
  const roomId = uuidv4();
  const newUser = {
    username: username,
    userId: uuidv4(),
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
  //pass roomId to client
  socket.emit("roomId", { roomId });
}

server.listen(PORT, () => {
  console.log(`PORT: ${PORT} listened by server.`);
});
