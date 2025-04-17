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
    year: Joi.string().required(),
    address: Joi.string().allow(null, ""),
    role: Joi.string().default("STUDENT"),
    status: Joi.string().default("ACTIVE"),
  });
  return stuSchema.validate(data);
};

const roomValidation = (data) => {
  const schema = Joi.object({
    dormitory_id: Joi.number().required(),
    room_number: Joi.string().max(50).required(),
    capacity: Joi.number().min(1).required(),
    current_occupancy: Joi.number().min(0).default(0),
    room_type: Joi.string().max(100).required(),
    status: Joi.string().max(100).required(),
    // New fields
    price: Joi.number().min(0).required(),
    facility: Joi.string().allow(null, ""),
  });

  return schema.validate(data);
};

module.exports = {
  studentLoginValidate,
  studentRegisterValidate,
  roomValidation,
};
