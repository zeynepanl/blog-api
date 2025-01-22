const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blog_post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parent_comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // Yanıt için parent ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
