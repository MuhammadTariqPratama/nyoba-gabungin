const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyToken = require("../middlewares/authJWT");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API untuk manajemen data admin
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Username admin untuk login
 *           example: admin123
 *         password:
 *           type: string
 *           description: Kata sandi admin (terenkripsi di database)
 *           example: password123
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Ambil semua data admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua admin berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil 3 data admin.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Token tidak valid
 */
router.get("/", verifyToken, adminController.getAll);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Ambil data admin berdasarkan ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID admin yang ingin diambil
 *     responses:
 *       200:
 *         description: Data admin berhasil ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Data admin tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.get("/:id", verifyToken, adminController.getById);

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Tambah data admin baru
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Admin berhasil ditambahkan
 *       401:
 *         description: Token tidak valid
 */
router.post("/", adminController.create);

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Perbarui data admin berdasarkan ID
 *     tags: [Admin]
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
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Data admin berhasil diperbarui
 *       404:
 *         description: Admin tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.put("/:id", verifyToken, adminController.update);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Hapus data admin berdasarkan ID
 *     tags: [Admin]
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
 *         description: Data admin berhasil dihapus
 *       404:
 *         description: Admin tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.delete("/:id", verifyToken, adminController.delete);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login admin dan dapatkan token JWT
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin_master
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login berhasil, token JWT dikembalikan
 *       401:
 *         description: Username atau password salah
 */
router.post("/login", adminController.login);

module.exports = router;
