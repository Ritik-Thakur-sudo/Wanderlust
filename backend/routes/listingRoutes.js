const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listings");
const reviewController = require("../controllers/reviews");

const { isLoggedIn } = require("../middlewares/auth");
const { validateListingId } = require("../middlewares/validateId");
const { isOwner } = require("../middlewares/ownership");

// Listing Routes
router
  .route("/")
  .get(listingController.index) // Index Route
  .post(isLoggedIn, listingController.create); // Create Route

router
  .route("/:id")
  .get(validateListingId, listingController.show) // Show Route
  .put(isLoggedIn, validateListingId, isOwner, listingController.update) // Update Route
  .delete(isLoggedIn, validateListingId, isOwner, listingController.delete); // Delete Route

// Review Routes
router.post(
  "/:id/reviews",
  isLoggedIn,
  validateListingId,
  reviewController.createReview
);

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  validateListingId,
  reviewController.deleteReview
);

module.exports = router;
