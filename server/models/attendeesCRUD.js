require("dotenv").config();
const connectDB = require("../configs/dbConfig");
const Attendees = require("./Attendees");
const mongoose = require("mongoose");

const tet = {
  username: "xxxxxx",
  isHost: true,
  userId: "xxxxxxx",
  roomId: "xxxxxxxxxxx",
  socketId: "aaaaass",
};

//connect DB
connectDB();

mongoose.connection.on("error", (err) => {
  console.log("db error: ", err.message);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB using Mongoose and pool");
});

async function addAttendee(attendee) {
  try {
    const doc = await Attendees.create(attendee);
  } catch (error) {
    console.error("db error: ", error.message);
  }
}
// addAttendee(tet);
async function deleteAttendee(socketId) {
  try {
    const doc = await Attendees.findOneAndDelete({
      socketId: socketId,
    });
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

module.exports = { addAttendee, deleteAttendee };
