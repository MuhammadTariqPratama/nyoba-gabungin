const express = require("express")
const router = express.Router()
const alurBarangController = require("../controllers/alurBarangController")
const verifyToken = require("../middlewares/authJWT")

/**
 * @swagger
 * tags:
 *   name: AlurBarang
 *   description: API untuk manajemen data alur keluar-masuk barang
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AlurBarang:
 *       type: object
 *       required:
 *         - jenisAlur
 *         - tanggal
 *         - jumlah
 *         - variasiID
 *         - adminID
 *       properties:
 *         alurBarangID:
 *           type: integer
 *           example: 1
 *         jenisAlur:
 *           type: string
 *           example: Masuk
 *         tanggal:
 *           type: string
 *           format: date
 *           example: 2025-10-05
 *         jumlah:
 *           type: integer
 *           example: 30
 *         lokasiProduk:
 *           type: string
 *           example: Gudang A
 *         keterangan:
 *           type: string
 *           example: Barang diterima dari pemasok utama
 *         variasiID:
 *           type: integer
 *           example: 3
 *         adminID:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /alurbarang:
 *   get:
 *     summary: Ambil semua data alur barang (termasuk admin dan variasi)
 *     tags: [AlurBarang]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua alur barang berhasil diambil
 *       401:
 *         description: Token tidak valid
 */
router.get("/", verifyToken, alurBarangController.getAll)

/**
 * @swagger
 * /alurbarang/{id}:
 *   get:
 *     summary: Ambil data alur barang berdasarkan ID
 *     tags: [AlurBarang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Data alur barang berhasil ditemukan
 *       404:
 *         description: Data tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.get("/:id", verifyToken, alurBarangController.getById)

/**
 * @swagger
 * /alurbarang:
 *   post:
 *     summary: Tambah data alur barang baru
 *     tags: [AlurBarang]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlurBarang'
 *     responses:
 *       201:
 *         description: Data alur barang berhasil ditambahkan
 *       400:
 *         description: Data tidak lengkap
 *       401:
 *         description: Token tidak valid
 */
router.post("/", verifyToken, alurBarangController.create)

/**
 * @swagger
 * /alurbarang/{id}:
 *   put:
 *     summary: Perbarui data alur barang berdasarkan ID
 *     tags: [AlurBarang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlurBarang'
 *     responses:
 *       200:
 *         description: Data alur barang berhasil diperbarui
 *       404:
 *         description: Data tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.put("/:id", verifyToken, alurBarangController.update)

/**
 * @swagger
 * /alurbarang/{id}:
 *   delete:
 *     summary: Hapus data alur barang berdasarkan ID
 *     tags: [AlurBarang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Data alur barang berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.delete("/:id", verifyToken, alurBarangController.delete)

module.exports = router
