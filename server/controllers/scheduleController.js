require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

///need to review
async function addSchedule(req, res) {
  const userId = req.userId;
  const schedule = req.body;
  const update = { $push: { schedule: [schedule] } };
  try {
    const doc = await User.findByIdAndUpdate(userId, update, {
      returnOriginal: false,
    });

    for (let docSchedule of doc.schedule) {
      if (docSchedule.roomId === schedule.roomId) {
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

async function deleteSchedule(req, res) {
  const userId = req.userId;
  const roomId = req.body.roomId;
  const deleteObj = {
    $pull: { schedule: { roomId: roomId } },
  }; //use roomId find obj
  try {
    const doc = await User.findByIdAndUpdate(userId, deleteObj, {
      returnOriginal: false,
    });

    for (let docSchedule of doc.schedule) {
      if (docSchedule.roomId === roomId) {
        res.status(400).send({ error: true, message: "delete fail" });
        return;
      }
    }

    res.status(200).send({ ok: true });
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

module.exports = { addSchedule, deleteSchedule };
