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
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
