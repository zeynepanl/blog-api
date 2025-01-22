const express = require("express");
const router = express.Router();
const BlogPost = require("../db/models/BlogPosts");

// Blog yazısı oluşturma
router.post("/create", async (req, res) => {
    try {
        const { title, content, author, tags } = req.body;

        const newPost = new BlogPost({ title, content, author, tags });
        await newPost.save();

        res.status(201).json({ message: "Blog post created successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Tüm blog yazılarını getirme
router.get("/", async (req, res) => {
    try {
        const posts = await BlogPost.find().populate("author").populate("tags");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
