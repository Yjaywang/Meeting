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

let rooms = [];
let attendees = [];

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
      return req
        .send({ exist: true, join: false, message: "full" })
        .statusCode(400);
    } else {
      return req
        .send({ exist: true, join: true, message: "join the room" })
        .statusCode(200);
    }
  } else {
    return req.send({ exist: false }).statusCode(404);
  }
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, () => {
  console.log(`PORT: ${PORT} listened by server.`);
});
