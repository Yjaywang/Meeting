const express = require("express");
const router = express.Router();
const passport = require("passport");
const roomController = require("../controllers/roomController");

router.post("/", roomController.addRoom);
// const Room = require("../models/Room");

// router.get("/room/:roomId", async (req, res) => {
//   const roomId = req.params.roomId;
//   let room = "";

//   try {
//     const doc = await Room.findOne({ roomId: roomId });
//   } catch (error) {
//     console.error("db error: ", error.message);
//     res.status(500).send({ error: true, message: "db error" });
//   }

//   rooms.forEach((roomValue) => {
//     if (roomId === roomValue.roomId) {
//       room = roomValue;
//     }
//   });

//   if (room) {
//     if (room.attendees.length > 5) {
//       //meeting constrain 5 people
//       return res
//         .status(400)
//         .send({ exist: true, join: false, message: "room is full" });
//     } else {
//       return res
//         .status(200)
//         .send({ exist: true, join: true, message: "join the room" });
//     }
//   } else {
//     return res
//       .status(404)
//       .send({ exist: false, join: false, message: "room not exist" });
//   }
// });
module.exports = router;
// module.exports = { router, rooms };
