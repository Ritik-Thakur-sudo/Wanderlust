const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const router = express.Router();
const listingRoutes = require("./routes/listingRoutes.js");
const cors = require("cors");
const session = require("express-session");

app.use(express.json());

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.use(cors());
app.use(express.json());

main()
  .then(() => {
    console.log("connect to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  Cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(sessionOptions));

app.get("/", (req, res) => {
  res.send("i am root");
});

// Routes
app.use("/listings", listingRoutes);

// app.get("/testLising", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My Home",
//     description: "Good looking house",
//     price: 1200,
//     location: "Patna, Bihar",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successfull testing");
// });

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
