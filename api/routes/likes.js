const express = require("express");
const router = express.Router();
const Like = require("../db/models/Likes");
const authenticateToken = require("../lib/auth");  // JWT doğrulama middleware

// Beğeni ekleme
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { blog_post, user } = req.body;

    const likeExists = await Like.findOne({ blog_post, user });
    if (likeExists) return res.status(400).json({ message: "Already liked." });

    const newLike = new Like({ blog_post, user });
    await newLike.save();

    res.status(201).json({ message: "Post liked successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog yazısının beğeni sayısını getir
router.get("/:blogPostId", async (req, res) => {
  try {
    const likeCount = await Like.countDocuments({ blog_post: req.params.blogPostId });
    res.status(200).json({ likes: likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
