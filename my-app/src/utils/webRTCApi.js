import { setInitLoading } from "../store/actions";
import store from "../store/store";
import { hostMeeting, joinMeeting } from "./webSocketApi";

export const startCall = async (isHost, username, roomId = null) => {
  try {
    let localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    console.log("receive local stream success!");

    store.dispatch(setInitLoading(false)); //disable loading svg

    isHost ? hostMeeting(username) : joinMeeting(username, roomId);
  } catch (error) {
    console.log(`startCall error: ${error}`);
  }
};
