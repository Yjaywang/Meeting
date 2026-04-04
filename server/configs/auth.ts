import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
import User from "@shared/models/User";
import passport from "passport";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
