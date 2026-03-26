import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRecording } from "../../types/models";
import { ClientSchedule } from "../../types/redux";

interface DataState {
  recording: IRecording[] | null;
  schedule: ClientSchedule | null;
}

const initialState: DataState = {
  recording: null,
  schedule: null,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setRecording: (state, action: PayloadAction<IRecording[] | null>) => {
      state.recording = action.payload;
    },
    setSchedule: (state, action: PayloadAction<ClientSchedule | null>) => {
      state.schedule = action.payload;
    },
  },
});

export const { setRecording, setSchedule } = dataSlice.actions;
