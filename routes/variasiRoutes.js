const express = require("express");
const router = express.Router();
const variasiController = require("../controllers/variasiController");
const verifyToken = require("../middlewares/authJWT");
const { upload, compressImage } = require("../middlewares/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: Variasi
 *   description: API untuk manajemen data variasi produk
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Variasi:
 *       type: object
 *       required:
 *         - produkID
 *         - namaVariasi
 *         - harga
 *       properties:
 *         variasiID:
 *           type: integer
 *           example: 1
 *         produkID:
 *           type: integer
 *           example: 3
 *         namaVariasi:
 *           type: string
 *           example: Ukuran L
 *         harga:
 *           type: number
 *           format: decimal
 *           example: 125000.00
 *         stok:
 *           type: integer
 *           example: 50
 *         fotoVariasi:
 *           type: string
 *           example: "uploads/variasi/ukuran_l.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         produk:
 *           type: object
 *           properties:
 *             produkID:
 *               type: integer
 *               example: 3
 *             namaProduk:
 *               type: string
 *               example: Kaos Polos
 */

/**
 * @swagger
 * /variasi:
 *   get:
 *     summary: Ambil semua variasi dengan pagination, filter harga, dan pencarian
 *     tags: [Variasi]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Halaman data (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman (default 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama variasi
 *       - in: query
 *         name: minHarga
 *         schema:
 *           type: number
 *         description: Filter harga minimal
 *       - in: query
 *         name: maxHarga
 *         schema:
 *           type: number
 *         description: Filter harga maksimal
 *     responses:
 *       200:
 *         description: Daftar variasi berhasil diambil
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/", variasiController.getAll);

/**
 * @swagger
 * /variasi/{id}:
 *   get:
 *     summary: Ambil variasi berdasarkan ID
 *     tags: [Variasi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data variasi ditemukan
 *       404:
 *         description: Variasi tidak ditemukan
 */
router.get("/:id", variasiController.getById);

/**
 * @swagger
 * /variasi:
 *   post:
 *     summary: Tambah variasi baru (dengan upload foto)
 *     tags: [Variasi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - produkID
 *               - namaVariasi
 *               - harga
 *             properties:
 *               produkID:
 *                 type: integer
 *                 example: 3
 *               namaVariasi:
 *                 type: string
 *                 example: Ukuran XL
 *               harga:
 *                 type: number
 *                 example: 150000
 *               stok:
 *                 type: integer
 *                 example: 30
 *               fotoVariasi:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Variasi berhasil ditambahkan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post(
  "/",
  verifyToken,
  upload.single("fotoVariasi"),
  compressImage,
  variasiController.create
);

/**
 * @swagger
 * /variasi/{id}:
 *   put:
 *     summary: Perbarui data variasi berdasarkan ID
 *     tags: [Variasi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               namaVariasi:
 *                 type: string
 *               harga:
 *                 type: number
 *               stok:
 *                 type: integer
 *               fotoVariasi:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Variasi berhasil diperbarui
 *       404:
 *         description: Variasi tidak ditemukan
 */
router.put(
  "/:id",
  verifyToken,
  upload.single("fotoVariasi"),
  compressImage,
  variasiController.update
);

/**
 * @swagger
 * /variasi/{id}:
 *   delete:
 *     summary: Hapus variasi berdasarkan ID
 *     tags: [Variasi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Variasi berhasil dihapus
 *       404:
 *         description: Variasi tidak ditemukan
 */
router.delete("/:id", verifyToken, variasiController.delete);

/**
 * @swagger
 * /variasi/{id}/hapus-foto:
 *   delete:
 *     summary: Hapus hanya foto variasi tanpa hapus data
 *     tags: [Variasi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foto variasi berhasil dihapus
 *       400:
 *         description: Variasi tidak memiliki foto
 *       404:
 *         description: Variasi tidak ditemukan
 */
router.delete("/:id/hapus-foto", verifyToken, variasiController.deletePhoto);

module.exports = router;
