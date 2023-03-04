require("dotenv").config();
const Rooms = require("./Rooms");

//return this room's doc
async function addRoom(room) {
  console.log(room);
  try {
    const doc = await Rooms.create(room);
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
async function addRoomAttendee(roomId, attendee) {
  const update = { $push: { attendees: [attendee] } };
  try {
    const doc = await Rooms.findOneAndUpdate({ roomId: roomId }, update, {
      returnOriginal: false,
    });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}
//return after attendee remove, the updated doc( if no attendee, attendees:[] )
async function deleteRoomAttendee(roomId, socketId) {
  const deleteObj = { $pull: { attendees: { socketId: socketId } } };
  try {
    const doc = await Rooms.findOneAndUpdate({ roomId: roomId }, deleteObj, {
      returnOriginal: false,
    });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

//return this room's doc
async function findRoom(roomId) {
  try {
    const doc = await Rooms.findOne({ roomId: roomId });
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
