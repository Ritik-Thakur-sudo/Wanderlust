const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { cloudinary } = require("../cloudConfig"); 

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Index
module.exports.index = async (req, res) => {
  try {
    const listings = await Listing.find({}).populate(
      "owner",
      "username email name"
    );
    return res.json({ success: true, data: listings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Show
module.exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid listing id" });
    }

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "owner", select: "username email" },
      })
      .populate("owner", "username email");
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    return res.json({ success: true, data: listing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Create
module.exports.create = async (req, res) => {
  const url = req.file.path;
  let filename = req.file.filename;
  try {
    const payload = req.body || {};
    if (!payload.title || !payload.description) {
      return res.status(400).json({
        success: false,
        error: "Title and description required",
      });
    }

    const listing = new Listing(payload);
    listing.owner = req.user._id;
    listing.image = { url, filename };
    await listing.save();
    await listing.populate("owner", "username email name");

    return res.status(201).json({
      success: true,
      message: "New listing created",
      data: listing,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Update
module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    const listing = await Listing.findById(id).populate(
      "owner",
      "username email name"
    );

    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    if (req.file) {
      if (listing.image?.filename) {
        await cloudinary.uploader.destroy(listing.image.filename); 
      }
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    return res.json({
      success: true,
      message: "Listing updated",
      data: listing,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Delete
module.exports.delete = async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    if (deleted.reviews?.length) {
      await Review.deleteMany({ _id: { $in: deleted.reviews } });
    }

    if (deleted.image?.filename) {
      await cloudinary.uploader.destroy(deleted.image.filename);
    }

    return res.json({
      success: true,
      message: "Listing deleted",
      data: { _id: req.params.id },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};
