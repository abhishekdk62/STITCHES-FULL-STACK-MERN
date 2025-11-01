const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          const generatedReferalCode = Math.random()
          .toString(36)
          .slice(2, 10)
          .toUpperCase();
          // Create a new user if one doesn't exist
          user = new User({
            email: profile.emails[0].value,
            firstname: profile.displayName,
            googleId: profile.id,
            profileImage: profile.photos[0].value,
            phone: "0000000000",
            password: "",
            referalCode: generatedReferalCode,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
