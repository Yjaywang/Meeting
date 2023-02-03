require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function addRecording(req, res) {
  const userId = req.userId;
  const recording = req.body;
  const update = { $push: { recording: [recording] } };
  try {
    const doc = await User.findByIdAndUpdate(userId, update, {
      returnOriginal: false,
    });

    for (let docRecording of doc.recording) {
      if (docRecording.url === recording.url) {
        res.status(200).send({ ok: true });
        return;
      }
    }

    res.status(400).send({ error: true, message: "update fail" });
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

module.exports = { addRecording };
