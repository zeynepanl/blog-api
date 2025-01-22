var express = require('express');
var router = express.Router();
const fs = require("fs");

// Tüm route dosyalarını al
let routes = fs.readdirSync(__dirname);

// Kendi dosyamız hariç diğerlerini yükle
for (let route of routes) {
  if (route.includes(".js") && route !== "index.js") {
    router.use("/" + route.replace(".js", ""), require('./' + route));
  }
}

module.exports = router;
