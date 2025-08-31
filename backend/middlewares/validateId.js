const mongoose = require("mongoose");

function validateListingId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid listing id" });
  }
  next();
}

module.exports = { validateListingId };
