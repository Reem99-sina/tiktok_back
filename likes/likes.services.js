const Like = require("../models/like.schema");
const Post = require("../models/post.schema");

exports.addLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Prevent duplicate like
    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });

      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: existingLike._id },
      });

      return res.status(200).json({
        message: "Like removed",
        liked: false,
      });
    }

    const like = new Like({ postId, userId });
    await like.save();

    // Add like reference to post
    post.likes.push(like._id);
    await post.save();

    res.status(201).json({ message: "Post liked", like });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
