const Validator = require("validator");
const isEmpty = require("./is-empty.js");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  //Name
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters.";
  }

  //E-mail
  if (Validator.isEmpty(data.name)) {
    errors.email = "E-mail is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "E-mail is invalid.";
  }

  //Password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required.";
  } else if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password must have at least 6 characters.";
  } else if (!Validator.equals(data.password, data.password2)) {
    errors.password = "Passwords must match.";
  }

  return { errors, isValid: isEmpty(errors) };
};