const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "public/uploads";

    if (req.baseUrl.includes("produk")) {
      folder = path.join(folder, "produk");
    } else if (req.baseUrl.includes("variasi")) {
      folder = path.join(folder, "variasi");
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
    }
    cb(null, true);
  },
});

// Middleware untuk kompres gambar
const compressImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const filePath = req.file.path;
    const tempPath = filePath + "-tmp.jpg";

    await sharp(filePath)
      .resize({ width: 800 })
      .jpeg({ quality: 70 })
      .toFile(tempPath);

    fs.renameSync(tempPath, filePath);

    console.log("✅ Gambar berhasil dikompres:", filePath);
    next();
  } catch (err) {
    console.error("❌ Gagal kompres gambar:", err);
    next(err);
  }
};

module.exports = { upload, compressImage };
