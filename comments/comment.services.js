const Comment = require("../models/comment.schema");
const Post = require("../models/post.schema");

exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({ postId, userId, text });
    await comment.save();

    // Add comment reference to post
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};