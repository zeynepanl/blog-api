const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../db/models/Users");
const { JWT_SECRET } = require("../config");
const authenticateToken = require("../lib/auth");  // JWT doğrulama middleware

// Dosya yükleme ayarları (profile_image için)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');  // Yüklenen dosya 'public/uploads' dizinine kaydedilecek
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Benzersiz dosya adı oluşturuluyor
  }
});
const upload = multer({ storage: storage });

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

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token: token,  // JWT token'ı burada döndürülüyor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kullanıcı profilini güncelleme (Resim de dahil)
router.post("/update", authenticateToken, upload.single('profile_image'), async (req, res) => {
  try {
    const userId = req.user.id;  // JWT'den gelen kullanıcı ID'si
    const { first_name, last_name, email } = req.body;
    let profile_image = req.file ? req.file.filename : undefined; // Yalnızca dosya adını kaydet

    // Güncellenecek alanları filtrele
    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;
    if (profile_image) updateData.profile_image = profile_image;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,  // Güncellenen bilgiler
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kullanıcı profilini getirme
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;  // JWT'den gelen kullanıcı ID'si

    const user = await User.findById(userId).select("-password"); // Şifreyi hariç tut
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
