import "dotenv/config";
import twilio from "twilio";
import { Request, Response } from "express";

export async function getTURNServer(req: Request, res: Response): Promise<void> {
  const twilioAccountSid = process.env["twilioAccountSid"];
  const twilioAuthToken = process.env["twilioAuthToken"];
  const client = twilio(twilioAccountSid, twilioAuthToken);

  try {
    const token = await client.tokens.create();
    res.status(200).send({ token });
  } catch (error) {
    console.log("twilio error: ", error);
    res.status(403).send({ token: null });
  }
}
