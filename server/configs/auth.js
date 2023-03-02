const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const User = require("../models/User.js");
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      //find id in db, return null or object
      try {
        const userDoc = await User.findOne({ email: profile.email }).exec();
        if (userDoc) {
          return cb(null, userDoc);
        } //need to notice has email and no google id condition

        const googleId = profile.id;
        const username = profile.name.givenName;
        const email = profile.emails[0].value;
        const avatar = profile.photos[0].value;
        const result = await User.create({
          username: username,
          email: email,
          avatar: avatar,
          googleId: googleId,
        });
        return cb(null, result);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((user, done) => {
  done(null, user.id);
});
