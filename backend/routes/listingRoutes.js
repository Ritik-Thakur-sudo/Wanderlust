const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");
const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, error: "Login required" });
  }
  next();
}

async function isOwner(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid listing id" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    if (!req.user || listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    req.listing = listing;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

// Index Route
router.get("/", async (req, res) => {
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
});

// SHow Route
router.get("/:id", async (req, res) => {
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
});

// Create Route
router.post("/", isLoggedIn, async (req, res) => {
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
});

// Update ROUTE
router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("owner", "username email name");

    return res.json({
      success: true,
      message: "Listing updated",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
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

    return res.json({
      success: true,
      message: "Listing deleted",
      data: { _id: req.params.id },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

// Review
router.post("/:id/reviews", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid listing id" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    const body = req.body?.review || req.body || {};
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, error: "Rating must be between 1 and 5" });
    }
    if (!comment || !String(comment).trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Comment cannot be empty" });
    }

    const review = new Review({
      rating,
      comment,
      owner: req.user._id,
    });
    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

    await review.populate("owner", "username email");

    return res.status(201).json({
      success: true,
      message: "Review added",
      data: review,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to add review" });
  }
});

// Delete Review
router.delete("/:id/reviews/:reviewId", isLoggedIn, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    if (!isValidId(id) || !isValidId(reviewId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid id or reviewId" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    if (!review.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: "Not able to delete this review",
      });
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.deleteOne();

    return res.json({
      success: true,
      message: "Review deleted",
      data: { reviewId },
    });
  } catch (error) {
    console.error("Delete review failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error" });
  }
});

module.exports = router;
