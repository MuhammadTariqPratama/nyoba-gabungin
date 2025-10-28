const express = require("express");
const router = express.Router();
const alurBarangController = require("../controllers/alurBarangController");
const verifyToken = require("../middlewares/authJWT");

/**
 * @swagger
 * tags:
 *   name: AlurBarang
 *   description: API untuk manajemen data alur keluar-masuk barang
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
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
 *     summary: Ambil semua data alur barang (dengan pagination, search, dan filter)
 *     tags: [AlurBarang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Halaman yang ingin ditampilkan (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman (default 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan jenis alur
 *       - in: query
 *         name: lokasi
 *         schema:
 *           type: string
 *         description: Filter berdasarkan lokasi produk
 *     responses:
 *       200:
 *         description: Daftar alur barang berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               message: "Berhasil mengambil 2 data alur barang."
 *               currentPage: 1
 *               totalPages: 1
 *               totalItems: 2
 *               perPage: 10
 *               data:
 *                 - alurBarangID: 1
 *                   jenisAlur: Masuk
 *                   tanggal: 2025-10-05
 *                   jumlah: 30
 *                   lokasiProduk: Gudang A
 *                   keterangan: Barang diterima dari pemasok utama
 *                   variasi:
 *                     variasiID: 3
 *                     namaVariasi: "Botol 500ml"
 *                     stok: 120
 *                     harga: 15000
 *                   admin:
 *                     adminID: 1
 *                     username: "admin"
 *       401:
 *         description: Token tidak valid atau tidak disertakan
 */
router.get("/", verifyToken, alurBarangController.getAll);

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
 *         description: ID alur barang
 *     responses:
 *       200:
 *         description: Data alur barang berhasil ditemukan
 *         content:
 *           application/json:
 *             example:
 *               message: "Berhasil mengambil data alur barang dengan ID 1."
 *               data:
 *                 alurBarangID: 1
 *                 jenisAlur: Keluar
 *                 tanggal: 2025-10-06
 *                 jumlah: 15
 *                 lokasiProduk: Toko Utama
 *                 variasiID: 3
 *                 adminID: 1
 *       404:
 *         description: Data tidak ditemukan
 */
router.get("/:id", verifyToken, alurBarangController.getById);

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
 *         content:
 *           application/json:
 *             example:
 *               message: "Alur barang baru berhasil ditambahkan."
 *               data:
 *                 alurBarangID: 5
 *                 jenisAlur: Masuk
 *                 tanggal: 2025-10-07
 *                 jumlah: 50
 *                 lokasiProduk: Gudang B
 *                 variasiID: 2
 *                 adminID: 1
 *       400:
 *         description: Data tidak lengkap
 */
router.post("/", verifyToken, alurBarangController.create);

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
 *         description: ID alur barang yang ingin diperbarui
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
 */
router.put("/:id", verifyToken, alurBarangController.update);

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
 *         description: ID alur barang yang ingin dihapus
 *     responses:
 *       204:
 *         description: Data alur barang berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 */
router.delete("/:id", verifyToken, alurBarangController.delete);

module.exports = router;
