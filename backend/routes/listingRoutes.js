const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

// Index Route
router.get("/", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.json(allListings);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Show route
router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found");
    res.json(listing);
  } catch (err) {
    res.status(400).send("Invalid ID");
  }
});

// Create Route
router.post("/", async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Route
router.put("/:id", async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedListing) return res.status(404).send("Listing not found");
    res.json(updatedListing);
  } catch (err) {
    res.status(400).send("Invalid request");
  }
});

// Delete Route
router.delete("/:id", async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) return res.status(404).send("Listing not found");
    res.send("Listing deleted");
  } catch (err) {
    res.status(400).send("Invalid ID");
  }
});

module.exports = router;
