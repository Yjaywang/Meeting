import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  defaultUsername: string;
  username: string;
  googleId: string;
  avatar: string;
  email: string;
  isSignIn: boolean;
}

const initialState: UserState = {
  defaultUsername: "",
  username: "",
  googleId: "",
  avatar: "",
  email: "",
  isSignIn: false,
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
});

export const {
  setDefaultUsername,
  setUsername,
  setGoogleId,
  setAvatar,
  setEmail,
  setIsSignIn,
} = userSlice.actions;
