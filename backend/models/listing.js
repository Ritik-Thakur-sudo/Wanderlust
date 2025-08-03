const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "default-image",
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          : v,
    },
  },

  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
