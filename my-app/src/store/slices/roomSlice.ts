import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAttendee } from "../../types/models";

interface RoomState {
  roomId: string;
  isHost: boolean;
  selfSocketId: string;
  attendees: IAttendee[];
  initLoading: boolean;
}

const initialState: RoomState = {
  roomId: "",
  isHost: false,
  selfSocketId: "",
  attendees: [],
  initLoading: true,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setIsRoomHost: (state, action: PayloadAction<boolean>) => {
      state.isHost = action.payload;
    },
    setSelfSocketId: (state, action: PayloadAction<string>) => {
      state.selfSocketId = action.payload;
    },
    setAttendees: (state, action: PayloadAction<IAttendee[]>) => {
      state.attendees = action.payload;
    },
    setInitLoading: (state, action: PayloadAction<boolean>) => {
      state.initLoading = action.payload;
    },
  },
});

export const {
  setRoomId,
  setIsRoomHost,
  setSelfSocketId,
  setAttendees,
  setInitLoading,
} = roomSlice.actions;
