const mongoose = require("mongoose");

// Define Post schema
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
