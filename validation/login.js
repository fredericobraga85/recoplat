const Validator = require("validator");
const isEmpty = require("./is-empty.js");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //E-mail
  if (Validator.isEmpty(data.email)) {
    errors.email = "E-mail is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "E-mail is invalid.";
  }

  //Password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required.";
  }

  return { errors, isValid: isEmpty(errors) };
};
