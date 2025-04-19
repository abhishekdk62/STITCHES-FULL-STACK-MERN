const express = require("express");
const passport = require("passport"); // This will use our passport config from config/passport.js
const generateToken = require("../utils/generateToken");
const router = express.Router();


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    const token = generateToken(req.user._id, "user"); // Assuming a default role "user"
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, 
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
  req.logout(() => {
    res.redirect("http://localhost:5173/");
  });
});

// Get authenticated user info
router.get("/user", (req, res) => {
  res.json(req.user || null);
});

module.exports = router;
