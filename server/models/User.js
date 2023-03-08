const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, default: "" },
  avatar: { type: String, default: "" },
  googleId: { type: String, default: "" },
  recording_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recording",
      // roomId: { type: String, default: "" },
      // recordingTime: { type: Date, default: "" },
      // url: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
