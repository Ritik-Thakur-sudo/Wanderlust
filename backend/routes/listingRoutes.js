const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");
const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Index Route
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find({});
    return res.json({ success: true, data: listings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET Route
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid listing id" });
    }

    const listing = await Listing.findById(id).populate("reviews");
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

// POST Route
router.post("/", async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.title || !payload.description) {
      return res.status(400).json({
        success: false,
        error: "Title and description required",
      });
    }

    const listing = new Listing(payload);
    await listing.save();

    return res.status(201).json({
      success: true,
      message: "New Listing created",
      data: listing,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: err.message });
  }
});

// UPDATE Route
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid listing id" });
    }

    const updated = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    return res.json({
      success: true,
      message: "Listing updated",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "Invalid request" });
  }
});

// DELETE Route
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid listing id" });
    }

    const deleted = await Listing.findByIdAndDelete(id);
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
      data: { _id: id },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "Invalid id" });
  }
});

// Review Route
router.post("/:id/reviews", async (req, res) => {
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

    const review = new Review({ rating, comment });
    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

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

// DELETE Review
router.delete("/:id/reviews/:reviewId", async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    if (!isValidId(id) || !isValidId(reviewId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid id or reviewId" });
    }

    const listing = await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } },
      { new: true }
    );
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    return res.json({
      success: true,
      message: "Review deleted",
      data: { reviewId },
    });
  } catch (error) {
    console.error("Delete review failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error deleting review" });
  }
});

module.exports = router;
