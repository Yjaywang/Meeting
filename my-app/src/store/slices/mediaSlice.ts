import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MediaState {
  isMuted: boolean;
  isCamOff: boolean;
  isShare: boolean;
  isOtherShare: boolean;
  isRecording: boolean;
  videoRegionHeight: number;
  videoRegionWidth: number;
}

const initialState: MediaState = {
  isMuted: true,
  isCamOff: false,
  isShare: false,
  isOtherShare: false,
  isRecording: false,
  videoRegionHeight: 0,
  videoRegionWidth: 0,
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
    setVideoRegionHeight: (state, action: PayloadAction<number>) => {
      state.videoRegionHeight = action.payload;
    },
    setVideoRegionWidth: (state, action: PayloadAction<number>) => {
      state.videoRegionWidth = action.payload;
    },
  },
});

export const {
  setIsMuted,
  setIsCamOff,
  setIsShare,
  setIsOtherShare,
  setIsRecording,
  setVideoRegionHeight,
  setVideoRegionWidth,
} = mediaSlice.actions;
