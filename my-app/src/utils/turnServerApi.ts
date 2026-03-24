import { getTwilioDataApi } from "./fetchTwilioDataApi";

let TURNIceServers: RTCIceServer[] | null = null;

export async function fetchTURNCredentials(): Promise<RTCIceServer[] | null> {
  try {
    const data = await getTwilioDataApi();

    if (data.token?.iceServers) {
      TURNIceServers = data.token.iceServers;
    }
    return TURNIceServers;
  } catch (error) {
    console.log("error: ", error);
  }
  return TURNIceServers;
}

export function getTURNCredentials(): RTCIceServer[] | null {
  return TURNIceServers;
}
