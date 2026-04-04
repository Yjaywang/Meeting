import { createAsyncThunk } from "@reduxjs/toolkit";

interface UserData {
  username: string;
  email: string;
  avatar: string;
  googleId: string;
}

interface InitializeUserResult {
  accessToken: string;
  user: UserData;
}

export const initializeUser = createAsyncThunk<InitializeUserResult>(
  "user/initialize",
  async () => {
    const refreshResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/refresh`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const refreshData = await refreshResponse.json();

    if (!refreshData.ok) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/auth`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
      }
    );
    const responseData = await response.json();

    return {
      accessToken: refreshData.accessToken,
      user: {
        username: responseData.data.username,
        email: responseData.data.email,
        avatar: responseData.data.avatar,
        googleId: responseData.data.googleId,
      },
    };
  }
);
