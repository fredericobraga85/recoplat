const express = require("express");
const router = express.Router();
const passport = require("passport");
const Post = require("../../models/Post");

//validation
const validatePostInput = require("../../validation/post");

//@route GET /api/posts/test
//@desc tests posts route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Posts test Ok!" });
});

//@route Post /api/posts/\
//@desc Create a Post
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //validate post
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost
      .save()
      .then(post => {
        res.json(post);
      })
      .catch(err => {
        errors.post = "Could not create post";
        res.status(400).json(errors);
      });
  }
);

module.exports = router;
