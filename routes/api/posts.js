const express = require("express");
const router = express.Router();
const passport = require("passport");
const Post = require("../../models/Post");

//validation
const validatePostInput = require("../../validation/post");

//@route GET /api/posts/
//@desc Get all posts sorted by most recent
//@access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ post: "No posts found" }));
});

//@route GET /api/posts/
//@desc Get all posts sorted by most recent
//@access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ post: "No post found" });
      }
      res.json(post);
    })
    .catch(err => res.status(400).json({ post: "No post found" }));
});

//@route DELETE /api/posts/
//@desc Delete post
//@access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.id, user: req.user.id })
      .then(post => {
        console.log(post);
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(400).json({ post: "Could not delete post" }));
  }
);

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
