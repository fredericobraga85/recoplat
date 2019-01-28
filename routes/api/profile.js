const express = require("express");
const router = express.Router();
const passport = require("passport");
const validProfileInput = require("../../validation/profile");
const validExperienceInput = require("../../validation/experience");
const validEducationInput = require("../../validation/education");

//Load Profile
const Profile = require("../../models/Profile");
//Load User
const User = require("../../models/User");

//@route GET /api/profile/test
//@desc tests profile route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profile test Ok!" });
});

//@route GET /api/profile
//@desc get current user profile
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user.";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route GET /api/profile/handle/:handle
//@desc get profile by handle
//@access Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile with that handle.";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile with that handle." })
    );
});

//@route GET /api/profile/user/:user_id
//@desc get profile by user id
//@access Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile with that id.";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile with that id." })
    );
});

//@route GET /api/profile/all
//@desc get all profiles
//@access Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.profile = "There are no profiles.";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles." }));
});

//@route Post /api/profile
//@desc create or update profile
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ///Validate Profile
    const { errors, isValid } = validProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //Skills - split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Updated
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

//@route Post /api/profile/experience
//@desc create experience
//@access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ///Validate Experience
    const { errors, isValid } = validExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user.";
          return res.status(404).json(errors);
        }

        profile.experience.unshift(newExp);

        //Save experience
        profile
          .save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => {
            res.status(400).json({ profile: "Could not add experience" });
          });
      })
      .catch(err =>
        res.status(400).json({ profile: "Could not add experience" })
      );
  }
);

//@route Post /api/profile/education
//@desc create education
//@access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ///Validate Education
    const { errors, isValid } = validEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newEducation = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user.";
          return res.status(404).json(errors);
        }

        profile.education.unshift(newEducation);

        //Save education
        profile
          .save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => {
            res.status(400).json({ profile: "Could not add education" });
          });
      })
      .catch(err =>
        res.status(400).json({ profile: "Could not add education" })
      );
  }
);

//@route Delete /api/profile/experience
//@desc delete experience
//@access Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user.";
          return res.status(404).json(errors);
        }

        //get experience index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        //return for unexistent experience
        if (removeIndex < 0) {
          return res
            .status(404)
            .json({ profile: "Could not remove experience" });
        }

        //Splice out of array
        profile.experience.splice(removeIndex, 1);

        //Save experience
        profile
          .save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => {
            res.status(400).json({ profile: "Could not remove experience" });
          });
      })
      .catch(err =>
        res.status(400).json({ profile: "Could not remove education" })
      );
  }
);

//@route Delete /api/profile/education
//@desc delete education
//@access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user.";
          return res.status(404).json(errors);
        }

        //get education index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        //return for unexistent education
        if (removeIndex < 0) {
          return res
            .status(404)
            .json({ profile: "Could not remove education" });
        }

        //Splice out of array
        profile.experience.splice(removeIndex, 1);

        //Save education
        profile
          .save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => {
            res.status(400).json({ profile: "Could not remove education" });
          });
      })
      .catch(err =>
        res.status(400).json({ profile: "Could not remove education" })
      );
  }
);

//@route Delete /api/profile
//@desc Delete user and profile
//@access Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(400).json({ profile: "Could not remove user" })
          );
      })
      .catch(err =>
        res.status(400).json({ profile: "Could not remove profile" })
      );
  }
);

module.exports = router;
