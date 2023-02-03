const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendeeSchema = new Schema({
  attendees: [
    {
      username: { type: String, required: true },
      isHost: { type: Boolean, required: true },
      userId: { type: String, required: true },
      roomId: { type: String, required: true },
      socketId: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Attendee", attendeeSchema);
