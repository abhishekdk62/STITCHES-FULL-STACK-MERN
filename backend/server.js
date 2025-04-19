const { config } = require('dotenv');
config();
const morgan = require('morgan');
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const commonRouter = require('./routes/commonRoutes');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const paymentRouter = require('./routes/paymentRoutes');

const passport = require('./config/passport');

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173', 
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

const authRoutes = require('./routes/authRoutes');

app.use('/auth', authRoutes);

app.use('/user', commonRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use("/api/paypal", paymentRouter);

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () =>
  console.log(`Server started listening on http://localhost:${PORT}`)
);
