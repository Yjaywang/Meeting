const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendeesSchema = new Schema({
  username: { type: String },
  isHost: { type: Boolean },
  userId: { type: String },
  roomId: { type: String },
  avatar: { type: String },
  socketId: { type: String },
});

module.exports = mongoose.model("Attendees", attendeesSchema);
