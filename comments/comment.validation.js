const Joi = require("joi");

exports.addCommentValidation = {
  body: Joi.object({
    postId: Joi.string().required(),
    text: Joi.string().min(1).max(500).required(),
  }),
};
