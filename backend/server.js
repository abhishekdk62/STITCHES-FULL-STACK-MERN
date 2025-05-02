const { config } = require('dotenv');
config();
const morgan = require('morgan');
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const commonRouter = require('./routes/common/commonRoutes');
const userRouter = require('./routes/user/userRoutes');
const adminRouter = require('./routes/admin/adminRoutes');
const paymentRouter = require('./routes/payment/paymentRoutes');
const authRoutes = require('./routes/googleAuth/authRoutes');

const passport = require('./config/passport');

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);


//!morgan code to see what all api calls coming from front end


// app.use(morgan("dev"))


app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//?production routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', commonRouter);
// app.use('/api/user', userRouter);
// app.use('/api/admin', adminRouter);
// app.use("/api/api/paypal", paymentRouter);

//?developement routes
app.use("/auth", authRoutes);
app.use("/user", commonRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/api/paypal", paymentRouter);

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () =>
  console.log(`Server started listening on http://localhost:${PORT}`)
);
