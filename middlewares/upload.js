const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "public/uploads";

    // Tentukan folder berdasarkan route
    if (req.baseUrl.includes("produk")) {
      folder = path.join(folder, "produk");
    } else if (req.baseUrl.includes("variasi")) {
      folder = path.join(folder, "variasi");
    }

    // Pastikan foldernya ada
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
