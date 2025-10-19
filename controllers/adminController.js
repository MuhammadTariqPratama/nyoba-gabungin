const { Op } = require("sequelize");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ========================= CRUD =========================

// Ambil semua admin (Pagination + Search)
exports.getAll = async (req, res) => {
  try {
    // Ambil query parameter dari URL
    const page = parseInt(req.query.page) || 1; // halaman saat ini
    const limit = parseInt(req.query.limit) || 10; // jumlah data per halaman
    const offset = (page - 1) * limit;
    const search = req.query.search || ""; // pencarian username

    // Buat kondisi pencarian
    const whereClause = {};
    if (search) {
      whereClause.username = { [Op.like]: `%${search}%` };
    }

    // Ambil data admin dengan pagination dan search
    const { count: totalItems, rows: admin } = await Admin.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["adminID", "ASC"]],
    });

    res.json({
      message: `Berhasil mengambil ${admin.length} data admin.`,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      perPage: limit,
      data: admin,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data admin.",
      error: err.message,
    });
  }
};

// Ambil admin berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({
        message: `Admin dengan ID ${req.params.id} tidak ditemukan.`,
      });
    }
    res.json({
      message: `Berhasil mengambil data admin dengan ID ${req.params.id}.`,
      data: admin,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data admin.",
      error: err.message,
    });
  }
};

// Tambah admin baru
exports.create = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi." });
    }

    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username sudah digunakan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hashedPassword });

    res.status(201).json({
      message: `Admin ${username} berhasil ditambahkan.`,
      data: { id: admin.adminID, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal menambahkan admin.",
      error: err.message,
    });
  }
};

// Update admin
exports.update = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
      return res.status(404).json({
        message: `Admin dengan ID ${req.params.id} tidak ditemukan.`,
      });
    }

    const updateData = { username };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await admin.update(updateData);
    res.json({
      message: `Data admin dengan ID ${req.params.id} berhasil diperbarui.`,
      data: { id: admin.adminID, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal memperbarui data admin.",
      error: err.message,
    });
  }
};

// Hapus admin
exports.delete = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({
        message: `Admin dengan ID ${req.params.id} tidak ditemukan.`,
      });
    }

    await admin.destroy();
    res.json({
      message: `Admin dengan ID ${req.params.id} berhasil dihapus.`,
      deletedData: { id: admin.adminID, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal menghapus admin.",
      error: err.message,
    });
  }
};

// ========================= LOGIN =========================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi." });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(404).json({ message: "Username tidak ditemukan." });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah." });
    }

    const token = jwt.sign(
      { id: admin.adminID, username: admin.username },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login berhasil.",
      data: {
        id: admin.adminID,
        username: admin.username,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal login admin.",
      error: err.message,
    });
  }
};
