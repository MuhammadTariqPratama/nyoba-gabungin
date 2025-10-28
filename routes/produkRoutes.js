// routes/produkRoutes.js
const express = require("express");
const router = express.Router();
const produkController = require("../controllers/produkController");
const verifyToken = require("../middlewares/authJWT");
const { upload, compressImage } = require("../middlewares/uploadMiddleware");
const Produk = require("../models/produk");
const fs = require("fs");
const path = require("path");

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
 *         namaProduk:
 *           type: string
 *           description: Nama produk
 *         deskripsi:
 *           type: string
 *           description: Deskripsi produk
 *         fotoProduk:
 *           type: string
 *           description: Path atau URL foto produk
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /produk:
 *   get:
 *     summary: Ambil semua produk (dengan pagination & search opsional)
 *     tags: [Produk]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman untuk pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian nama produk
 *     responses:
 *       200:
 *         description: Daftar produk berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data produk berhasil diambil
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 perPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produk'
 */
router.get("/", produkController.getAll);

/**
 * @swagger
 * /produk/{id}:
 *   get:
 *     summary: Ambil produk berdasarkan ID
 *     tags: [Produk]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk yang ingin diambil
 *     responses:
 *       200:
 *         description: Data produk berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produk'
 *       404:
 *         description: Produk tidak ditemukan
 */
router.get("/:id", produkController.getById);

/**
 * @swagger
 * /produk:
 *   post:
 *     summary: Tambah produk baru (dengan upload foto opsional)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               namaProduk:
 *                 type: string
 *                 example: Hoodie Hangat
 *               deskripsi:
 *                 type: string
 *                 example: Hoodie berbahan fleece premium
 *               fotoProduk:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Produk berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Token tidak valid
 */
router.post(
  "/",
  verifyToken,
  upload.single("fotoProduk"),
  compressImage,
  produkController.create
);

/**
 * @swagger
 * /produk/{id}:
 *   put:
 *     summary: Perbarui data produk berdasarkan ID (dengan upload foto opsional)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk yang ingin diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               namaProduk:
 *                 type: string
 *                 example: Kaos Polos Premium
 *               deskripsi:
 *                 type: string
 *                 example: Kaos polos bahan katun combed 30s
 *               fotoProduk:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *       404:
 *         description: Produk tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.put(
  "/:id",
  verifyToken,
  upload.single("fotoProduk"),
  compressImage,
  produkController.update
);

/**
 * @swagger
 * /produk/{id}:
 *   delete:
 *     summary: Hapus produk berdasarkan ID
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
 *       401:
 *         description: Token tidak valid
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) return res.status(404).json({ message: "Produk tidak ditemukan" });

    if (produk.fotoProduk && fs.existsSync(produk.fotoProduk)) {
      fs.unlinkSync(produk.fotoProduk);
    }

    await produk.destroy();
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /produk/{id}/foto:
 *   delete:
 *     summary: Hapus hanya foto produk tanpa menghapus data produknya
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk yang ingin dihapus fotonya
 *     responses:
 *       200:
 *         description: Foto produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 *       400:
 *         description: Produk tidak memiliki foto
 *       401:
 *         description: Token tidak valid
 */
router.delete("/:id/foto", verifyToken, produkController.deletePhoto);

module.exports = router;
