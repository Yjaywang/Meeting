import { getTwilioDataApi } from "./getTwilioDataApi";

let TURNIceServers = null;

export async function fetchTURNCredentials() {
  const data = await getTwilioDataApi();

  if (data.token?.iceServers) {
    TURNIceServers = data.token.iceServers;
  }
  return TURNIceServers;
}

export function getTURNCredentials() {
  return TURNIceServers;
}
