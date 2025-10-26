const { Op } = require("sequelize");
const Produk = require("../models/produk");
const Variasi = require("../models/variasi");
const fs = require("fs");
const path = require("path");

// 📍 Ambil semua produk (include variasi) + pagination & search
exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) whereClause.namaProduk = { [Op.like]: `%${search}%` };

    const { rows: produk, count: totalItems } = await Produk.findAndCountAll({
      where: whereClause,
      include: [{ model: Variasi, as: "variasi" }],
      limit,
      offset,
      order: [["produkID", "DESC"]],
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const produkWithUrl = produk.map((item) => ({
      ...item.toJSON(),
      fotoProduk: item.fotoProduk
        ? `${baseUrl}/uploads/produk/${path.basename(item.fotoProduk)}`
        : null,
    }));

    res.status(200).json({
      message: "Data produk berhasil diambil",
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      perPage: limit,
      data: produkWithUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📍 Ambil produk berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id, { include: "variasi" });
    if (!produk) return res.status(404).json({ message: "Produk tidak ditemukan" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const data = produk.toJSON();
    data.fotoProduk = produk.fotoProduk
      ? `${baseUrl}/uploads/produk/${path.basename(produk.fotoProduk)}`
      : null;

    res.status(200).json({
      message: `Data produk dengan ID ${req.params.id} berhasil diambil`
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📍 Tambah produk baru (dengan foto upload)
exports.create = async (req, res) => {
  try {
    const { namaProduk, deskripsi } = req.body;
    const fotoProduk = req.file ? `public/uploads/produk/${req.file.filename}` : null;

    const newProduk = await Produk.create({ namaProduk, deskripsi, fotoProduk });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      data: {
        ...newProduk.toJSON(),
        fotoProduk: fotoProduk
          ? `${baseUrl}/uploads/produk/${path.basename(fotoProduk)}`
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📍 Update produk (dengan foto baru opsional)
exports.update = async (req, res) => {
  try {
    const { namaProduk, deskripsi } = req.body;
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) return res.status(404).json({ message: "Produk tidak ditemukan" });

    let fotoProduk = produk.fotoProduk;
    if (req.file) {
      // hapus foto lama
      if (fotoProduk && fs.existsSync(fotoProduk)) fs.unlinkSync(fotoProduk);
      fotoProduk = `public/uploads/produk/${req.file.filename}`;
    }

    await produk.update({ namaProduk, deskripsi, fotoProduk });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.status(200).json({
      message: "Produk berhasil diperbarui",
      data: {
        ...produk.toJSON(),
        fotoProduk: fotoProduk
          ? `${baseUrl}/uploads/produk/${path.basename(fotoProduk)}`
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Hapus hanya foto produk tanpa hapus data produk
exports.deletePhoto = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    if (!produk.fotoProduk) {
      return res.status(400).json({ message: "Produk ini tidak memiliki foto." });
    }

    const filePath = path.join(__dirname, "..", "public", "uploads", "produk", path.basename(produk.fotoProduk));

    // 🧹 Hapus file fisik jika ada
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🧹 File dihapus: ${filePath}`);
    } else {
      console.warn(`⚠️ File tidak ditemukan di path: ${filePath}`);
    }

    // Update database
    produk.fotoProduk = null;
    await produk.save();

    res.json({ message: "🧹 Foto produk berhasil dihapus!" });
  } catch (error) {
    console.error("❌ Gagal menghapus foto produk:", error);
    res.status(500).json({ message: "Gagal menghapus foto produk", error: error.message });
  }
};


