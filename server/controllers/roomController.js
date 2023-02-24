require("dotenv").config();
const Rooms = require("../models/Rooms");
const roomsCRUD = require("../models/roomsCRUD");

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

async function checkRoom(req, res) {
  const roomId = req.params.roomId;
  try {
    const room = await roomsCRUD.findRoom(roomId);
    if (room) {
      if (room.attendees.length > 10) {
        //for test, add to 50
        //meeting constrain 10 people
        return res
          .status(400)
          .send({ exist: true, join: false, message: "room is full" });
      } else {
        return res
          .status(200)
          .send({ exist: true, join: true, message: "join the room" });
      }
    } else {
      return res
        .status(404)
        .send({ exist: false, join: false, message: "room not exist" });
    }
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

module.exports = { checkRoom };
