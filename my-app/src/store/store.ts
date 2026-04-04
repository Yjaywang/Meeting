import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { roomSlice } from "./slices/roomSlice";
import { mediaSlice } from "./slices/mediaSlice";
import { chatSlice } from "./slices/chatSlice";
import { dataSlice } from "./slices/dataSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    room: roomSlice.reducer,
    media: mediaSlice.reducer,
    chat: chatSlice.reducer,
    data: dataSlice.reducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default store;
