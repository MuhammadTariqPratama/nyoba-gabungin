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
 *           description: ID unik variasi
 *           example: 1
 *         produkID:
 *           type: integer
 *           description: ID produk yang terkait
 *           example: 3
 *         namaVariasi:
 *           type: string
 *           description: Nama variasi produk
 *           example: Ukuran L
 *         harga:
 *           type: number
 *           format: decimal
 *           description: Harga variasi
 *           example: 125000.00
 *         stok:
 *           type: integer
 *           description: Jumlah stok variasi
 *           example: 50
 *         fotoVariasi:
 *           type: string
 *           description: URL atau path gambar variasi
 *           example: "uploads/variasi/ukuran_l.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-07T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-07T10:10:00Z"
 *         produk:
 *           type: object
 *           description: Data produk yang berelasi
 *           properties:
 *             produkID:
 *               type: integer
 *               example: 3
 *             namaProduk:
 *               type: string
 *               example: "Kaos Polos"
 *             deskripsi:
 *               type: string
 *               example: "Kaos polos berbahan katun premium"
 */

/**
 * @swagger
 * /variasi:
 *   get:
 *     summary: Ambil semua variasi beserta data produk terkait
 *     tags: [Variasi]
 *     security: []         # 🔓 Hilangkan gembok di Swagger
 *     responses:
 *       200:
 *         description: Daftar semua variasi
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
 *     security: []         # 🔓 Hilangkan gembok di Swagger
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail variasi ditemukan
 *       404:
 *         description: Variasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/:id", variasiController.getById);


/**
 * @swagger
 * /variasi:
 *   post:
 *     summary: Tambah variasi baru (butuh token)
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
 *                 example: "Ukuran XL"
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
 *       400:
 *         description: Input tidak lengkap
 *       404:
 *         description: Produk tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post("/", verifyToken, upload.single("fotoVariasi"), compressImage, variasiController.create);

/**
 * @swagger
 * /variasi/{id}:
 *   put:
 *     summary: Perbarui data variasi berdasarkan ID (butuh token)
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
 *                 example: "Ukuran M"
 *               harga:
 *                 type: number
 *                 example: 120000
 *               stok:
 *                 type: integer
 *                 example: 20
 *               fotoVariasi:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Variasi berhasil diperbarui
 *       404:
 *         description: Variasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.put("/:id", verifyToken, upload.single("fotoVariasi"), compressImage, variasiController.update);

/**
 * @swagger
 * /variasi/{id}:
 *   delete:
 *     summary: Hapus variasi berdasarkan ID (butuh token)
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
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.delete("/:id", verifyToken, variasiController.delete);

/**
 * @swagger
 * /variasi/{id}/hapus-foto:
 *   delete:
 *     summary: Hapus hanya foto variasi (tanpa menghapus datanya)
 *     tags: [Variasi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID variasi
 *     responses:
 *       200:
 *         description: Foto variasi berhasil dihapus
 *       400:
 *         description: Variasi tidak memiliki foto
 *       404:
 *         description: Variasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.delete("/:id/hapus-foto", verifyToken, variasiController.deletePhoto);

module.exports = router;
