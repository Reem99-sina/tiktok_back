const Comment = require("../models/comment.schema");
const Like = require("../models/like.schema");
const Post = require("../models/post.schema");

// Create post with video
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user._id; // from verifyToken middleware

    if (!req.file)
      return res.status(400).json({ message: "Video file is required" });

    const videoUrl = `uploads/videos/${req.file.filename}`;

    const post = new Post({
      userId,
      videoUrl,
      caption,
    });

    await post.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only the owner can delete
    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this post" });
    }

    // Delete associated likes and comments
    await Like.deleteMany({ _id: { $in: post.likes } });
    await Comment.deleteMany({ _id: { $in: post.comments } });

    await post.remove();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // max 50
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "username avatar",
      })
      .populate({
        path: "likes",
        populate: {
          path: "userId",
          select: "username avatar",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username avatar",
        },
      });

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getPostsByUser = async (req, res) => {
  try {
    const  userId = req.user._id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "username avatar",
      })
      .populate({
        path: "likes",
        populate: {
          path: "userId",
          select: "username avatar",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username avatar",
        },
      });

    const totalPosts = await Post.countDocuments({ userId });

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};