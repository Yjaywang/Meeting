require("dotenv").config();
const Rooms = require("./Rooms");
const Attendees = require("./Attendees");

//return this room's doc
async function addRoom(room) {
  try {
    const doc = await Rooms.create(room).populate("attendees_id").exec();

    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}
//return the deleted doc
async function deleteRoom(roomId) {
  try {
    const doc = await Rooms.findOneAndDelete({ roomId: roomId });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}
//return this roomId's doc
async function addRoomAttendee(roomId, result) {
  const update = { $push: { attendees_id: [result._id] } };
  try {
    const doc = await Rooms.findOneAndUpdate({ roomId: roomId }, update, {
      returnOriginal: false,
    })
      .populate("attendees_id")
      .exec();

    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}
//return after attendee remove, the updated doc( if no attendee, attendees:[] )
async function deleteRoomAttendee(roomId, socketId) {
  const deleteObj = { $pull: { attendees_id: { socketId: socketId } } };
  try {
    const doc = await Rooms.findOneAndUpdate({ roomId: roomId }, deleteObj, {
      returnOriginal: false,
    })
      .populate("attendees_id")
      .exec();

    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

//return this room's doc
async function findRoom(roomId) {
  try {
    const doc = await Rooms.findOne({ roomId: roomId })
      .populate("attendees_id")
      .exec();
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

module.exports = {
  addRoom,
  deleteRoom,
  addRoomAttendee,
  deleteRoomAttendee,
  findRoom,
};
