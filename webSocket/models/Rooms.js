const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomsSchema = new Schema({
  roomId: { type: String, required: true },
  isReserved: { type: Boolean, default: false },
  attendees: [
    {
      username: { type: String },
      isHost: { type: Boolean },
      userId: { type: String },
      roomId: { type: String },
      avatar: { type: String },
      socketId: { type: String },
    },
  ],
});

module.exports = mongoose.model("Rooms", roomsSchema);
