const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { upload, compressImage } = require("../middlewares/uploadMiddleware");
const Produk = require("../models/produk");
const verifyToken = require("../middlewares/authJWT");

/**
 * @swagger
 * tags:
 *   name: Produk
 *   description: API untuk manajemen data produk
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Produk:
 *       type: object
 *       required:
 *         - namaProduk
 *       properties:
 *         produkID:
 *           type: integer
 *           example: 1
 *         namaProduk:
 *           type: string
 *           example: Kaos Polos
 *         deskripsi:
 *           type: string
 *           example: Kaos polos berbahan katun premium
 *         fotoProduk:
 *           type: string
 *           example: uploads/produk/kaos_polos.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// 🔹 GET Semua Produk
router.get("/", async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const produk = await Produk.findAll();

    const data = produk.map(p => ({
      ...p.toJSON(),
      fotoUrl: p.fotoProduk ? `${baseUrl}/${p.fotoProduk}` : null,
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data produk", error: error.message });
  }
});

// 🔹 POST Tambah Produk
router.post("/", verifyToken, upload.single("fotoProduk"), compressImage, async (req, res) => {
  try {
    const { namaProduk, deskripsi } = req.body;

    if (!namaProduk) {
      return res.status(400).json({ message: "Nama produk wajib diisi!" });
    }

    let fotoProduk = null;
    if (req.file) {
      fotoProduk = req.file.path.replace(/\\/g, "/").replace("public/", "");
    }

    const produkBaru = await Produk.create({
      namaProduk,
      deskripsi,
      fotoProduk,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.status(201).json({
      message: "✅ Produk berhasil ditambahkan!",
      data: {
        ...produkBaru.toJSON(),
        fotoUrl: fotoProduk ? `${baseUrl}/${fotoProduk}` : null,
      },
    });
  } catch (error) {
    console.error("❌ Gagal menambah produk:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

// 🔹 DELETE Produk + Foto
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Hapus file foto jika ada
    if (produk.fotoProduk) {
      const filePath = path.join("public", produk.fotoProduk);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await produk.destroy();
    res.json({ message: "🗑️ Produk berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk", error: error.message });
  }
});

// 🔹 DELETE Foto Produk Saja
router.delete("/:id/hapus-foto", verifyToken, async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    if (!produk.fotoProduk) {
      return res.status(400).json({ message: "Produk ini tidak memiliki foto untuk dihapus" });
    }

    const filePath = path.join("public", produk.fotoProduk);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await produk.update({ fotoProduk: null });

    res.status(200).json({ message: "🧹 Foto produk berhasil dihapus tanpa menghapus datanya!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus foto produk", error: error.message });
  }
});

module.exports = router;
