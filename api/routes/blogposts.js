const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BlogPost = require("../db/models/BlogPosts");
const Category = require("../db/models/Categories");
const Tag = require("../db/models/Tags");
const authenticateToken = require("../lib/auth");  // JWT doğrulama middleware

// Blog yazısı oluşturma (JWT doğrulama ekleniyor)
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { title, content, author, tags, categories } = req.body;

    const newPost = new BlogPost({ title, content, author, tags, categories });
    await newPost.save();

    res.status(201).json({ message: "Blog post created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog yazısı güncelleme (JWT doğrulama ekleniyor)
router.post("/update", authenticateToken, async (req, res) => {
  try {
    const { id, title, content, tags, categories } = req.body;

    const updatedPost = await BlogPost.findByIdAndUpdate(
      id, 
      { title, content, tags, categories },
      { new: true } // Güncellenmiş blog yazısını geri döndürüyoruz
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    res.status(200).json({ message: "Blog post updated successfully.", post: updatedPost });
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
    const posts = await BlogPost.find()
      .populate("author", "first_name last_name email")
      .populate("tags", "name")
      .populate("categories", "name");
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog yazılarını arama ve filtreleme
router.get("/search", async (req, res) => {
  try {
    const { title, author, tags, categories, startDate, endDate, popularity } = req.query;

    let filter = {};

    // Başlığa göre arama
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // Yazara göre filtreleme
    if (author && mongoose.Types.ObjectId.isValid(author)) {
      filter.author = author;
    }

    
    // Etiketlere göre filtreleme
    if (tags) {
      const tagNames = tags.split(",");
      const tagIds = await Tag.find({ name: { $in: tagNames } }).select("_id");
      filter.tags = { $in: tagIds.map(tag => tag._id) };
    }

    // Kategorilere göre filtreleme
    if (categories) {
      const categoryNames = categories.split(",");
      const categoryIds = await Category.find({ name: { $in: categoryNames } }).select("_id");
      filter.categories = { $in: categoryIds.map(cat => cat._id) };
    }

    // Tarih aralığı filtreleme
    if (startDate && endDate) {
      if (!isNaN(Date.parse(startDate)) && !isNaN(Date.parse(endDate))) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else {
        return res.status(400).json({ message: "Invalid date format" });
      }
    }

    // Popülerliğe göre sıralama (likes sayısına göre azalan sıralama)
    let sortCriteria = {};
    if (popularity === "asc") {
      sortCriteria.likes = 1;
    } else if (popularity === "desc") {
      sortCriteria.likes = -1;
    }

    // Blog yazılarını filtreleme ve sıralama
    const blogPosts = await BlogPost.find(filter)
      .populate("author", "first_name last_name email")
      .populate("tags", "name")
      .populate("categories", "name")
      .sort(sortCriteria);

    if (blogPosts.length === 0) {
      return res.status(404).json({ message: "No blog posts found with the given criteria." });
    }

    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
