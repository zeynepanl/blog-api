const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// JWT doğrulama middleware
const authenticateToken = (req, res, next) => {
  try {
    // Authorization header'ı kontrol et
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    // "Bearer " kısmını temizleyerek token'i al
    const token = authHeader.split(" ")[1];

    // Token doğrulama
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Kullanıcı bilgilerini request'e ekliyoruz.
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
