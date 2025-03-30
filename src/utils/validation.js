const Joi = require("joi");

const studentLoginValidate = (data) => {
  const stuSchema = Joi.object({
    email: Joi.string().pattern(new RegExp("gmail.com$")).email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  return stuSchema.validate(data);
};

const studentRegisterValidate = (data) => {
  const stuSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().pattern(new RegExp("gmail.com$")).email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).max(30).required(),
    gender: Joi.string().required(),
    dob: Joi.date().required(),
    major: Joi.string().required(),
    year: Joi.number().required(),
  });
  return stuSchema.validate(data);
};

module.exports = {
  studentLoginValidate,
  studentRegisterValidate,
};
