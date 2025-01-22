const express = require("express");
const router = express.Router();
const Tag = require("../db/models/Tags");

// Yeni etiket oluştur
router.post("/create", async (req, res) => {
    try {
        const { name } = req.body;

        const newTag = new Tag({ name });
        await newTag.save();

        res.status(201).json({ message: "Tag created successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Tüm etiketleri getir
router.get("/", async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
