const express = require("express");
const knex = require("../db/client");

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

function updateHashTagsCounts(hashTagsCounts, newHashTags, res) {
  if (hashTagsCounts && hashTagsCounts.length > 0) {
    knex("hash_tags")
      .where({id: hashTagsCounts[0].id})
      .update({count: hashTagsCounts[0].count+1})
    .returning("*")
    .then(hashTagCount => {
      if (hashTagsCounts.length > 1) {
        return updateHashTagsCounts(hashTagsCounts.slice(1), newHashTags, res);
      } else {
        return createHashTags(newHashTags, res);
      };
    });
  } else {
    return createHashTags(newHashTags, res);
  };
};

function createHashTags(newHashTags, res) {
  if (newHashTags && newHashTags.length > 0) {
    knex("hash_tags")
      .insert({
        hash_tag: newHashTags[0],
        count: 1
      })
      .returning("*")
      .then(hashTagCount => {
        if (newHashTags.length > 1) {
          return createHashTags(newHashTags.slice(1));
        } else {
          res.redirect("../");
        };
      });
  } else {
    res.redirect("../");
  };
};

function processHashTags(hashTags, res) {
  
  knex
    .select("*")
    .from("hash_tags")
    .whereIn("hash_tag", hashTags)
  .then(hashTagsCounts => {
    const uniqueHashTags = hashTags.reduce((x,y) => x.includes(y) ? x : [...x,y], []);
    const newHashTags = [];

    const existingHashTags = hashTagsCounts && hashTagsCounts.length > 0 ? hashTagsCounts.map (hashTagCount => hashTagCount.hash_tag) : [];
    if (uniqueHashTags) {
      uniqueHashTags.map (hashTag => {
        if (!existingHashTags.includes(hashTag)) {
          newHashTags.push(hashTag);
        };
      });
    };
    updateHashTagsCounts(hashTagsCounts, newHashTags, res);
  });
};

router.post("/", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const image_url = req.body.image_url;
    const username = req.cookies.username;
  
    if (content.length > 0 || image_url.length > 0) {
      knex("clucks")
        .insert({
          username: username,
          content: content,
          image_url: image_url,
        })
        .returning("*")
        .then(data => {
          // regex for hashtags.
          const re = /\B(\#[a-zA-Z]+\b)/;
          const hashTags = [];
          data[0].content.split(re).forEach( element => {
            if (element.length > 1 && element.startsWith('#')) {
              hashTags.push(element.slice(1).toLowerCase());
            };
          });
          if (hashTags.length > 0) {
            processHashTags(hashTags, res);
          } else {
            res.redirect("../");
          };
        });
    } else {
      res.redirect("clucks/new");
    };
});

module.exports = router;