const express = require("express");
const router = express.Router();
const pemasokController = require("../controllers/pemasokController");
const verifyToken = require("../middlewares/authJWT");

/**
 * @swagger
 * tags:
 *   name: Pemasok
 *   description: API untuk manajemen data pemasok
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pemasok:
 *       type: object
 *       required:
 *         - namaPemasok
 *         - alamatPemasok
 *         - noTelp
 *         - email
 *       properties:
 *         pemasokID:
 *           type: integer
 *           description: ID unik pemasok
 *           example: 1
 *         namaPemasok:
 *           type: string
 *           description: Nama lengkap pemasok
 *           example: PT Sumber Rezeki
 *         alamatPemasok:
 *           type: string
 *           description: Alamat lengkap pemasok
 *           example: Jl. Merdeka No.10, Jakarta
 *         noTelp:
 *           type: string
 *           description: Nomor telepon pemasok
 *           example: "08123456789"
 *         keterangan:
 *           type: string
 *           description: Informasi tambahan tentang pemasok
 *           example: Pemasok utama bahan baku
 *         email:
 *           type: string
 *           description: Alamat email pemasok
 *           example: info@sumberrezeki.co.id
 */

/**
 * @swagger
 * /pemasok:
 *   get:
 *     summary: Ambil semua data pemasok
 *     tags: [Pemasok]
 *     responses:
 *       200:
 *         description: Daftar semua pemasok berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil 3 data pemasok.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pemasok'
 */
router.get("/", pemasokController.getAll);

/**
 * @swagger
 * /pemasok/{id}:
 *   get:
 *     summary: Ambil data pemasok berdasarkan ID
 *     tags: [Pemasok]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pemasok yang ingin diambil
 *     responses:
 *       200:
 *         description: Data pemasok berhasil ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pemasok'
 *       404:
 *         description: Data pemasok tidak ditemukan
 */
router.get("/:id", pemasokController.getById);

/**
 * @swagger
 * /pemasok:
 *   post:
 *     summary: Tambah data pemasok baru
 *     tags: [Pemasok]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pemasok'
 *     responses:
 *       201:
 *         description: Pemasok berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pemasok "PT Sumber Rezeki" berhasil ditambahkan.
 *                 data:
 *                   $ref: '#/components/schemas/Pemasok'
 *       401:
 *         description: Token tidak valid atau tidak ada
 */
router.post("/", verifyToken, pemasokController.create);

/**
 * @swagger
 * /pemasok/{id}:
 *   put:
 *     summary: Perbarui data pemasok berdasarkan ID
 *     tags: [Pemasok]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pemasok yang ingin diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pemasok'
 *     responses:
 *       200:
 *         description: Data pemasok berhasil diperbarui
 *       404:
 *         description: Pemasok tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.put("/:id", verifyToken, pemasokController.update);

/**
 * @swagger
 * /pemasok/{id}:
 *   delete:
 *     summary: Hapus data pemasok berdasarkan ID
 *     tags: [Pemasok]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pemasok yang ingin dihapus
 *     responses:
 *       200:
 *         description: Data pemasok berhasil dihapus
 *       404:
 *         description: Data pemasok tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.delete("/:id", verifyToken, pemasokController.delete);

module.exports = router;
