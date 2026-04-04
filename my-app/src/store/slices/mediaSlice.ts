import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MediaState {
  isMuted: boolean;
  isCamOff: boolean;
  isShare: boolean;
  isOtherShare: boolean;
  isRecording: boolean;
}

const initialState: MediaState = {
  isMuted: true,
  isCamOff: false,
  isShare: false,
  isOtherShare: false,
  isRecording: false,
};

export const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setIsMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    setIsCamOff: (state, action: PayloadAction<boolean>) => {
      state.isCamOff = action.payload;
    },
    setIsShare: (state, action: PayloadAction<boolean>) => {
      state.isShare = action.payload;
    },
    setIsOtherShare: (state, action: PayloadAction<boolean>) => {
      state.isOtherShare = action.payload;
    },
    setIsRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
  },
});

export const {
  setIsMuted,
  setIsCamOff,
  setIsShare,
  setIsOtherShare,
  setIsRecording,
} = mediaSlice.actions;
