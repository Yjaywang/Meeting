require("dotenv").config();
const Rooms = require("../models/Rooms");

///need to review
async function addRoom(req, res) {
  const room = req.body;
  console.log("rrrrr", room);
  try {
    const doc = await Rooms.create(room);
    console.log("tttttttttttt", doc);
    res.status(200).send({ ok: true });
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
  };
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

module.exports = { addRoom };
