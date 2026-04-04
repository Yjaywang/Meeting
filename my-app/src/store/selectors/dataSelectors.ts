import type { RootState } from "../store";

export const selectRecording = (state: RootState) => state.data.recording;
export const selectSchedule = (state: RootState) => state.data.schedule;
