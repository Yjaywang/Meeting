require("dotenv").config();
const Attendees = require("./Attendees");

//return this attendee's doc
async function addAttendee(attendee) {
  try {
    const doc = await Attendees.create(attendee);
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}
// return this attendee's doc
async function deleteAttendee(socketId) {
  try {
    const doc = await Attendees.findOneAndDelete({
      socketId: socketId,
    });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}
//return this attendee's doc
async function findAttendee(socketId) {
  try {
    const doc = await Attendees.findOne({
      socketId: socketId,
    });
    return doc;
  } catch (error) {
    console.error("db error: ", error.message);
  }
}

module.exports = { findAttendee, addAttendee, deleteAttendee };
