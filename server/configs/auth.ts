import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
import User from "../models/User";
import passport from "passport";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const userDoc = await User.findOne({
          email: profile.emails![0].value,
        }).exec();
        if (userDoc) {
          return cb(null, userDoc);
        }

        const googleId = profile.id;
        const username = profile.name!.givenName;
        const email = profile.emails![0].value;
        const avatar = profile.photos![0].value;
        const result = await User.create({
          username,
          email,
          avatar,
          googleId,
        });
        return cb(null, result);
      } catch (error) {
        return cb(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { id: string }).id);
});
passport.deserializeUser((id: string, done) => {
  done(null, { id } as Express.User);
});
