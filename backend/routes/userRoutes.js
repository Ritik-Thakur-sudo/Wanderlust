const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

function loginAsync(req, user) {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => (err ? reject(err) : resolve()));
  });
}

const userController = require("../controllers/users");

//Signup
router.post("/signup", userController.signup);

//Login
router.post("/login", userController.login);

//Logout
router.post("/logout", userController.logout);

// me
router.get("/me", userController.me);

module.exports = router;
