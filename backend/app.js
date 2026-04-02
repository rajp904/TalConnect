const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.js");
const cors = require("cors");
const session = require("express-session");
const jobPostingRouter = require("./routes/jobPosting.js");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ SESSION CONFIG (FIXED)
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, 
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,      
    sameSite: "lax",   
  },
};

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

app.use(session(sessionOptions));
app.use(flash());

// FLASH MESSAGE HANDLER
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/jobPosting", jobPostingRouter);

// MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to the database");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// START SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


