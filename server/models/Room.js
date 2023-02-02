const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  roomId: { type: String, required: true, unique: true },
  attendees: [
    {
      username: { type: String },
      isHost: { type: Boolean },
      userId: { type: String },
      roomId: { type: String },
      socketId: { type: String },
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
