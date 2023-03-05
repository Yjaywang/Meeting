import { getTwilioDataApi } from "./fetchTwilioDataApi";

let TURNIceServers = null;

export async function fetchTURNCredentials() {
  try {
    const data = await getTwilioDataApi();

    if (data.token?.iceServers) {
      TURNIceServers = data.token.iceServers;
    }
    return TURNIceServers;
  } catch (error) {
    console.log("error: ", error);
  }
}

export function getTURNCredentials() {
  return TURNIceServers;
}
