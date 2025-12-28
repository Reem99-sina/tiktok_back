const { auth } = require("../Middleware/auth");
const { validation } = require("../Middleware/validation");
const { addComment } = require("./comment.services");
const { addCommentValidation } = require("./comment.validation");
const router = require("express").Router();

router.post("/", auth(), validation(addCommentValidation), addComment);

module.exports = router;
