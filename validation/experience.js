const Validator = require("validator");
const isEmpty = require("./is-empty.js");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  //title
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  //company
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
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
