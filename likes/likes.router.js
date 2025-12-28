const { auth } = require("../Middleware/auth");
const { validation } = require("../Middleware/validation");
const { addLike } = require("./likes.services");
const { addLikeValidation } = require("./likes.validation");
const router = require("express").Router();

// Add like
router.post("/", auth(), validation(addLikeValidation), addLike);

module.exports = router;
