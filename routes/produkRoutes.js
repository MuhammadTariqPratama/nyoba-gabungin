const express = require("express");
const router = express.Router();
const produkController = require("../controllers/produkController");
const verifyToken = require("../middlewares/authJWT");
const upload = require("../middlewares/upload");

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
 *           description: URL foto produk
 *           example: "uploads/kaos_polos.jpg"
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
router.get("/", produkController.getAll);

/**
 * @swagger
 * /produk/{id}:
 *   get:
 *     summary: Ambil detail produk berdasarkan ID
 *     tags: [Produk]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID produk
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail produk ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produk'
 *       404:
 *         description: Produk tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/:id", produkController.getById);

/**
 * @swagger
 * /produk:
 *   post:
 *     summary: Tambah produk baru (butuh token)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 example: "uploads/kemeja_batik.jpg"
 *     responses:
 *       200:
 *         description: Produk berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produk ditambahkan
 *                 produk:
 *                   $ref: '#/components/schemas/Produk'
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post("/", verifyToken, upload.single("fotoProduk"), produkController.create);

/**
 * @swagger
 * /produk/{id}:
 *   put:
 *     summary: Perbarui data produk berdasarkan ID (butuh token)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namaProduk:
 *                 type: string
 *                 example: "Kemeja Lengan Panjang"
 *               deskripsi:
 *                 type: string
 *                 example: "Kemeja formal warna biru"
 *               fotoProduk:
 *                 type: string
 *                 example: "uploads/kemeja_baru.jpg"
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *       404:
 *         description: Produk tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.put("/:id", verifyToken, upload.single("fotoProduk"), produkController.update);

/**
 * @swagger
 * /produk/{id}:
 *   delete:
 *     summary: Hapus produk berdasarkan ID (butuh token)
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
router.delete("/:id", verifyToken, produkController.delete);

module.exports = router;
