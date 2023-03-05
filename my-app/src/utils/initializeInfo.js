import {
  setAvatar,
  setDefaultUsername,
  setEmail,
  setGoogleId,
  setIsSignIn,
} from "../store/actions";
import store from "../store/store";
export async function initialize() {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshResponseData = await refreshResponse.json();

    if (refreshResponseData.ok) {
      store.dispatch(setIsSignIn(true));
    } else {
      store.dispatch(setIsSignIn(false));
      return;
    }

    const accessToken = refreshResponseData.accessToken;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/auth`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const responseData = await response.json();
    store.dispatch(setDefaultUsername(responseData.data.username));
    store.dispatch(setEmail(responseData.data.email));
    store.dispatch(setAvatar(responseData.data.avatar));
    store.dispatch(setGoogleId(responseData.data.googleId));
    return refreshResponseData;
  } catch (error) {
    console.error(error);
  }
}
