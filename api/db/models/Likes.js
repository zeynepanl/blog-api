const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    blog_post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Kullanıcının aynı blog yazısını birden fazla beğenmesini engellemek için index ekleme
likeSchema.index({ blog_post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
