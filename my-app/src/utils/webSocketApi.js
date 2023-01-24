import io from "socket.io-client";
import { setAttendees, setRoomId } from "../store/actions";
import store from "../store/store";
import * as webRTCApi from "./webRTCApi";

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
  socket.on("roomUpdate", (data) => {
    const { attendees } = data;
    store.dispatch(setAttendees(attendees));
  });
  socket.on("connectRequest", (data) => {
    const { connUserSocketId } = data;

    //false means don't make connection, we need to check other's answer
    webRTCApi.newPeerConnect(connUserSocketId, false);

    //inform new comer, attendees already answer, you can start connect
    //here connUserSocketId is new comer's
    socket.emit("connectStart", { connUserSocketId: connUserSocketId });
  });
  socket.on("connectSignal", (data) => {
    webRTCApi.signalingDataHandler(data);
  });
  socket.on("connectStart", (data) => {
    const { connUserSocketId } = data; //attendee's socket id
    webRTCApi.newPeerConnect(connUserSocketId, true);
  });

  socket.on("userLeave", (data) => {
    webRTCApi.removePeerConnection(data);
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

export const signalPeerData = (signalData) => {
  socket.emit("connectSignal", signalData);
};
