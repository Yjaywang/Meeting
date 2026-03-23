import "dotenv/config";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export async function refreshHandler(
  req: Request,
  res: Response
): Promise<void> {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.status(401).send({ error: true, message: "jwt fail" });
    return;
  }
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: jwt.VerifyErrors | null, decoded: unknown) => {
      if (err) {
        res.status(401).send({ error: true, message: "jwt fail" });
      } else {
        const accessToken = jwt.sign(
          { userId: (decoded as { userId: string }).userId },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "1d" }
        );
        res.status(200).send({ ok: true, accessToken: accessToken });
      }
    }
  );
}
