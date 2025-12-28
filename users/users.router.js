const router = require("express").Router();
const { auth } = require("../Middleware/auth");
const { validation } = require("../Middleware/validation");
const uploadAvatar = require("../utils/multer");
const { register, login, getUser, toggleFollow } = require("./users.service");
const { loginValidation, postUservalidation, followValidation } = require("./users.validation");

router.post(
  "/register",
  uploadAvatar
    .myMulter("/picture", uploadAvatar.filetype.Image)
    .single("avatar"),
  validation(postUservalidation),
  register
);
router.post("/login", validation(loginValidation), login);
router.get("/", auth(), getUser);
router.post(
  "/follow/:userId",
  auth(),
  validation(followValidation),
  toggleFollow
);

module.exports = router;
