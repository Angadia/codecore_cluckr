const express = require("express");
const knex = require("../db/client");

const router = express.Router();
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

router.post("/sign_in", (req, res) => {
  const username = req.body.username;
  if (!username && !req.cookies.username) {
    res.redirect("/sign_in");
  }
  else {
    if (!username) {
      username = req.cookies.username;
    };
    res.cookie("username", username, { maxAge: ONE_WEEK });
    res.redirect("/");
  };
});

router.get("/sign_out", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

router.get("/sign_in", (req, res) => {
  if (!req.cookies.username) {
    const cluckrData ={};
    cluckrData["loggedInUsername"] = "";
    res.render("login", {cluckrData});
  } else {
    res.redirect("/");
  };
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
      if (!cluckrData["clucks"]) {
        cluckrData["clucks"] = [];
      };
      cluckrData["loggedInUsername"] = req.cookies.username;
      if (!cluckrData["loggedInUsername"]) {
        cluckrData["loggedInUsername"] = "";
      };
      res.render("index", {cluckrData});
    });
});

module.exports = router;