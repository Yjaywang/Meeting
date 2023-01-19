import io from "socket.io-client";
import { setRoomId } from "../store/actions";
import store from "../store/store";
let socket = null;
const backendServer = "http://localhost:5000";

export const connectSocketIOServer = () => {
  socket = io(backendServer);
  socket.on("connect", () => {
    console.log("connect backendServer socket success!");
  });
  socket.on("roomId", (data) => {
    const { roomId } = data;
    store.dispatch(setRoomId(roomId));
  });
};

export const hostMeeting = (username) => {
  const info = {
    username,
  };
  socket.emit("host-Meeting", info);
};

export const joinMeeting = (username, roomId) => {
  const info = {
    username,
    roomId,
  };
  socket.emit("joinMeeting", info);
};
