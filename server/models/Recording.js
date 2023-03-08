const mongoose = require("mongoose");
const { Schema } = mongoose;

const recordingSchema = new Schema({
  roomId: { type: String, default: "" },
  recordingTime: { type: Date, default: "" },
  url: { type: String, default: "" },
});

module.exports = mongoose.model("Recording", recordingSchema);
