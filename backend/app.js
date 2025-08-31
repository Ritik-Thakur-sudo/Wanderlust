if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const listingRoutes = require("./routes/listingRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();

const PORT = process.env.PORT || 8080;
const sessionSecret = process.env.SESSION_SECRET || "fallbacksecret";

const dburl =
  process.env.NODE_ENV === "production"
    ? process.env.ATLASDB_URL
    : process.env.MONGO_URL;

app.use(
  cors({
    origin: [
      process.env.FRONTEND_ORIGIN || "http://localhost:5173",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(dburl)
  .then(() => console.log(`connect to DB: ${dburl}`))
  .catch((error) => console.error("DB Connection error", error));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: sessionSecret,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

app.use(
  session({
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/session-test", (req, res) => {
  req.session.visits = (req.session.visits || 0) + 1;
  res.json({ ok: true, visits: req.session.visits });
});

// app.get("/demo", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "student045",
//   });
//   let registeredUser = await User.register(fakeUser, "password");
//   console.log(registeredUser);
//   res.send(registeredUser);
// });

// app.get("/", (_req, res) => {
//   res.send("i am root");
// });

app.use("/listings", listingRoutes);
app.use("/", userRoutes);

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
