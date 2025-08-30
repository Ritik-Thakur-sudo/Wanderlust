module.exports = function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ success: false, error: "Unauthorized" });
};
