if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const listingRoutes = require("./routes/listingRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("connect to DB"))
  .catch((error) => console.error(error));

app.use(
  session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.get("/session-test", (req, res) => {
  req.session.visits = (req.session.visits || 0) + 1;
  res.json({ ok: true, visits: req.session.visits });
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demo", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "student045",
//   });
//   let registeredUser = await User.register(fakeUser, "password");
//   console.log(registeredUser);
//   res.send(registeredUser);
// });

app.get("/", (_req, res) => res.send("i am root"));

app.use("/listings", listingRoutes);
app.use("/", userRoutes);

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
