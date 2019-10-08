// this file will hold all the routes for our clucks resource
const express = require("express");
const knex = require("../db/client");

// router is an object which is sort of like app
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("../");
});


router.get("/new", (req, res) => {
    if (!req.cookies.username) {
      res.redirect("../sign_in");
    } else {
      const cluckrData = {};
      cluckrData["loggedInUsername"] = req.cookies.username;
      res.render("clucks/new", {cluckrData});
    };
});

router.post("/", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const image_url = req.body.image_url;
    const username = req.cookies.username;
  
    knex("clucks")
      .insert({
        username: username,
        content: content,
        image_url: image_url,
      })
      .returning("*")
      .then(data => {
        res.redirect("../");
      });
});

module.exports = router;