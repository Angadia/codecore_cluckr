// add the request handlers for "sign_in" and "/"
const express = require("express");
const knex = require("../db/client");

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
  const cluckrData = {};
  cluckrData["loggedInUsername"] = req.cookies.username;
  res.render("login", {cluckrData});
});

router.get("/clucks", (req, res) => {
    res.redirect("/");
});

router.get("/", (req, res) => {
    knex
      .select("*")
      .from("clucks")
      .orderBy("created_at", "DESC")
    .then(clucks => {
      const cluckrData = {};
      cluckrData["clucks"] = clucks;
      cluckrData["loggedInUsername"] = req.cookies.username;
      res.render("index", {cluckrData});
    });
});

module.exports = router;