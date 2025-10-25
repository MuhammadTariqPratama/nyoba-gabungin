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

    res.json({
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

    res.json(data);
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
    res.json({
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

// 📍 Hapus produk + foto dari folder
exports.delete = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) return res.status(404).json({ message: "Produk tidak ditemukan" });

    if (produk.fotoProduk && fs.existsSync(produk.fotoProduk)) {
      fs.unlinkSync(produk.fotoProduk);
    }

    await produk.destroy();
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
