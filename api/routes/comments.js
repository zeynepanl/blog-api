const express = require("express");
const router = express.Router();
const Comment = require("../db/models/Comments");
const authenticateToken = require("../lib/auth");  // JWT doğrulama middleware

// Yorum ekleme
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { blog_post, user, content } = req.body;

    const newComment = new Comment({ blog_post, user, content });
    await newComment.save();

    res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Belirli bir blog yazısına ait yorumları getirme
router.get("/:blogPostId", async (req, res) => {
  try {
    const comments = await Comment.find({ blog_post: req.params.blogPostId }).populate("user");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
