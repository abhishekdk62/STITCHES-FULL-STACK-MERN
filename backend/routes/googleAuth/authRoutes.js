const express = require("express");
const passport = require("passport"); // This will use our passport config from config/passport.js
const generateToken = require("../../utils/generateToken");
const router = express.Router();


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
  

    const accessToken = generateToken(req.user._id, "user",process.env.ACCESS_SECRET,"15m");
    const refreshToken = generateToken(req.user._id, "user",process.env.REFRESH_SECRET,"7d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE), 
    });






















    res.redirect("http://localhost:5173/user/home");
  }
);

router.get("/failure", (req, res) => {
  const errorMessage = req.session.messages
    ? req.session.messages[req.session.messages.length - 1]
    : "Authentication failed";
  res.redirect(
    `http://localhost:5173/?error=${encodeURIComponent(errorMessage)}`
  );
  if (req.session.messages) {
    req.session.messages = [];
  }
});

router.get("/logout", (req, res) => {
  // Clear authentication cookies
  res.clearCookie('accessToken', { 
    httpOnly: true, 
    sameSite: 'lax', 
    secure: process.env.NODE_ENV === "production" 
  });
  
  res.clearCookie('refreshToken', { 
    httpOnly: true, 
    sameSite: 'lax', 
    secure: process.env.NODE_ENV === "production" 
  });

  // Logout from passport session
  req.logout(() => {
    res.redirect("http://localhost:5173/");
  });
});

router.get("/user", (req, res) => {
  res.json(req.user || null);
});

module.exports = router;
