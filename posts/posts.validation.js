const joi = require("joi");

exports.createPostValidation = {
  body: joi.object({
    caption: joi.string().max(200).allow("").messages({
      "string.base": "Caption must be a string",
      "string.max": "Caption cannot exceed 200 characters",
    }),
  }),
};

exports.deletePostValidation = {
  params: joi.object({
    id: joi.string().required(),
  }),
};