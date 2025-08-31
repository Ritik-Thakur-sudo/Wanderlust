// migrate.js
require("dotenv").config({ path: "./backend/.env" });
const mongoose = require("mongoose");

// Local + Atlas URLs
const localDB = "mongodb://127.0.0.1:27017/wanderlust"; // local Mongo
const atlasDB = process.env.ATLASDB_URL; // Atlas from .env

// Import models from backend
const User = require("./backend/models/user");
const Listing = require("./backend/models/listing");
const Review = require("./backend/models/review");

async function migrate() {
  try {
    // Connect to local DB
    const localConn = await mongoose.createConnection(localDB).asPromise();
    console.log("Connected to local DB");

    // Connect to Atlas DB
    const atlasConn = await mongoose.createConnection(atlasDB).asPromise();
    console.log("Connected to Atlas DB");

    // Local models
    const LocalUser = localConn.model("User", User.schema);
    const LocalListing = localConn.model("Listing", Listing.schema);
    const LocalReview = localConn.model("Review", Review.schema);

    // Atlas models
    const AtlasUser = atlasConn.model("User", User.schema);
    const AtlasListing = atlasConn.model("Listing", Listing.schema);
    const AtlasReview = atlasConn.model("Review", Review.schema);

    // Fetch from local
    const users = await LocalUser.find({});
    const listings = await LocalListing.find({});
    const reviews = await LocalReview.find({});

    console.log(
      `📦 Local data: ${users.length} users, ${listings.length} listings, ${reviews.length} reviews`
    );

    // Insert into Atlas (ignoring duplicates if re-run)
    if (users.length)
      await AtlasUser.insertMany(users, { ordered: false }).catch(() => {});
    if (listings.length)
      await AtlasListing.insertMany(listings, { ordered: false }).catch(
        () => {}
      );
    if (reviews.length)
      await AtlasReview.insertMany(reviews, { ordered: false }).catch(() => {});

    console.log("🎉 Migration complete!");

    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrate();
