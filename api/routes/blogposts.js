const express = require("express");
const router = express.Router();
const BlogPost = require("../db/models/BlogPosts");
const authenticateToken = require("../lib/auth");  // JWT doğrulama middleware'i

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

// Tüm blog yazılarını getirme (JWT doğrulama ekleniyor)
router.get("/", authenticateToken, async (req, res) => {  // JWT doğrulama burada da ekleniyor
    try {
        const posts = await BlogPost.find().populate("author").populate("tags");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
