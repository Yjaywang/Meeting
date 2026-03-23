import express from "express";
import passport from "passport";
import * as googleAuthController from "../controllers/googleAuthController";
import "../configs/auth";
import session from "express-session";
import "dotenv/config";

const router = express.Router();

router.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  googleAuthController.googleSignIn
);

export default router;
