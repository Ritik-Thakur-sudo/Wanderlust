function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, error: "Login required" });
  }
  next();
}
module.exports = { isLoggedIn };
