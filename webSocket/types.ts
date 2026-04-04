import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@shared/types/socket-events";

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type TypedIO = Server<ClientToServerEvents, ServerToClientEvents>;
