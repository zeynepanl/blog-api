const express = require("express");
const router = express.Router();
const Category = require("../db/models/Categories");
const authenticateToken = require("../lib/auth");  // JWT doğrulama middleware'i

// Yeni kategori oluşturma (JWT doğrulama)
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json({ message: "Category created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm kategorileri getirme
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Kategori güncelleme (JWT doğrulama)
router.post("/update", authenticateToken, async (req, res) => {
  try {
    const { id, name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true } // Güncellenmiş kategori verisini döndür
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.status(200).json({ message: "Category updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kategori silme (JWT doğrulama)
router.post("/delete", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
