import type { RootState } from "../store";

export const selectIsMuted = (state: RootState) => state.media.isMuted;
export const selectIsCamOff = (state: RootState) => state.media.isCamOff;
export const selectIsShare = (state: RootState) => state.media.isShare;
export const selectIsOtherShare = (state: RootState) =>
  state.media.isOtherShare;
export const selectIsRecording = (state: RootState) =>
  state.media.isRecording;
