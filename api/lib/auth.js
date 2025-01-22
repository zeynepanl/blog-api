const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// JWT doğrulama middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Kullanıcı bilgilerini request'e ekliyoruz.
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticateToken;
