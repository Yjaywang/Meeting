require("dotenv").config();

const roomsCRUD = require("../models/roomsCRUD");

async function checkRoom(req, res) {
  const roomId = req.params.roomId;
  try {
    const room = await roomsCRUD.findRoom(roomId);
    console.log(room);
    if (room) {
      if (room.attendees_id.length > 10) {
        //meeting attendee constrain set 10 people in a room
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
