import io from "socket.io-client";
import { setAttendees, setRoomId, setSelfSocketId } from "../store/actions";
import store from "../store/store";
import {
  newPeerConnect,
  signalingDataHandler,
  removePeerConnection,
} from "./webRTCApi";
import { updateDomId, removeLeavePeerSharingState } from "./peerDOMHandler";

let socket = null;

export const connectSocketIOServer = () => {
  socket = io(`${process.env.REACT_APP_API_URL}`);
  socket.on("connect", () => {
    console.log("connect webSocket server success!");
  });
  socket.on("roomId", (data) => {
    const { roomId } = data;
    store.dispatch(setRoomId(roomId));
  });
  socket.on("selfSocketId", (data) => {
    const { selfSocketId } = data;
    store.dispatch(setSelfSocketId(selfSocketId));
    //update your initial Dom data
    updateDomId(selfSocketId);
  });
  socket.on("roomUpdate", (data) => {
    const { attendees } = data;
    store.dispatch(setAttendees(attendees));
  });

  socket.on("connectRequest", (data) => {
    const { connUserSocketId, username } = data;

    //false means don't make connection, we need to check other's answer
    newPeerConnect(connUserSocketId, username, false);

    //inform new comer, attendees already answer, you can start connect
    //here connUserSocketId is new comer's
    socket.emit("connectStart", {
      connUserSocketId: connUserSocketId,
    });
  });
  socket.on("connectSignal", (data) => {
    signalingDataHandler(data);
  });
  socket.on("connectStart", (data) => {
    const { connUserSocketId, username } = data; //attendee's socket id
    newPeerConnect(connUserSocketId, username, true);
  });

  socket.on("userLeave", (data) => {
    removeLeavePeerSharingState(data);
    removePeerConnection(data);
  });
};

export const hostMeeting = (isHost, username, avatar) => {
  const info = {
    isHost,
    username,
    avatar,
  };
  socket.emit("hostMeeting", info);
};

export const joinMeeting = (isHost, username, roomId, avatar) => {
  const info = {
    isHost,
    username,
    roomId,
    avatar,
  };
  socket.emit("joinMeeting", info);
};

export const signalPeerData = (signalData) => {
  socket.emit("connectSignal", signalData);
};
