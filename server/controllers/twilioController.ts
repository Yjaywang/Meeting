import "dotenv/config";
import twilio from "twilio";
import { Request, Response } from "express";

export function getTURNServer(req: Request, res: Response): void {
  const twilioAccountSid = process.env["twilioAccountSid"];
  const twilioAuthToken = process.env["twilioAuthToken"];
  const client = twilio(twilioAccountSid, twilioAuthToken);

  try {
    client.tokens.create().then((token) => {
      res.send({ token }).status(200);
    });
  } catch (error) {
    console.log("twilio error: ", error);
    res.send({ token: null }).status(403);
  }
}
