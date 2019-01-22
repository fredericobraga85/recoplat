const express = require("express");
const router = express.Router();

//@route GET /api/posts/test
//@desc tests posts route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Posts test Ok!" });
});

module.exports = router;