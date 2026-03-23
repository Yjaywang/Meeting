import jwt from "jsonwebtoken";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

function verifyJWT(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).send({
      error: true,
      message: "jwt fail, no access token",
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        res.status(401).send({
          error: true,
          message: "jwt fail",
        });
        return;
      }
      req.userId = (decoded as { userId: string }).userId;
      next();
    }
  );
}

export default verifyJWT;
