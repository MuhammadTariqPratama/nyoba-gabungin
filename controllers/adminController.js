const Admin = require("../models/admin")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// ========================= CRUD =========================

// Ambil semua admin
exports.getAll = async (req, res) => {
    try {
        const admin = await Admin.findAll()
        res.json({
            message: `Berhasil mengambil ${admin.length} data admin.`,
            data: admin
        })
    } catch (err) {
        res.status(500).json({
            message: "Gagal mengambil data admin.",
            error: err.message
        })
    }
}

// Ambil admin berdasarkan ID
exports.getById = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id)
        if (!admin) {
            return res.status(404).json({
                message: `Admin dengan ID ${req.params.id} tidak ditemukan.`
            })
        }
        res.json({
            message: `Berhasil mengambil data admin dengan ID ${req.params.id}.`,
            data: admin
        })
    } catch (err) {
        res.status(500).json({
            message: "Gagal mengambil data admin.",
            error: err.message
        })
    }
}

// Tambah admin baru
exports.create = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username dan password wajib diisi." })
        }

        // Cek apakah username sudah ada
        const existingAdmin = await Admin.findOne({ where: { username } })
        if (existingAdmin) {
            return res
                .status(400)
                .json({ message: "Username sudah digunakan." })
        }

        // Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10)

        const admin = await Admin.create({ username, password: hashedPassword })
        res.status(201).json({
            message: `Admin ${username} berhasil ditambahkan.`,
            data: { id: admin.adminID, username: admin.username }
        })
    } catch (err) {
        res.status(500).json({
            message: "Gagal menambahkan admin.",
            error: err.message
        })
    }
}

// Update admin
exports.update = async (req, res) => {
    try {
        const { username, password } = req.body
        const admin = await Admin.findByPk(req.params.id)

        if (!admin) {
            return res.status(404).json({
                message: `Admin dengan ID ${req.params.id} tidak ditemukan.`
            })
        }

        const updateData = { username }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        await admin.update(updateData)
        res.json({
            message: `Data admin dengan ID ${req.params.id} berhasil diperbarui.`,
            data: { id: admin.adminID, username: admin.username }
        })
    } catch (err) {
        res.status(500).json({
            message: "Gagal memperbarui data admin.",
            error: err.message
        })
    }
}

// Hapus admin
exports.delete = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id)
        if (!admin) {
            return res.status(404).json({
                message: `Admin dengan ID ${req.params.id} tidak ditemukan.`
            })
        }

        await admin.destroy()
        res.json({
            message: `Admin dengan ID ${req.params.id} berhasil dihapus.`,
            deletedData: { id: admin.adminID, username: admin.username }
        })
    } catch (err) {
        res.status(500).json({
            message: "Gagal menghapus admin.",
            error: err.message
        })
    }
}

// ========================= LOGIN =========================
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body

        // Validasi input
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username dan password wajib diisi." })
        }

        // Cari admin berdasarkan username
        const admin = await Admin.findOne({ where: { username } })
        if (!admin) {
            return res
                .status(404)
                .json({ message: "Username tidak ditemukan." })
        }

        // Cek kecocokan password
        const validPassword = await bcrypt.compare(password, admin.password)
        if (!validPassword) {
            return res.status(401).json({ message: "Password salah." })
        }

        // Buat token JWT
        const token = jwt.sign(
            { id: admin.adminID, username: admin.username },
            process.env.JWT_SECRET || "secretkey", // pastikan JWT_SECRET ada di .env
            { expiresIn: "2h" }
        )

        res.json({
            message: "Login berhasil.",
            data: {
                id: admin.adminID,
                username: admin.username,
                token: token
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "Gagal login admin.",
            error: err.message
        })
    }
}
