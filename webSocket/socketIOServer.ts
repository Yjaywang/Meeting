import "dotenv/config";
import express from "express";
import cors from "cors";
import allowedOrigins from "@shared/configs/allowedOrigins";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient as createRedisClient } from "redis";
import http from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@shared/types/socket-events";
import { registerHandlers } from "./handlers";
import { socketAuthMiddleware } from "./middleware/socketAuth";
import type { TypedSocket } from "./types";

const app = express();
app.use(cors({ origin: allowedOrigins, credentials: true }));

const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Socket.IO Redis adapter
const pubClient = createRedisClient({
  url: `redis://${process.env.elasticache}:6379`,
});
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()])
  .then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    console.log("Socket.IO Redis adapter connected");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis adapter:", err);
  });

// Socket.IO authentication
io.use(socketAuthMiddleware);

// Socket.IO event handlers
io.on("connect", (socket: TypedSocket) => {
  console.log(`user connected, ${socket.id}`);
  registerHandlers(io, socket);
});

export { server, io };
