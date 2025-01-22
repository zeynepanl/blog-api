var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var compression = require('compression');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var mongoose = require('mongoose');
require('dotenv').config();

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware'ler
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS ayarları (Tüm kaynaklara izin vermek için)
app.use(cors());

// HTTP güvenliği için Helmet
app.use(helmet());

// GZIP sıkıştırma
app.use(compression());

// Rate Limiting (IP başına 15 dakikada 100 istek)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100,  // IP başına maksimum 100 istek
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// API Rotaları
app.use("/api", require("./routes"));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Genel hata yönetimi
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Hata sayfasını render et
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
