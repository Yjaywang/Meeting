import jwt from "jsonwebtoken";
import type { TypedSocket } from "../types";

export function socketAuthMiddleware(
  socket: TypedSocket,
  next: (err?: Error) => void
): void {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication failed: no token provided"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as { userId: string };
    socket.data.userId = decoded.userId;
    next();
  } catch {
    next(new Error("Authentication failed: invalid token"));
  }
}
