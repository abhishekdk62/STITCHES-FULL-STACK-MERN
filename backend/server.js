const { config } = require("dotenv");
config();
const morgan = require("morgan");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const commonRouter = require("./routes/common/commonRoutes");
const userRouter = require("./routes/user/userRoutes");
const adminRouter = require("./routes/admin/adminRoutes");
const paymentRouter = require("./routes/payment/paymentRoutes");
const authRoutes = require("./routes/googleAuth/authRoutes");
const { isProd } = require("./utils/cookieOptions");

const passport = require("./config/passport");

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
    },
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many requests, please try again later." },
});

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/health", (req, res) => {
  res.status(200).json({ message: "ok", time: new Date() });
});
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", authLimiter, commonRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/paypal", paymentRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: isProd ? "Internal server error" : err.message,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`Server started listening on http://localhost:${PORT}`)
  );
};

startServer();
