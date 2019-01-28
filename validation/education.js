const Validator = require("validator");
const isEmpty = require("./is-empty.js");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";

  //school
  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  //degree
  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }

  //from
  if (Validator.isEmpty(data.from)) {
    errors.from = "From field is required";
  } else if (!Validator.isRFC3339(data.from)) {
    errors.from = "From field is not a valid date";
  }

  //to & current
  if (!isEmpty(data.to)) {
    if (!Validator.isRFC3339(data.to)) {
      errors.to = "To field is not a valid date";
    } else if (!isEmpty(data.current)) {
      errors.to = "To field and Current field can not be both selected";
    }
  }

  return { errors, isValid: isEmpty(errors) };
};
