require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  CONNECTION_STRING: process.env.CONNECTION_STRING || "mongodb://localhost:27017/blog-api",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || "public/uploads"
};
