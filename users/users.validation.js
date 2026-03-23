const joi = require("joi");

module.exports.postUservalidation = {
  body: joi.object({
    username: joi.string().min(3).required().messages({
      "string.base": "Username must be a string",
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "any.required": "Username is required",
    }),
    email: joi
      .string()
      .email({ tlds: { allow: false } }) // true لو حابة تتحقق من الـ domain
      .required()
      .messages({
        "string.email": "Email must be a valid email",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),
    password: joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  }),
};

module.exports.loginValidation = {
  body: require("joi").object({
    email: require("joi").string().email().required().messages({
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
    password: require("joi").string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  }),
};

module.exports.followValidation = {
  params: joi.object({
    userId: joi.string().required(),
  }),
};

module.exports.confirmByCode = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
      }),

      code: joi
        .string()
        .length(4)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
          "string.empty": "Verification code is required",
          "string.length": "Verification code must be 4 digits",
          "string.pattern.base": "Verification code must contain only numbers",
          "any.required": "Verification code is required",
        }),
    }),
};