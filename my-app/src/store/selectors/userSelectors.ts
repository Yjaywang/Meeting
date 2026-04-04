import type { RootState } from "../store";

export const selectDefaultUsername = (state: RootState) =>
  state.user.defaultUsername;
export const selectUsername = (state: RootState) => state.user.username;
export const selectGoogleId = (state: RootState) => state.user.googleId;
export const selectAvatar = (state: RootState) => state.user.avatar;
export const selectEmail = (state: RootState) => state.user.email;
export const selectIsSignIn = (state: RootState) => state.user.isSignIn;
export const selectInitStatus = (state: RootState) => state.user.initStatus;
export const selectInitError = (state: RootState) => state.user.initError;
