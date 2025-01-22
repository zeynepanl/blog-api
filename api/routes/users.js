const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../db/models/Users");
const { JWT_SECRET } = require("../config");

// Kullanıcı kaydı (şifre modelde hashleniyor)
router.post("/register", async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // Yeni kullanıcıyı oluşturuyoruz
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

    // Kullanıcı bulunamazsa
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Şifreyi doğruluyoruz
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // JWT token oluşturuluyor
    const token = jwt.sign(
      { id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Token'ı döndürüyoruz
    res.status(200).json({
      message: "Login successful.",
      token: token,  // JWT token'ı burada döndürülüyor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
