const express = require("express");
const router = express.Router();
const BlogPost = require("../db/models/BlogPosts");
const authenticateToken = require("../lib/auth");  // JWT doğrulama middleware

// Blog yazısı oluşturma (JWT doğrulama ekleniyor)
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    const newPost = new BlogPost({ title, content, author, tags });
    await newPost.save();

    res.status(201).json({ message: "Blog post created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog yazısı güncelleme (JWT doğrulama ekleniyor)
router.post("/update", authenticateToken, async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;

    const updatedPost = await BlogPost.findByIdAndUpdate(
      id, 
      { title, content, tags },
      { new: true } // Güncellenmiş blog yazısını geri döndürüyoruz
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    res.status(200).json({ message: "Blog post updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog yazısını silme (POST kullanarak)
router.post("/delete", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;

    const deletedPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    res.status(200).json({ message: "Blog post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm blog yazılarını getirme (JWT doğrulama ekleniyor)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const posts = await BlogPost.find().populate("author").populate("tags");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
