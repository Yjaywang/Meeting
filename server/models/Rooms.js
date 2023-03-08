const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomsSchema = new Schema({
  roomId: { type: String, required: true },
  isReserved: { type: Boolean, default: false },
  attendees_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendees",
    },
  ],
});

module.exports = mongoose.model("Rooms", roomsSchema);
