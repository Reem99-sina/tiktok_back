const router = require("express").Router();

const { auth } = require("../Middleware/auth");
const { validation } = require("../Middleware/validation");
const { myMulter, filetype } = require("../utils/multer");
const { deletePost, createPost, getAllPosts, getPostsByUser } = require("./posts.service");
const {
  createPostValidation,
  deletePostValidation,
} = require("./posts.validation");

// Create post
router.post(
  "/",
  auth(),
  myMulter("/video", filetype.video).single('video'),
  validation(createPostValidation),
  createPost
);
router.delete("/:id", auth(), validation(deletePostValidation), deletePost);
router.get("/",  getAllPosts);
router.get('/own',auth(),getPostsByUser);

module.exports = router;
