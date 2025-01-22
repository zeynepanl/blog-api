const express = require("express");
const router = express.Router();
const User = require("../db/models/Users");

// Kullanıcı kaydı (şifre modelde hashleniyor)
router.post("/register", async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    
    const newUser = new User({ email, password, first_name, last_name });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kullanıcı giriş işlemi (şifre doğrulaması model metodu ile yapılıyor)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
