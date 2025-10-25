const express = require("express");
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
 *           description: ID unik produk
 *           example: 1
 *         namaProduk:
 *           type: string
 *           description: Nama produk
 *           example: Kaos Polos
 *         deskripsi:
 *           type: string
 *           description: Deskripsi produk
 *           example: Kaos polos berbahan katun premium
 *         fotoProduk:
 *           type: string
 *           description: Path atau URL foto produk
 *           example: uploads/produk/kaos_polos.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-07T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-07T10:10:00Z"
 */

/**
 * @swagger
 * /produk:
 *   get:
 *     summary: Ambil semua produk
 *     tags: [Produk]
 *     responses:
 *       200:
 *         description: Daftar semua produk
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produk'
 *       500:
 *         description: Terjadi kesalahan pada server
 */
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

/**
 * @swagger
 * /produk:
 *   post:
 *     summary: Tambah produk baru (dengan upload foto dan kompresi)
 *     tags: [Produk]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - namaProduk
 *             properties:
 *               namaProduk:
 *                 type: string
 *                 example: "Kemeja Batik"
 *               deskripsi:
 *                 type: string
 *                 example: "Kemeja batik dengan motif modern"
 *               fotoProduk:
 *                 type: string
 *                 format: binary
 *                 description: Gambar produk
 *     responses:
 *       201:
 *         description: Produk berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produk'
 *       400:
 *         description: Data tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */
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

/**
 * @swagger
 * /produk/{id}:
 *   delete:
 *     summary: Hapus produk berdasarkan ID (dan hapus foto dari server)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk yang ingin dihapus
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Hapus file foto jika ada
    if (produk.fotoProduk) {
      const fs = require("fs");
      const filePath = path.join("public", produk.fotoProduk);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await produk.destroy();
    res.json({ message: "🗑️ Produk berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk", error: error.message });
  }
});

module.exports = router;
