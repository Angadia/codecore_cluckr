// add the request handlers for "sign_in" and "/"
const express = require("express");

const router = express.Router();
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

router.post("/sign_in", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username, { maxAge: ONE_WEEK });
  res.redirect("/");
});

router.post("/sign_out", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

router.get("/sign_in", (req, res) => {
  res.render("index");
});

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;