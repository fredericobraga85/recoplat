const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//Load User model
const User = require("../../models/User");

//@route GET /api/users/test
//@desc tests users route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users test Ok!" });
});

//@route POST /api/users/register
//@desc register users
//@access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ email: "E-mail already exists." });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm"
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

//@route POST /api/users/login
//@desc Logs in users and returns token
//@access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ email: "User does not exist." });
      }

      bcrypt.compare(password, user.password).then(matched => {
        if (matched) {
          res.json({ msg: "Login Successful" });
        } else {
          return res.status(400).json({ password: "Password incorrect" });
        }
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
