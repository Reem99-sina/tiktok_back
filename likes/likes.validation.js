const Joi = require("joi");

exports.addLikeValidation = {
  body: Joi.object({
    postId: Joi.string().required(),
  }),
};