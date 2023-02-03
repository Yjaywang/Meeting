require("dotenv").config();
// const connectDB = require("../configs/dbConfig");
const Rooms = require("./Rooms");
// const mongoose = require("mongoose");

const a = {
  roomId: "test",
  isReserved: false,
  attendees: [
    {
      username: "xxxxxx",
      isHost: true,
      userId: "xxxxxxx",
      roomId: "xxxxxxxxxxx",
      socketId: "xxxxxxxxxxxx",
    },
    {
      username: "xxxxxx",
      isHost: true,
      userId: "xxxxxxx",
      roomId: "xxxxxxxxxxx",
      socketId: "xxxxxxxxxxxx",
    },
    {
      username: "xxxxxx",
      isHost: true,
      userId: "xxxxxxx",
      roomId: "xxxxxxxxxxx",
      socketId: "xxxxxxxxxxxx",
    },
    {
      username: "rrrrr",
      isHost: true,
      userId: "xxxxxxx",
      roomId: "xxxxxxxxxxx",
      socketId: "xdddd",
    },
  ],
};

const b = {
  username: "rrrrr",
  isHost: true,
  userId: "xxxxxxx",
  roomId: "xxxxxxxxxxx",
  socketId: "xdddd",
};

// //connect DB
// connectDB();

// mongoose.connection.on("error", (err) => {
//   console.log("db error: ", err.message);
// });

// mongoose.connection.once("open", () => {
//   console.log("Connected to MongoDB using Mongoose and pool");
// });

async function addRoom(room) {
  console.log(room);
  try {
    const doc = await Rooms.create(room);
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

async function deleteRoom(roomId) {
  try {
    const doc = await Rooms.findOneAndDelete({ roomId: roomId });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

async function addRoomAttendee(roomId, attendee) {
  const update = { $push: { attendees: [attendee] } };
  try {
    const doc = await Rooms.findOneAndUpdate({ roomId: roomId }, update, {
      returnOriginal: false,
    });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

async function deleteRoomAttendee(roomId, socketId) {
  const deleteObj = { $pull: { attendees: { socketId: socketId } } };
  try {
    const doc = await Rooms.findOneAndUpdate({ roomId: roomId }, deleteObj, {
      returnOriginal: false,
    });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

async function findRoom(roomId) {
  try {
    const doc = await Rooms.findOne({ roomId: roomId });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

module.exports = {
  addRoom,
  deleteRoom,
  addRoomAttendee,
  deleteRoomAttendee,
  findRoom,
};
