const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  schedule: [
    {
      topic: { type: String, default: "" },
      startTime: { type: Date },
      endTime: { type: Date },
      roomId: { type: String, default: "" },
    },
  ],
  recording: [
    {
      roomId: { type: String, default: "" },
      recordingTime: { type: Date, default: "" },
      url: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
