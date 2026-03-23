import "dotenv/config";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

interface GoogleUser {
  _id: string;
  googleId: string;
  username: string;
  avatar: string;
  email: string;
}

export async function googleSignIn(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as GoogleUser;
  const userId = user._id;
  const googleId = user.googleId;

  const accessToken = jwt.sign(
    { userId: userId, googleId: googleId },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userId: userId, googleId: googleId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  res.redirect(process.env.FRONTEND_URL as string);
}
