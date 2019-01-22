const express = require("express");
const router = express.Router();

//@route GET /api/users/test
//@desc tests users route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users test Ok!" });
});

module.exports = router;
