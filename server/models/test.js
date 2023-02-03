const attendeesCRUD = require("./attendeesCRUD");

const tet = {
  username: "xxxxxx",
  isHost: true,
  userId: "xxxxxxx",
  roomId: "xxxxxxxxxxx",
  socketId: "aaaaass",
};

attendeesCRUD.addAttendee(tet).then(() => {
  console.log("tttttttttttt");
});
