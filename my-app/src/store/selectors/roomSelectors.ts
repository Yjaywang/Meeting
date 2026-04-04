import type { RootState } from "../store";

export const selectRoomId = (state: RootState) => state.room.roomId;
export const selectIsHost = (state: RootState) => state.room.isHost;
export const selectSelfSocketId = (state: RootState) =>
  state.room.selfSocketId;
export const selectAttendees = (state: RootState) => state.room.attendees;
export const selectAttendCount = (state: RootState) =>
  state.room.attendees.length;
export const selectInitLoading = (state: RootState) => state.room.initLoading;
