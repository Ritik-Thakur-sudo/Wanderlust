const express = require("express");
const passport = require("passport");
const User = require("../models/user");

function loginAsync(req, user) {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => (err ? reject(err) : resolve()));
  });
}

// Signup
module.exports.signup = async (req, res) => {
  try {
    let { username, email, name, password } = req.body || {};
    username = (username || "").trim().toLowerCase();
    email = (email || "").trim().toLowerCase();
    name = (name || "").trim();

    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Username, email, name and password are required",
      });
    }

    const user = new User({ username, email, name });
    await User.register(user, password);
    await loginAsync(req, user);

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    let msg = "Signup failed";
    if (error.name === "User Exists ") msg = "User already exists";
    else if (error.code === 11000) msg = "Username or email already in use";
    else if (error.name === "ValidationError") msg = error.message;
    else if (typeof error.message === "string") msg = error.message;
    return res.status(400).json({ success: false, error: msg });
  }
};

// Login
module.exports.login = async (req, res, next) => {
  try {
    let { identifier, password } = req.body || {};
    identifier = (identifier || "").trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: "Username or Email and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Username/Email or Password" });
    }

    const authenticate = User.authenticate();
    authenticate(user.username, password, async (err, verifiedUser, info) => {
      if (err) return next(err);
      if (!verifiedUser) {
        return res.status(401).json({
          success: false,
          error: info?.message || "Invalid Username/Email or Password",
        });
      }
      await loginAsync(req, verifiedUser);
      return res.json({
        success: true,
        data: {
          _id: verifiedUser._id,
          username: verifiedUser.username,
          email: verifiedUser.email,
          name: verifiedUser.name,
        },
      });
    });
  } catch (e) {
    return next(e);
  }
};

// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session?.destroy((err2) => {
      if (err2) return next(err2);
      res.clearCookie(process.env.SESSION_NAME || "connect.sid", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      return res.json({ success: true });
    });
  });
};

// me
module.exports.me = (req, res) => {
  if (!req.isAuthenticated?.() || !req.user) {
    return res.json({ success: true, data: null });
  }
  const { _id, username, email, name } = req.user;
  return res.json({ success: true, data: { _id, username, email, name } });
};
