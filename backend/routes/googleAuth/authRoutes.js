const express = require("express");
const passport = require("passport");
const generateToken = require("../../utils/generateToken");
const { getCookieOptions } = require("../../utils/cookieOptions");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
  }),
  (req, res) => {
    const accessToken = generateToken(
      req.user._id,
      "user",
      process.env.ACCESS_SECRET,
      "15m"
    );
    const refreshToken = generateToken(
      req.user._id,
      "user",
      process.env.REFRESH_SECRET,
      "7d"
    );

    const cookieOptions = getCookieOptions();

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
    });

    res.redirect(`${process.env.FRONTEND_URL}/user/home`);
  }
);

router.get("/failure", (req, res) => {
  const errorMessage = req.session.messages
    ? req.session.messages[req.session.messages.length - 1]
    : "Authentication failed";
  res.redirect(
    `${process.env.FRONTEND_URL}/?error=${encodeURIComponent(errorMessage)}`
  );
  if (req.session.messages) {
    req.session.messages = [];
  }
});

router.get("/logout", (req, res) => {
  const cookieOptions = getCookieOptions();

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
});

module.exports = router;
