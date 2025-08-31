const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create Review
module.exports.createReview = async (req, res) => {
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
    console.error("Create review failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to add review" });
  }
};

// Delete Review
module.exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    if (!isValidId(id) || !isValidId(reviewId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid id or reviewId" });
    }

    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    if (
      !review.owner.equals(req.user._id) &&
      listing.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this review",
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
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
