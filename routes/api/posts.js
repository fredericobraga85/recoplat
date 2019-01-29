const express = require("express");
const router = express.Router();
const passport = require("passport");
const Post = require("../../models/Post");

//validation
const validatePostInput = require("../../validation/post");
const validateCommentInput = require("../../validation/comment");

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
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(400).json({ post: "Could not delete post" }));
  }
);

//@route Post /api/posts/
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

//@route Post /api/posts/like
//@desc Like a post
//@access Private
router.post(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res.status(400).json({ post: "Post already liked by user" });
        }

        post.likes.unshift({ user: req.user.id });
        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(400).json({ post: "Could not like post." }));
      })
      .catch(err => res.status(400).json({ post: "Could not like post" }));
  }
);

//@route Post /api/posts/unlike
//@desc Unlike a post
//@access Private
router.post(
  "/:id/unlike",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res.status(400).json({ post: "Post is not liked by user" });
        }

        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);
        post
          .save()
          .then(post => res.json(post))
          .catch(err =>
            res.status(400).json({ post: "Could not unlike post." })
          );
      })
      .catch(err => res.status(400).json({ post: "Could not unlike post" }));
  }
);

//@route Post /api/posts/comment
//@desc Comment a post
//@access Private
router.post(
  "/:id/comment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        post.comments.unshift(newComment);
        post
          .save()
          .then(post => res.json(post))
          .catch(err =>
            res.status(400).json({ post: "Could not comment post" })
          );
      })
      .catch(err => res.status(400).json({ post: "Could not comment post" }));
  }
);

//@route Delete /api/posts/comment
//@desc Comment a post
//@access Private
router.delete(
  "/:id/comment/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment.user.toString() === req.user.id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ post: "User did not make any comments for this post" });
        }

        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        if (removeIndex < 0) {
          return res.status(404).json({ post: "Comment does not exist" });
        }

        post.comments.splice(removeIndex, 1);
        post
          .save()
          .then(post => res.json(post))
          .catch(err =>
            res.status(400).json({ post: "Could not delete comment" })
          );
      })
      .catch(err => res.status(400).json({ post: "Could not delete comment" }));
  }
);

module.exports = router;
