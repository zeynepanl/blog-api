const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    cover_image: { type: String, default: null },  // Blog kapak fotoğrafı
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],  // Çoklu kategori desteği
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

// Blog yazılarını başlık ve yazar adına göre sorgulamayı hızlandırmak için index ekleme
blogPostSchema.index({ title: 1, author: 1 });

module.exports = mongoose.model("BlogPost", blogPostSchema);
