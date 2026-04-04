import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initializeUser } from "../thunks/initializeUser";

interface UserState {
  defaultUsername: string;
  username: string;
  googleId: string;
  avatar: string;
  email: string;
  isSignIn: boolean;
  initStatus: "idle" | "loading" | "succeeded" | "failed";
  initError: string | null;
}

const initialState: UserState = {
  defaultUsername: "",
  username: "",
  googleId: "",
  avatar: "",
  email: "",
  isSignIn: false,
  initStatus: "idle",
  initError: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setDefaultUsername: (state, action: PayloadAction<string>) => {
      state.defaultUsername = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setGoogleId: (state, action: PayloadAction<string>) => {
      state.googleId = action.payload;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setIsSignIn: (state, action: PayloadAction<boolean>) => {
      state.isSignIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUser.pending, (state) => {
        state.initStatus = "loading";
        state.initError = null;
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        state.initStatus = "succeeded";
        state.isSignIn = true;
        state.defaultUsername = action.payload.user.username;
        state.email = action.payload.user.email;
        state.avatar = action.payload.user.avatar;
        state.googleId = action.payload.user.googleId;
      })
      .addCase(initializeUser.rejected, (state, action) => {
        state.initStatus = "failed";
        state.isSignIn = false;
        state.initError = action.error.message ?? null;
      });
  },
});

export const {
  setDefaultUsername,
  setUsername,
  setGoogleId,
  setAvatar,
  setEmail,
  setIsSignIn,
} = userSlice.actions;
