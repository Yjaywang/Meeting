import { IRecording } from "./models";

// ---- Common Response Types ----

export interface ApiSuccessResponse {
  ok: true;
}

export interface ApiErrorResponse {
  error: true;
  message: string;
}

// ---- User Auth ----

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  ok: true;
  accessToken: string;
  data: {
    username: string;
    avatar: string;
  };
}

export interface SignOutResponse {
  ok: true;
}

// ---- User Profile ----

export interface UpdateUsernameRequest {
  username: string;
}

export interface UpdatePasswordRequest {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePasswordResponse {
  ok: true;
  accessToken: string;
}

export interface UploadImageRequest {
  imageData: string;
  contentType: string;
}

export interface UploadImageResponse {
  ok: true;
  data: {
    Url: string;
  };
}

export interface GetUserInfoResponse {
  data: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    googleId: string;
    recording_id: IRecording[];
  };
}

// ---- Room ----

export interface CheckRoomResponse {
  exist: boolean;
  join: boolean;
  message: string;
}

// ---- Recording ----

// Recording is sent as multipart/form-data with fields: file, fileType, roomId

// ---- Twilio ----

export interface TwilioIceServer {
  urls: string;
  username?: string;
  credential?: string;
}

export interface TwilioTokenResponse {
  token: {
    iceServers: TwilioIceServer[];
  } | null;
}

// ---- Refresh Token ----

export interface RefreshResponse {
  ok: true;
  accessToken: string;
}

// ---- JWT Payload ----

export interface JwtPayload {
  userId: string;
}
