const router = require("express").Router();
const { auth } = require("../Middleware/auth");
const { validation } = require("../Middleware/validation");
const uploadAvatar = require("../utils/multer");
const {
  register,
  login,
  getUser,
  toggleFollow,
  confirmByCodeReq,
  sendVerifyEmail,
} = require("./users.service");
const {
  loginValidation,
  postUservalidation,
  followValidation,
  confirmByCode,
  resendCode,
} = require("./users.validation");

router.post(
  "/register",
  uploadAvatar
    .myMulter("/picture", uploadAvatar.filetype.Image)
    .single("avatar"),
  validation(postUservalidation),
  register,
);
router.post("/login", validation(loginValidation), login);
router.get("/", auth(), getUser);
router.post(
  "/follow/:userId",
  auth(),
  validation(followValidation),
  toggleFollow,
);
router.post("/confirm-code", validate(confirmByCode), confirmByCodeReq);
router.post(
  "/resend-code",
  validation(resendCode),
  sendVerifyEmail
);
module.exports = router;
