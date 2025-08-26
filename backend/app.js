const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const listingRoutes = require("./routes/listingRoutes.js");
const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("connect to DB"))
  .catch((error) => console.error(error));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);

app.use(express.json());

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

app.get("/", (_req, res) => res.send("i am root"));
app.use("/listings", listingRoutes);

app.listen(8080, () =>
  console.log("server listening on port 8080")
);
